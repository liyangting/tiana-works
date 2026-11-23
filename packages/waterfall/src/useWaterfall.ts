import {
  isRef,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  shallowRef,
  watch,
  type Ref,
  type ShallowRef,
} from 'vue'

export type WaterfallScrollTarget =
  string | HTMLElement | Window | Ref<HTMLElement | Window | null | undefined> | null | undefined

export interface WaterfallFetchParams {
  page: number
  pageSize: number
}

export interface WaterfallFetchResult<T> {
  list: T[]
  total?: number
}

export interface UseWaterfallOptions<T> {
  fetcher: (params: WaterfallFetchParams) => Promise<WaterfallFetchResult<T> | null | undefined>
  pageSize?: number
  target: WaterfallScrollTarget
  offset?: number
}

export interface UseWaterfallReturn<T> {
  list: ShallowRef<T[]>
  loading: Ref<boolean>
  finished: Ref<boolean>
  total: Ref<number | null>
  error: ShallowRef<unknown>
  loadMore: () => Promise<void>
  refresh: () => Promise<void>
  reset: () => Promise<void>
}

interface ScrollMetrics {
  scrollHeight: number
  scrollTop: number
  clientHeight: number
}

const DEFAULT_PAGE_SIZE = 20
const DEFAULT_OFFSET = 200
const AUTO_FILL_MAX_PAGES = 10

const isBrowser = (): boolean => typeof window !== 'undefined' && typeof document !== 'undefined'

/**
 * 瀑布流分页钩子：负责页码推进、请求批次隔离、触底检测与首屏自动补屏。
 * 只维护数据与状态，不渲染任何 UI。
 */
