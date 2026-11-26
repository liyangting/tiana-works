<template>
  <ul ref="listRef" class="knowledge-graph" :class="maskClass" :style="rootStyle" @scroll="handleListScroll">
    <li
      v-for="(item, index) in items"
      :key="item.id"
      :ref="(element) => setItemRef(element, index)"
      class="knowledge-graph__item"
      :class="getItemClass(item)"
      :style="itemStyles[index]"
    >
      <div class="knowledge-graph__sequence"></div>

      <div class="knowledge-graph__card">
        <div class="knowledge-graph__content">
          <div class="knowledge-graph__title">
            <h3>{{ item.title }}</h3>
          </div>
          <p v-if="item.subtitle">{{ item.subtitle }}</p>
        </div>
        <button
          v-if="showAction"
          class="knowledge-graph__action"
          type="button"
          :disabled="item.disabled"
          @click="handleItemAction(item)"
        >
          {{ getActionText(item) }}
        </button>
      </div>
    </li>

    <li v-if="!items.length" class="knowledge-graph__empty">
      {{ emptyText }}
    </li>
  </ul>
</template>
<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import cardActiveAmber from './assets/task-card-active-amber.png'
import cardActiveGraphite from './assets/task-card-active-graphite.png'
import cardDefaultAmber from './assets/task-card-default-amber.png'
import cardDefaultGraphite from './assets/task-card-default-graphite.png'
import nodeActiveAmber from './assets/task-node-active-amber.png'
import nodeActiveGraphite from './assets/task-node-active-graphite.png'
import nodeDefaultAmber from './assets/task-node-default-amber.png'
import nodeDefaultGraphite from './assets/task-node-default-graphite.png'
import {
  KNOWLEDGE_GRAPH_ACTIVE_ANCHOR_VISIBLE_INDEX,
  KNOWLEDGE_GRAPH_DEFAULT_ACTION_TEXT,
  KNOWLEDGE_GRAPH_DEFAULT_LAYOUT,
  KNOWLEDGE_GRAPH_ITEM_GAP,
  KNOWLEDGE_GRAPH_ITEM_HEIGHT,
  KNOWLEDGE_GRAPH_MIN_SCALE,
  KNOWLEDGE_GRAPH_NODE_CARD_GAP,
} from './const'
import type {
  KnowledgeGraphAnchor,
  KnowledgeGraphItem,
  KnowledgeGraphLayout,
  KnowledgeGraphTheme,
} from './types'

const props = withDefaults(
  defineProps<{
    /** 知识点条目数据。 */
    items: Array<KnowledgeGraphItem>
    /** 当前高亮的知识点 ID，支持 v-model:active-id。 */
    activeId?: string
    /** 进入时希望聚焦的知识点 ID，只影响初始滚动位置。 */
    focusId?: string
    /** 弧形轨道布局配置，不传时使用默认布局。 */
    layout?: KnowledgeGraphLayout
    /** 是否展示右侧操作按钮。 */
    showAction?: boolean
    /** 数据为空时的提示文案。 */
    emptyText?: string
    /** 内置主题：石墨灰或琥珀暖沙。 */
    theme?: KnowledgeGraphTheme
  }>(),
  {
    activeId: '',
    focusId: '',
    showAction: true,
    emptyText: '暂无知识点',
    theme: 'graphite',
  },
)

const emit = defineEmits<{
  /** 点击操作按钮时抛出当前知识点，交互由使用方决定。 */
  select: [item: KnowledgeGraphItem]
  /** 高亮知识点变化时同步给使用方，支持 v-model:active-id。 */
  'update:active-id': [id: string]
}>()

interface RouteArcMetrics {
  /** 当前条目整行应该应用的横向偏移。 */
  rowOffset: number
  /** 当前卡片基于弧线纵深得到的缩放比例。 */
  scale: number
}

interface RouteAnchorMetrics {
  /** 当前条目投影到弧线路径后的横向偏移。 */
  offset: number
  /** 当前条目投影到弧线路径后的缩放比例。 */
  scale: number
}

