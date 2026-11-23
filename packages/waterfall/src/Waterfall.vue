<template>
  <div ref="rootEl" class="lyt-waterfall" :style="rootStyle">
    <div
      v-for="(column, columnIndex) in columnBuckets"
      :key="`lyt-waterfall-column-${columnCount}-${columnIndex}`"
      class="lyt-waterfall__column"
      :style="columnStyle"
    >
      <div
        v-for="entry in column"
        :key="entry.key"
        :ref="itemRefSetter(entry.key)"
        class="lyt-waterfall__item"
        :data-lyt-waterfall-key="entry.key"
      >
        <slot :item="entry.item" :index="entry.index" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends Record<string, any>">
import {
  computed,
  onBeforeUnmount,
  onMounted,
  onUpdated,
  ref,
  watch,
  type CSSProperties,
  type VNode,
} from 'vue'
import type { WaterfallColumnItem, WaterfallProps, WaterfallSlotProps } from './types'

const props = withDefaults(defineProps<WaterfallProps<T>>(), {
  items: () => [],
  columns: 4,
  gap: '16px',
})

defineSlots<{
  default(props: WaterfallSlotProps<T>): VNode[]
}>()

const DEFAULT_ITEM_HEIGHT = 160

const rootEl = ref<HTMLElement | null>(null)
const containerWidth = ref(0)
const measuredHeights = ref<Record<string, number>>({})

/** key -> 当前挂载的 item 外层 DOM，供 ResizeObserver 反查与清理。 */
const itemElements = new Map<string, HTMLElement>()
/** 缓存模板 ref 回调，避免每次渲染更换函数引用导致反复 observe。 */
const refSetters = new Map<string, (el: unknown) => void>()

let containerObserver: ResizeObserver | null = null
let itemObserver: ResizeObserver | null = null
let resizeFallbackAttached = false

function toPixel(value: number | string | undefined | null): number | null {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null
  }
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  if (!/^\d+(?:\.\d+)?px$/i.test(trimmed)) return null
  const parsed = Number.parseFloat(trimmed)
  return Number.isFinite(parsed) ? parsed : null
}

function normalizeColumns(value: number | undefined): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) return 1
  return Math.max(1, Math.floor(value))
}

function fallbackViewportWidth(): number {
  if (typeof window === 'undefined') return 0
  return window.innerWidth || document.documentElement?.clientWidth || 0
}

const gapCss = computed(() => (typeof props.gap === 'number' ? `${props.gap}px` : props.gap))
const gapPx = computed(() => toPixel(props.gap) ?? 0)
const hasItemWidth = computed(
  () => props.itemWidth !== undefined && props.itemWidth !== null && props.itemWidth !== '',
)
const itemWidthCss = computed(() => {
  if (typeof props.itemWidth === 'number') return `${props.itemWidth}px`
  return props.itemWidth ?? ''
})
const itemWidthPx = computed(() => toPixel(props.itemWidth))

const columnCount = computed(() => {
  const width = containerWidth.value

  if (hasItemWidth.value) {
    const fixedWidth = itemWidthPx.value
    if (fixedWidth !== null && fixedWidth > 0 && width > 0) {
      const gap = gapPx.value
      return Math.max(1, Math.floor((width + gap) / (fixedWidth + gap)))
    }
    // 非 px 的宽度无法参与推导，回退到显式列数
    return normalizeColumns(props.columns)
  }

  const responsive = props.responsiveColumns
  if (responsive && width > 0) {
    let bestBreakpoint = Number.NEGATIVE_INFINITY
    let bestColumns: number | undefined
    for (const [breakpoint, columns] of Object.entries(responsive)) {
      const breakpointPx = Number.parseFloat(breakpoint)
      if (!Number.isFinite(breakpointPx) || breakpointPx > width) continue
      if (breakpointPx > bestBreakpoint) {
        bestBreakpoint = breakpointPx
        bestColumns = columns
      }
    }
    if (bestColumns !== undefined) return normalizeColumns(bestColumns)
  }

  return normalizeColumns(props.columns)
})

const rootStyle = computed<CSSProperties>(() => {
  const style: Record<string, string> = { '--lyt-waterfall-gap': gapCss.value }
  if (hasItemWidth.value) style['--lyt-waterfall-item-width'] = itemWidthCss.value
  return style as CSSProperties
})

const columnStyle = computed<CSSProperties>(() =>
  hasItemWidth.value
    ? {
        flex: '0 0 var(--lyt-waterfall-item-width)',
        width: 'var(--lyt-waterfall-item-width)',
      }
    : { flex: '1 1 0' },
)

const averageMeasuredHeight = computed<number | null>(() => {
  const values = Object.values(measuredHeights.value)
  if (values.length === 0) return null
  const sum = values.reduce((acc, value) => acc + value, 0)
  return sum / values.length
})

function resolveItemKey(item: T, index: number): string {
  const { itemKey } = props
  if (typeof itemKey === 'function') return String(itemKey(item, index))
  if (itemKey !== undefined) return String(item[itemKey])
  if (item.id !== undefined && item.id !== null) return String(item.id)
  return String(index)
}

function estimateHeight(item: T, key: string, average: number | null): number {
  const measured = measuredHeights.value[key]
  if (typeof measured === 'number' && measured > 0) return measured

  const hint = item.height
  if (typeof hint === 'number' && Number.isFinite(hint) && hint > 0) return hint

  if (average !== null) return average
  return DEFAULT_ITEM_HEIGHT
}