export function useWaterfall<T>(options: UseWaterfallOptions<T>): UseWaterfallReturn<T> {
  const pageSize = Math.max(1, Math.floor(options.pageSize ?? DEFAULT_PAGE_SIZE))
  const offset = Math.max(0, options.offset ?? DEFAULT_OFFSET)

  const list = shallowRef<T[]>([])
  const loading = ref(false)
  const finished = ref(false)
  const total = ref<number | null>(null)
  const error = shallowRef<unknown>(null)

  /** 下一次要请求的页码；只在请求成功后才推进。 */
  let page = 0
  /** 数据批次号：refresh / reset 递增，旧批次返回后直接丢弃。 */
  let requestId = 0
  /** 当前占用 loading 的批次，旧请求 finally 不得关闭新批次 loading。 */
  let loadingRid = 0
  let targetEl: HTMLElement | null = null
  let targetWatch: ReturnType<typeof watch> | null = null

  function resolveTarget(): HTMLElement | Window | null {
    if (!isBrowser()) return null
    const raw = isRef(options.target) ? options.target.value : options.target
    if (!raw) return null
    if (raw === window) return window
    if (typeof raw === 'string') {
      const el = document.querySelector(raw)
      return el instanceof HTMLElement ? el : null
    }
    if (raw instanceof HTMLElement) return raw
    return null
  }

  function eventElement(event: Event): HTMLElement | null {
    if (typeof HTMLElement === 'undefined') return null
    return event.target instanceof HTMLElement ? event.target : null
  }

  function asElement(target: HTMLElement | Window | null): HTMLElement | null {
    if (typeof HTMLElement === 'undefined') return null
    return target instanceof HTMLElement ? target : null
  }

  function isScrollable(el: HTMLElement): boolean {
    if (!isBrowser()) return false
    const { overflowY } = window.getComputedStyle(el)
    const allowsScroll = overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay'
    return allowsScroll && (el.scrollHeight > el.clientHeight + 1 || el.scrollTop > 0)
  }

  function elementMetrics(el: HTMLElement): ScrollMetrics {
    return { scrollHeight: el.scrollHeight, scrollTop: el.scrollTop, clientHeight: el.clientHeight }
  }

  function windowMetrics(): ScrollMetrics | null {
    if (!isBrowser()) return null
    const scrolling = document.scrollingElement ?? document.documentElement
    return {
      scrollHeight: scrolling.scrollHeight,
      scrollTop: scrolling.scrollTop,
      clientHeight: window.innerHeight,
    }
  }

  /** 容器不是滚动容器时，用容器相对视口 bottom 估算距离。 */
  function containerBottomMetrics(el: HTMLElement): ScrollMetrics {
    const rect = el.getBoundingClientRect()
    return { scrollHeight: rect.bottom, scrollTop: 0, clientHeight: window.innerHeight }
  }

  function isNearBottom(metrics: ScrollMetrics): boolean {
    return metrics.scrollHeight - (metrics.scrollTop + metrics.clientHeight) <= offset
  }

  /** 内容是否不足一屏，供首屏自动补屏使用。 */
  function isContentShort(): boolean {
    if (!isBrowser()) return false
    const target = resolveTarget()
    const targetElement = asElement(target)

    if (targetElement && isScrollable(targetElement)) {
      return targetElement.scrollHeight <= targetElement.clientHeight + offset
    }
    if (targetElement) {
      return targetElement.getBoundingClientRect().bottom <= window.innerHeight + offset
    }
    const metrics = windowMetrics()
    return metrics ? metrics.scrollHeight <= metrics.clientHeight + offset : false
  }

  async function fetchNextPage(rid: number): Promise<boolean> {
    if (rid !== requestId || finished.value) return false
    // 同一批次内已有请求在跑时不再并发
    if (loading.value && loadingRid === rid) return false

    const nextPage = page + 1
    loading.value = true
    loadingRid = rid
    let added = false

    try {
      const result = await options.fetcher({ page: nextPage, pageSize })
      // 旧批次结果直接丢弃，不回填列表也不改状态
      if (rid !== requestId) return false

      page = nextPage
      error.value = null

      const chunk: T[] = Array.isArray(result?.list) ? result.list : []
      if (chunk.length > 0) {
        list.value = [...list.value, ...chunk]
        added = true
      }

      if (result && typeof result.total === 'number' && Number.isFinite(result.total)) {
        total.value = result.total
      }

      if (
        chunk.length === 0 ||
        chunk.length < pageSize ||
        (total.value !== null && list.value.length >= total.value)
      ) {
        finished.value = true
      }

      return added
    } catch (err) {
      if (rid === requestId) error.value = err
      return false
    } finally {
      if (loadingRid === rid) {
        loading.value = false
        loadingRid = 0
      }
    }
  }

  async function autoFill(rid: number): Promise<void> {
    let remaining = AUTO_FILL_MAX_PAGES
    while (rid === requestId && !finished.value && remaining > 0) {
      await nextTick()
      if (rid !== requestId || finished.value) return
      if (!isContentShort()) return

      const before = list.value.length
      const added = await fetchNextPage(rid)
      if (rid !== requestId) return
      // 本次没有新增数据时立即停止，避免重复请求同一页
      if (!added || list.value.length <= before) return
      remaining -= 1
    }
  }

  async function loadMore(): Promise<void> {
    if (finished.value || loading.value) return
    await fetchNextPage(requestId)
  }

  async function refresh(): Promise<void> {
    requestId += 1
    const rid = requestId
    page = 0
    list.value = []
    finished.value = false
    total.value = null
    error.value = null
    loading.value = false
    loadingRid = 0

    const added = await fetchNextPage(rid)
    if (rid !== requestId) return
    if (added) await autoFill(rid)
  }

  async function reset(): Promise<void> {
    await refresh()
  }

  function handleScroll(event: Event): void {
    if (!isBrowser() || loading.value || finished.value) return

    const target = resolveTarget()
    const targetElement = asElement(target)
    const source = eventElement(event)

    let metrics: ScrollMetrics
    if (targetElement && isScrollable(targetElement)) {
      // 只响应目标容器自身的滚动，过滤页面或其他容器的滚动源
      if (source !== targetElement) return
      metrics = elementMetrics(targetElement)
    } else if (source && isScrollable(source)) {
      metrics = elementMetrics(source)
    } else if (targetElement) {
      metrics = containerBottomMetrics(targetElement)
    } else {
      const viewportMetrics = windowMetrics()
      if (!viewportMetrics) return
      metrics = viewportMetrics
    }

    if (isNearBottom(metrics)) void loadMore()
  }

  function attachTargetListener(): void {
    if (!isBrowser()) return
    const target = resolveTarget()
    const next = asElement(target)
    if (next === targetEl) return
    if (targetEl) targetEl.removeEventListener('scroll', handleScroll)
    targetEl = next
    if (targetEl) targetEl.addEventListener('scroll', handleScroll, { passive: true })
  }

  function detachListeners(): void {
    if (!isBrowser()) return
    window.removeEventListener('scroll', handleScroll)
    document.removeEventListener('scroll', handleScroll, true)
    if (targetEl) {
      targetEl.removeEventListener('scroll', handleScroll)
      targetEl = null
    }
  }

  onMounted(() => {
    if (!isBrowser()) return
    attachTargetListener()
    window.addEventListener('scroll', handleScroll, { passive: true })
    document.addEventListener('scroll', handleScroll, { passive: true, capture: true })
    void refresh()
  })

  targetWatch = watch(
    () => {
      if (!isRef(options.target)) return null
      return options.target.value ?? null
    },
    () => attachTargetListener(),
    { flush: 'post' },
  )

  onUnmounted(() => {
    targetWatch?.()
    targetWatch = null
    detachListeners()
  })

  return { list, loading, finished, total, error, loadMore, refresh, reset }
}