/** 写入到 li 上的 CSS 变量集合。 */
type RouteItemStyle = Record<string, string | number>

/** 判断是否已经滚到顶部/底部的像素容差，覆盖不同系统下的亚像素滚动偏移。 */
const ROUTE_SCROLL_EDGE_TOLERANCE = 2
/** 快速滚动结束后恢复路线过渡的缓冲时间。 */
const ROUTE_SCROLL_SETTLE_DELAY = 120
/** 允许上下边缘条目继续沿轨道移动的最大缓冲，避免高速滚动时无限外推导致横向飞出。 */
const ROUTE_VISIBLE_INDEX_BUFFER = 0.5
/** 顶部半露出的条目额外向左贴合轨道的最大偏移，单位 px。 */
const ROUTE_TOP_CLIPPED_ROW_OFFSET = -100
/** 滚轮受控滚动的缓动系数，让高速滚轮也拆到多个同步定位帧里。 */
const ROUTE_WHEEL_SCROLL_EASE = 0.32
/** 受控滚动收尾阈值，低于该距离直接贴合目标位置。 */
const ROUTE_WHEEL_SCROLL_END_DISTANCE = 0.5

const listRef = ref<HTMLElement>()
// 每个知识点 li 的 DOM 引用，用于计算可视位置和初始滚动定位。
const itemRefs = ref<Array<HTMLElement | undefined>>([])
// 每个知识点条目的 CSS 变量缓存，滚动时只替换变量，让路线位置保留滚动动画。
const itemStyles = ref<Array<RouteItemStyle>>([])
// 是否可以继续向上查看上一批知识点，用于控制顶部渐隐遮罩。
const canScrollToPrevious = ref(false)
// 是否可以继续向下查看后续知识点，用于控制底部渐隐遮罩。
const canScrollToNext = ref(false)
// 组件内部维护的高亮 ID，未受控时由点击行为更新。
const innerActiveId = ref(props.activeId)
// 当前等待执行的 rAF id，用于合并高频 scroll 更新。
let routeArcFrame = 0
// 当前等待结束滚动状态的 timer id，用于避免高速滚动时路线 transform 过渡滞后。
let routeScrollSettleTimer = 0
// 当前受控滚轮滚动的 rAF id。
let routeWheelFrame = 0
// 容器或窗口尺寸变化后的定位刷新帧，避免 resize 高频触发重复计算。
let routeResizeFrame = 0
// 监听列表及其布局容器尺寸，跨断点时重新校准路线位置。
let routeResizeObserver: ResizeObserver | undefined
// 受控滚轮滚动的目标 scrollTop。
let routeWheelTargetScrollTop = 0
// 受控滚动写入 scrollTop 时，忽略随之触发的原生 scroll 补帧。
let isApplyingRouteWheelScroll = false

watch(
  () => props.activeId,
  (activeId) => {
    innerActiveId.value = activeId
  },
)

/** 当前高亮的知识点 ID，由使用方通过 v-model:active-id 控制。 */
const highlightedId = computed(() => innerActiveId.value)

interface ThemeTokens {
  /** 默认卡片底图。 */
  cardDefault: string
  /** 高亮卡片底图。 */
  cardActive: string
  /** 默认节点底图。 */
  nodeDefault: string
  /** 高亮节点底图。 */
  nodeActive: string
  /** 卡片悬停时的叠加渐变。 */
  cardHover: string
  /** 高亮卡片悬停时的外发光。 */
  activeGlow: string
  /** 高亮卡片标题色。 */
  activeTitle: string
  /** 高亮卡片副标题色。 */
  activeSubtitle: string
  /** 操作按钮底色。 */
  actionBg: string
  /** 操作按钮文字色。 */
  actionFg: string
  /** 操作按钮内阴影。 */
  actionShadow: string
}