const columnBuckets = computed<WaterfallColumnItem<T>[][]>(() => {
  const count = columnCount.value
  const buckets: WaterfallColumnItem<T>[][] = Array.from({ length: count }, () => [])
  const heights = new Array<number>(count).fill(0)
  const gap = gapPx.value
  const average = averageMeasuredHeight.value

  props.items.forEach((item, index) => {
    const key = resolveItemKey(item, index)

    // 最短列优先；高度相同保留靠前列，保证布局稳定
    let target = 0
    for (let i = 1; i < count; i += 1) {
      if (heights[i] < heights[target]) target = i
    }

    buckets[target].push({ key, item, index })
    heights[target] += estimateHeight(item, key, average) + gap
  })

  return buckets
})

const itemKeys = computed(() => props.items.map((item, index) => resolveItemKey(item, index)))

function itemRefSetter(key: string): (el: unknown) => void {
  let setter = refSetters.get(key)
  if (!setter) {
    setter = (el: unknown) => setItemElement(key, el)
    refSetters.set(key, setter)
  }
  return setter
}

function setItemElement(key: string, el: unknown): void {
  if (typeof HTMLElement === 'undefined' || !(el instanceof HTMLElement)) return
  const previous = itemElements.get(key)
  if (previous === el) return
  if (previous) itemObserver?.unobserve(previous)
  itemElements.set(key, el)
  itemObserver?.observe(el)
}

/** 列数或位置变化会让节点在列之间移动，用一次 DOM 对账兜住 ref 回调的时序问题。 */
function reconcileItemElements(): void {
  const root = rootEl.value
  if (!root) return

  const next = new Map<string, HTMLElement>()
  root.querySelectorAll<HTMLElement>('[data-lyt-waterfall-key]').forEach((node) => {
    const key = node.getAttribute('data-lyt-waterfall-key')
    if (key) next.set(key, node)
  })

  for (const [key, el] of itemElements) {
    if (next.get(key) !== el) {
      itemObserver?.unobserve(el)
      itemElements.delete(key)
    }
  }
  for (const [key, el] of next) {
    if (itemElements.get(key) !== el) {
      itemElements.set(key, el)
      itemObserver?.observe(el)
    }
  }
}

function applyMeasuredHeights(elements: Iterable<HTMLElement>): void {
  const next = { ...measuredHeights.value }
  let changed = false
  for (const el of elements) {
    const key = el.getAttribute('data-lyt-waterfall-key')
    if (!key) continue
    const height = Math.ceil(el.getBoundingClientRect().height)
    if (height <= 0) continue
    if (next[key] !== height) {
      next[key] = height
      changed = true
    }
  }
  if (changed) measuredHeights.value = next
}

function measureAllItems(): void {
  applyMeasuredHeights(itemElements.values())
}

function syncContainerWidth(): void {
  const el = rootEl.value
  containerWidth.value = el ? el.getBoundingClientRect().width : fallbackViewportWidth()
}

function handleWindowResize(): void {
  syncContainerWidth()
}

function handleContainerResize(entries: ResizeObserverEntry[]): void {
  const width = entries[0]?.contentRect.width
  if (typeof width === 'number') containerWidth.value = width
}

function handleItemResize(entries: ResizeObserverEntry[]): void {
  const elements: HTMLElement[] = []
  for (const entry of entries) {
    if (entry.target instanceof HTMLElement) elements.push(entry.target)
  }
  applyMeasuredHeights(elements)
}

watch(
  itemKeys,
  (keys) => {
    const alive = new Set(keys)

    for (const [key, el] of itemElements) {
      if (!alive.has(key)) {
        itemObserver?.unobserve(el)
        itemElements.delete(key)
      }
    }
    for (const key of refSetters.keys()) {
      if (!alive.has(key)) refSetters.delete(key)
    }

    const cached = measuredHeights.value
    const next: Record<string, number> = {}
    let dirty = false
    for (const key of Object.keys(cached)) {
      if (alive.has(key)) next[key] = cached[key]
      else dirty = true
    }
    if (dirty) measuredHeights.value = next
  },
  { flush: 'post' },
)

onMounted(() => {
  syncContainerWidth()

  if (typeof ResizeObserver !== 'undefined') {
    containerObserver = new ResizeObserver(handleContainerResize)
    if (rootEl.value) containerObserver.observe(rootEl.value)

    itemObserver = new ResizeObserver(handleItemResize)
    itemElements.forEach((el) => itemObserver?.observe(el))
  } else if (typeof window !== 'undefined') {
    window.addEventListener('resize', handleWindowResize)
    resizeFallbackAttached = true
  }

  reconcileItemElements()
  measureAllItems()
})

onUpdated(() => {
  reconcileItemElements()
})

onBeforeUnmount(() => {
  containerObserver?.disconnect()
  containerObserver = null
  itemObserver?.disconnect()
  itemObserver = null

  if (resizeFallbackAttached && typeof window !== 'undefined') {
    window.removeEventListener('resize', handleWindowResize)
  }
  resizeFallbackAttached = false

  itemElements.clear()
  refSetters.clear()
  measuredHeights.value = {}
})
</script>

<style scoped lang="scss">
.lyt-waterfall {
  display: flex;
  width: 100%;
  box-sizing: border-box;
  align-items: flex-start;
  gap: var(--lyt-waterfall-gap, 16px);
}

.lyt-waterfall__column {
  display: flex;
  flex-direction: column;
  min-width: 0;
  gap: var(--lyt-waterfall-gap, 16px);
}

.lyt-waterfall__item {
  min-width: 0;
}
</style>
