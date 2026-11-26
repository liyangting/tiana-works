import type { KnowledgeGraphLayout } from './types'

/** 知识点条目高度，对应样式里的 --kg-item-height。 */
export const KNOWLEDGE_GRAPH_ITEM_HEIGHT = 108
/** 知识点条目间距，对应样式里的 --kg-item-gap。 */
export const KNOWLEDGE_GRAPH_ITEM_GAP = 40
/** 左侧序号节点和右侧卡片之间的固定间距。 */
export const KNOWLEDGE_GRAPH_NODE_CARD_GAP = 24
/** 卡片随纵深产生的最小缩放比例，只做轻微空间感。 */
export const KNOWLEDGE_GRAPH_MIN_SCALE = 0.96
/** 当前学习节点默认对齐到可视区域里的第 4 行。 */
export const KNOWLEDGE_GRAPH_ACTIVE_ANCHOR_VISIBLE_INDEX = 3

/** 默认弧形轨道配置，可直接作为纯展示布局使用。 */
export const KNOWLEDGE_GRAPH_DEFAULT_LAYOUT: KnowledgeGraphLayout = {
  anchors: [
    { visibleIndex: 0, offset: -0, scale: KNOWLEDGE_GRAPH_MIN_SCALE },
    { visibleIndex: 1, offset: 150, scale: 0.972 },
    { visibleIndex: 2, offset: 215, scale: 0.986 },
    { visibleIndex: 3, offset: 230, scale: 1 },
    { visibleIndex: 4, offset: 200, scale: 0.986 },
    { visibleIndex: 5, offset: 100, scale: 0.972 },
    { visibleIndex: 6, offset: -50, scale: KNOWLEDGE_GRAPH_MIN_SCALE },
  ],
}

/** 未传 actionText 时操作按钮的统一默认文案。 */
export const KNOWLEDGE_GRAPH_DEFAULT_ACTION_TEXT = '查看详情'