/** 两套内置主题的图片与派生颜色，卡片 PNG 决定质感，颜色变量负责悬停与高亮文字。 */
const THEME_TOKENS: Record<KnowledgeGraphTheme, ThemeTokens> = {
  graphite: {
    cardDefault: cardDefaultGraphite,
    cardActive: cardActiveGraphite,
    nodeDefault: nodeDefaultGraphite,
    nodeActive: nodeActiveGraphite,
    cardHover: 'linear-gradient(90deg, rgb(120 132 140 / 45%) 0%, rgb(70 78 84 / 16%) 100%)',
    activeGlow: '0 0 20px 0 rgb(220 232 230 / 45%)',
    activeTitle: '#14181c',
    activeSubtitle: 'rgb(20 24 28 / 60%)',
    actionBg: 'linear-gradient(90deg, #eef2f1 0%, #d5dedb 100%)',
    actionFg: '#14181c',
    actionShadow: 'inset 1px -8px 6px rgb(255 255 255 / 45%)',
  },
  amber: {
    cardDefault: cardDefaultAmber,
    cardActive: cardActiveAmber,
    nodeDefault: nodeDefaultAmber,
    nodeActive: nodeActiveAmber,
    cardHover: 'linear-gradient(90deg, rgb(190 130 70 / 45%) 0%, rgb(120 78 40 / 16%) 100%)',
    activeGlow: '0 0 20px 0 rgb(255 200 140 / 42%)',
    activeTitle: '#241a10',
    activeSubtitle: 'rgb(36 26 16 / 60%)',
    actionBg: 'linear-gradient(90deg, #c98a4a 0%, #a8712f 100%)',
    actionFg: '#1a1208',
    actionShadow: 'inset 1px -8px 6px rgb(255 220 170 / 28%)',
  },
}

/** 当前主题的图片与派生颜色，随 theme 属性切换。 */
const themeTokens = computed(() => THEME_TOKENS[props.theme])

const rootStyle = computed(() => ({
  '--kg-card-default': `url(${themeTokens.value.cardDefault})`,
  '--kg-card-active': `url(${themeTokens.value.cardActive})`,
  '--kg-node-pending': `url(${themeTokens.value.nodeDefault})`,
  '--kg-node-pending-active': `url(${themeTokens.value.nodeActive})`,
  '--kg-card-hover': themeTokens.value.cardHover,
  '--kg-active-glow': themeTokens.value.activeGlow,
  '--kg-active-title': themeTokens.value.activeTitle,
  '--kg-active-subtitle': themeTokens.value.activeSubtitle,
  '--kg-action-bg': themeTokens.value.actionBg,
  '--kg-action-fg': themeTokens.value.actionFg,
  '--kg-action-shadow': themeTokens.value.actionShadow,
}))

/** 读取当前锚点配置，未传入时使用默认弧线。 */
const getRouteAnchors = () => props.layout?.anchors ?? KNOWLEDGE_GRAPH_DEFAULT_LAYOUT.anchors

/** 当前应聚焦的知识点下标：focusId 优先，无匹配时定位第一条。 */
const activeIndex = computed(() => {
  const focusIndex = props.items.findIndex((item) => item.id === props.focusId)

  return focusIndex >= 0 ? focusIndex : 0
})

const setItemRef = (element: unknown, index: number) => {
  if (element instanceof HTMLElement) {
    itemRefs.value[index] = element
  }
}

/** 是否为当前唯一高亮的知识点。 */
const isActiveItem = (item: KnowledgeGraphItem) => item.id === highlightedId.value

/** 集中维护条目的高亮与禁用样式。 */
const getItemClass = (item: KnowledgeGraphItem) => ({
  'knowledge-graph__item--active': isActiveItem(item),
  'knowledge-graph__item--disabled': item.disabled,
})

/** 计算相邻两条知识点中心之间的距离，优先使用 DOM 实测值适配容器样式。 */
const getRouteItemPitch = () => {
  const [firstItem, secondItem] = itemRefs.value

  if (firstItem && secondItem) {
    return secondItem.offsetTop - firstItem.offsetTop
  }

  return KNOWLEDGE_GRAPH_ITEM_HEIGHT + KNOWLEDGE_GRAPH_ITEM_GAP
}

/** 根据条目当前在列表可视区域里的位置，换算成第几条的连续下标。 */
const getVisibleIndex = (item: HTMLElement, list: HTMLElement, itemPitch: number) => {
  const itemCenterY = item.offsetTop - list.scrollTop + item.offsetHeight / 2

  return (itemCenterY - item.offsetHeight / 2) / itemPitch
}

/** 按两个锚点计算当前位置，visibleIndex 超出锚点范围时也沿同一方向继续外推。 */
const getRouteAnchorMetrics = (
  previousAnchor: KnowledgeGraphAnchor,
  nextAnchor: KnowledgeGraphAnchor,
  visibleIndex: number,
): RouteAnchorMetrics => {
  const progress =
    (visibleIndex - previousAnchor.visibleIndex) / (nextAnchor.visibleIndex - previousAnchor.visibleIndex)
  const previousScale = previousAnchor.scale ?? 1
  const nextScale = nextAnchor.scale ?? 1

  return {
    offset: previousAnchor.offset + (nextAnchor.offset - previousAnchor.offset) * progress,
    scale: previousScale + (nextScale - previousScale) * progress,
  }
}

const clampRouteVisibleIndex = (visibleIndex: number, firstVisibleIndex: number, lastVisibleIndex: number) =>
  Math.min(
    Math.max(visibleIndex, firstVisibleIndex - ROUTE_VISIBLE_INDEX_BUFFER),
    lastVisibleIndex + ROUTE_VISIBLE_INDEX_BUFFER,
  )

const isRouteItemClippedAtTop = (item: HTMLElement, list: HTMLElement) =>
  item.offsetTop < list.scrollTop && item.offsetTop + item.offsetHeight > list.scrollTop

const getRouteTopClippedOffset = (item: HTMLElement, list: HTMLElement) => {
  if (!isRouteItemClippedAtTop(item, list)) {
    return 0
  }

  const clippedProgress = Math.min(Math.max((list.scrollTop - item.offsetTop) / item.offsetHeight, 0), 1)

  return ROUTE_TOP_CLIPPED_ROW_OFFSET * clippedProgress
}

/** 在相邻锚点之间做线性插值，两端只保留少量缓冲，避免高速滚动时边缘条目横向飞出。 */
const getInterpolatedRouteAnchor = (visibleIndex: number): RouteAnchorMetrics => {
  const anchors = [...getRouteAnchors()].sort((current, next) => current.visibleIndex - next.visibleIndex)
  const firstAnchor = anchors[0]
  const lastAnchor = anchors[anchors.length - 1]

  if (!firstAnchor || !lastAnchor) {
    return { offset: 0, scale: 1 }
  }

  if (anchors.length === 1) {
    return {
      offset: firstAnchor.offset,
      scale: firstAnchor.scale ?? KNOWLEDGE_GRAPH_MIN_SCALE,
    }
  }

  const boundedVisibleIndex = clampRouteVisibleIndex(
    visibleIndex,
    firstAnchor.visibleIndex,
    lastAnchor.visibleIndex,
  )

  if (boundedVisibleIndex <= firstAnchor.visibleIndex) {
    return getRouteAnchorMetrics(firstAnchor, anchors[1], boundedVisibleIndex)
  }

  if (boundedVisibleIndex >= lastAnchor.visibleIndex) {
    return getRouteAnchorMetrics(anchors[anchors.length - 2], lastAnchor, boundedVisibleIndex)
  }

  const nextAnchorIndex = anchors.findIndex((anchor) => anchor.visibleIndex >= boundedVisibleIndex)
  const previousAnchor = anchors[nextAnchorIndex - 1]
  const nextAnchor = anchors[nextAnchorIndex]

  return getRouteAnchorMetrics(previousAnchor, nextAnchor, boundedVisibleIndex)
}

const getRouteArcMetrics = (item: HTMLElement, list: HTMLElement): RouteArcMetrics => {
  const routeAnchor = getInterpolatedRouteAnchor(getVisibleIndex(item, list, getRouteItemPitch()))

  return {
    // 负偏移统一保留，让顶部条目继续沿弧线向左移动，而不是被钳制后直着向上。
    rowOffset: routeAnchor.offset + getRouteTopClippedOffset(item, list),
    scale: routeAnchor.scale,
  }
}

const getFallbackRouteArcMetrics = (index: number): RouteArcMetrics => {
  const visibleIndex = index - activeIndex.value + KNOWLEDGE_GRAPH_ACTIVE_ANCHOR_VISIBLE_INDEX
  const routeAnchor = getInterpolatedRouteAnchor(visibleIndex)

  return {
    rowOffset: routeAnchor.offset,
    scale: routeAnchor.scale,
  }
}

const createItemStyle = (metrics: RouteArcMetrics, index = 0): RouteItemStyle => ({
  '--kg-row-offset': `${metrics.rowOffset}px`,
  '--kg-node-card-gap': `${KNOWLEDGE_GRAPH_NODE_CARD_GAP}px`,
  '--kg-card-scale': metrics.scale,
  '--kg-card-enter-delay': `${0.14 + Math.min(index, 6) * 0.052}s`,
  '--kg-node-enter-delay': `${0.1 + Math.min(index, 6) * 0.052}s`,
})

const applyItemStyle = (item: HTMLElement | undefined, style: RouteItemStyle) => {
  if (!item) {
    return
  }

  Object.entries(style).forEach(([property, value]) => {
    item.style.setProperty(property, String(value))
  })
}

const updateRouteArcStyles = (syncState = true) => {
  const list = listRef.value

  if (!list) {
    if (syncState) {
      itemStyles.value = []
    }
    return
  }

  const nextStyles = props.items.map((_, index) => {
    const item = itemRefs.value[index]
    const metrics = item ? getRouteArcMetrics(item, list) : getFallbackRouteArcMetrics(index)

    return createItemStyle(metrics, index)
  })

  nextStyles.forEach((style, index) => {
    applyItemStyle(itemRefs.value[index], style)
  })

  if (syncState) {
    itemStyles.value = nextStyles
  }
}

const scheduleRouteArcUpdate = (syncState = true) => {
  if (routeArcFrame) {
    return
  }

  routeArcFrame = window.requestAnimationFrame(() => {
    routeArcFrame = 0
    updateRouteArcStyles(syncState)
  })
}

const updateRouteMaskState = () => {
  const list = listRef.value

  if (!list) {
    canScrollToPrevious.value = false
    canScrollToNext.value = false
    return
  }

  canScrollToPrevious.value = list.scrollTop > ROUTE_SCROLL_EDGE_TOLERANCE
  canScrollToNext.value = list.scrollTop + list.clientHeight < list.scrollHeight - ROUTE_SCROLL_EDGE_TOLERANCE
}

const getRouteMaxScrollTop = (list: HTMLElement) => Math.max(list.scrollHeight - list.clientHeight, 0)

const clampRouteScrollTop = (list: HTMLElement, scrollTop: number) =>
  Math.min(Math.max(scrollTop, 0), getRouteMaxScrollTop(list))

const markRouteListScrolling = () => {
  const list = listRef.value

  if (!list) {
    return
  }

  list.classList.add('knowledge-graph--scrolling')

  if (routeScrollSettleTimer) {
    window.clearTimeout(routeScrollSettleTimer)
  }

  routeScrollSettleTimer = window.setTimeout(() => {
    routeScrollSettleTimer = 0
    list.classList.remove('knowledge-graph--scrolling')
    updateRouteArcStyles()
  }, ROUTE_SCROLL_SETTLE_DELAY)
}

const handleListScroll = () => {
  if (isApplyingRouteWheelScroll) {
    return
  }

  markRouteListScrolling()
  updateRouteMaskState()
  scheduleRouteArcUpdate(false)
}

const updateRouteScrollPosition = (list: HTMLElement, scrollTop: number) => {
  isApplyingRouteWheelScroll = true
  list.scrollTop = scrollTop
  isApplyingRouteWheelScroll = false
  updateRouteMaskState()
  updateRouteArcStyles(false)
}

const cancelRouteWheelScroll = () => {
  if (!routeWheelFrame) {
    return
  }

  window.cancelAnimationFrame(routeWheelFrame)
  routeWheelFrame = 0
}

const runRouteWheelScroll = () => {
  const list = listRef.value

  if (!list) {
    routeWheelFrame = 0
    return
  }

  routeWheelTargetScrollTop = clampRouteScrollTop(list, routeWheelTargetScrollTop)
  const distance = routeWheelTargetScrollTop - list.scrollTop

  if (Math.abs(distance) <= ROUTE_WHEEL_SCROLL_END_DISTANCE) {
    routeWheelFrame = 0
    updateRouteScrollPosition(list, routeWheelTargetScrollTop)
    updateRouteArcStyles()
    return
  }

  updateRouteScrollPosition(list, list.scrollTop + distance * ROUTE_WHEEL_SCROLL_EASE)
  routeWheelFrame = window.requestAnimationFrame(runRouteWheelScroll)
}

const getRouteWheelDeltaY = (event: WheelEvent, list: HTMLElement) => {
  if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) {
    return event.deltaY * 16
  }

  if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) {
    return event.deltaY * list.clientHeight
  }

  return event.deltaY
}

const handleRouteWheel = (event: WheelEvent) => {
  const list = listRef.value

  if (!list) {
    return
  }

  const deltaY = getRouteWheelDeltaY(event, list)

  if (!deltaY) {
    return
  }

  const currentScrollTop = routeWheelFrame ? routeWheelTargetScrollTop : list.scrollTop
  const nextScrollTop = clampRouteScrollTop(list, currentScrollTop + deltaY)

  if (nextScrollTop === list.scrollTop && !routeWheelFrame) {
    return
  }

  event.preventDefault()
  markRouteListScrolling()
  routeWheelTargetScrollTop = nextScrollTop

  if (!routeWheelFrame) {
    routeWheelFrame = window.requestAnimationFrame(runRouteWheelScroll)
  }
}

/** 将滚动边界状态转换成样式类，顶部在初始位置不加遮罩，避免盖住第一条。 */
const maskClass = computed(() => ({
  'knowledge-graph--mask-top': canScrollToPrevious.value,
  'knowledge-graph--mask-bottom': canScrollToNext.value,
}))

const getActionText = (item: KnowledgeGraphItem) => item.actionText ?? KNOWLEDGE_GRAPH_DEFAULT_ACTION_TEXT

const handleItemAction = (item: KnowledgeGraphItem) => {
  if (item.disabled) {
    return
  }

  innerActiveId.value = item.id
  emit('update:active-id', item.id)
  emit('select', item)
}

/** 初次进入或数据切换时，把当前学习节点滚到靠近视觉锚点的位置。 */
const scrollActiveIntoAnchor = async () => {
  await nextTick()
  cancelRouteWheelScroll()

  const list = listRef.value
  const activeItem = itemRefs.value[activeIndex.value]

  if (!list) {
    return
  }

  if (!activeItem) {
    updateRouteMaskState()
    updateRouteArcStyles()
    return
  }

  const targetScrollTop =
    activeItem.offsetTop +
    activeItem.offsetHeight / 2 -
    (KNOWLEDGE_GRAPH_ACTIVE_ANCHOR_VISIBLE_INDEX * getRouteItemPitch() + activeItem.offsetHeight / 2)

  list.scrollTo({
    top: targetScrollTop,
    behavior: 'auto',
  })
  updateRouteMaskState()
  updateRouteArcStyles()
}

const handleRouteResize = () => {
  if (routeResizeFrame) {
    window.cancelAnimationFrame(routeResizeFrame)
  }

  routeResizeFrame = window.requestAnimationFrame(() => {
    routeResizeFrame = 0
    void scrollActiveIntoAnchor()
  })
}

onMounted(() => {
  scrollActiveIntoAnchor()
  scheduleRouteArcUpdate()
  listRef.value?.addEventListener('wheel', handleRouteWheel, { passive: false })
  window.addEventListener('resize', handleRouteResize)

  if (listRef.value && typeof ResizeObserver !== 'undefined') {
    routeResizeObserver = new ResizeObserver(handleRouteResize)
    routeResizeObserver.observe(listRef.value)

    if (listRef.value.parentElement) {
      routeResizeObserver.observe(listRef.value.parentElement)
    }
  }
})

onBeforeUnmount(() => {
  if (routeArcFrame) {
    window.cancelAnimationFrame(routeArcFrame)
    routeArcFrame = 0
  }

  if (routeScrollSettleTimer) {
    window.clearTimeout(routeScrollSettleTimer)
    routeScrollSettleTimer = 0
  }

  if (routeWheelFrame) {
    window.cancelAnimationFrame(routeWheelFrame)
    routeWheelFrame = 0
  }

  if (routeResizeFrame) {
    window.cancelAnimationFrame(routeResizeFrame)
    routeResizeFrame = 0
  }

  listRef.value?.removeEventListener('wheel', handleRouteWheel)
  window.removeEventListener('resize', handleRouteResize)
  routeResizeObserver?.disconnect()
  routeResizeObserver = undefined
})

watch(
  () => [props.items, props.focusId, props.layout, activeIndex.value],
  () => {
    itemRefs.value = []
    void scrollActiveIntoAnchor()
    scheduleRouteArcUpdate()
  },
  { deep: true },
)

defineExpose({
  /** 把当前聚焦节点滚动到视觉锚点。 */
  scrollToActive: scrollActiveIntoAnchor,
})
</script>
<style scoped lang="scss">
// 本组件内复用的背景定位写法，避免每个图片背景重复写 no-repeat/center。
$route-bg-position: no-repeat center center;
// 知识点卡片的统一圆角。
$route-card-radius: 16px;

.knowledge-graph {
  --kg-item-height: 108px;
  --kg-item-gap: 40px;
  /* 顶部/底部滚动渐隐高度，可按容器高度覆盖。 */
  --kg-edge-fade: 72px;

  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--kg-item-gap);
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  min-height: 0;
  margin: 0;
  padding: 0;
  overflow: hidden auto;
  list-style: none;
  overscroll-behavior: contain;
  scrollbar-width: none;
  animation: kg-list-enter 0.34s ease-out 0.08s both;

  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
}

.knowledge-graph--mask-top {
  -webkit-mask-image: linear-gradient(to bottom, transparent 0, #000 var(--kg-edge-fade));
  mask-image: linear-gradient(to bottom, transparent 0, #000 var(--kg-edge-fade));
}

.knowledge-graph--mask-bottom {
  -webkit-mask-image: linear-gradient(to top, transparent 0, #000 var(--kg-edge-fade));
  mask-image: linear-gradient(to top, transparent 0, #000 var(--kg-edge-fade));
}

.knowledge-graph--mask-top.knowledge-graph--mask-bottom {
  -webkit-mask-image: linear-gradient(
    to bottom,
    transparent 0,
    #000 var(--kg-edge-fade),
    #000 calc(100% - var(--kg-edge-fade)),
    transparent 100%
  );
  mask-image: linear-gradient(
    to bottom,
    transparent 0,
    #000 var(--kg-edge-fade),
    #000 calc(100% - var(--kg-edge-fade)),
    transparent 100%
  );
}

.knowledge-graph__item {
  position: relative;
  display: grid;
  flex: 0 0 var(--kg-item-height);
  grid-template-columns: 68px minmax(0, 1fr);
  gap: 0 var(--kg-node-card-gap, 24px);
  height: var(--kg-item-height);
  align-items: center;
  padding: 0;
  color: #fff;
  text-align: left;
  transform: translate3d(var(--kg-row-offset, 0), 0, 0);
  transform-origin: left center;
  transition:
    opacity 0.12s ease-out,
    transform 0.18s cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform;

  .knowledge-graph__card {
    display: flex;
    box-sizing: border-box;
    width: 100%;
    max-width: 680px;
    align-items: center;
    justify-content: space-between;
    padding: 24px;
    overflow: hidden;
    border-radius: $route-card-radius;
    background: var(--kg-card-default) $route-bg-position;
    background-size: 100% 100%;
    transform: translate3d(0, 0, 0) scale(var(--kg-card-scale, 1));
    transform-origin: left center;
    animation: kg-card-enter 0.56s cubic-bezier(0.2, 0, 0.2, 1) both;
    animation-delay: var(--kg-card-enter-delay, 0.14s);
    transition:
      border-color 0.24s ease,
      background 0.24s ease,
      box-shadow 0.24s ease;

    &:hover {
      background: var(--kg-card-hover);
      backdrop-filter: blur(50px);
    }
  }

  .knowledge-graph__content {
    min-width: 0;
  }

  .knowledge-graph__content p {
    margin: 16px 0 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: rgb(255 255 255 / 60%);
    font-size: 18px;
    font-style: normal;
    font-weight: 400;
  }

  .knowledge-graph__title {
    display: flex;
    align-items: center;
    gap: 8px;

    h3 {
      margin: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #fff;
      font-size: 24px;
      font-style: normal;
      font-weight: 500;
      line-height: 100%;
    }
  }

  &--active {
    .knowledge-graph__sequence {
      background-image: var(--kg-node-pending-active);
    }

    .knowledge-graph__card {
      background: var(--kg-card-active) $route-bg-position !important;
      background-size: 100% 100%;

      .knowledge-graph__title h3 {
        color: var(--kg-active-title, #1d2129);
      }

      p {
        color: var(--kg-active-subtitle, rgb(29 33 41 / 60%)) !important;
      }

      &:hover {
        box-shadow: var(--kg-active-glow);
      }
    }
  }

  &--disabled {
    .knowledge-graph__card:hover {
      background: var(--kg-card-default) $route-bg-position;
      background-size: 100% 100%;
      backdrop-filter: none;
    }

    .knowledge-graph__action:disabled {
      opacity: 0.42 !important;
      cursor: not-allowed;
    }
  }
}

.knowledge-graph--scrolling .knowledge-graph__item {
  transition: opacity 0.12s ease-out;
}

.knowledge-graph__sequence {
  width: 68px;
  height: 68px;
  background: var(--kg-node-pending) $route-bg-position;
  background-size: 100% 100%;
  animation: kg-node-enter 0.5s cubic-bezier(0.2, 0, 0.2, 1) both;
  animation-delay: var(--kg-node-enter-delay, 0.1s);
}

.knowledge-graph__action {
  width: 120px;
  height: 50px;
  flex: 0 0 auto;
  border: 0;
  border-radius: 100px;
  background: var(--kg-action-bg);
  box-shadow: var(--kg-action-shadow);
  cursor: pointer;
  color: var(--kg-action-fg);
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}

.knowledge-graph__empty {
  display: flex;
  flex: 0 0 auto;
  width: min(100%, 470px);
  padding: 24px;
  align-items: center;
  justify-content: center;
  border: 1px solid rgb(255 255 255 / 30%);
  border-radius: 14px;
  background: rgb(255 255 255 / 16%);
  color: rgb(255 255 255 / 76%);
  text-align: center;
}

@keyframes kg-list-enter {
  from {
    opacity: 0.78;
  }

  to {
    opacity: 1;
  }
}

@keyframes kg-card-enter {
  from {
    opacity: 0;
    transform: translate3d(22px, 8px, 0) scale(var(--kg-card-scale, 1));
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0) scale(var(--kg-card-scale, 1));
  }
}

@keyframes kg-node-enter {
  from {
    opacity: 0;
    transform: translate3d(-10px, 6px, 0) scale(0.96);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0) scale(1);
  }
}
</style>
