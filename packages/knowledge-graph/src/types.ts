/** 内置主题：graphite 石墨灰、amber 琥珀暖沙。 */
export type KnowledgeGraphTheme = 'graphite' | 'amber'

/** 知识点条目数据，组件只消费展示字段，不关心业务来源。 */
export interface KnowledgeGraphItem {
  /** 条目唯一标识，也用于高亮与定位。 */
  id: string
  /** 知识点标题。 */
  title: string
  /** 知识点说明文案。 */
  subtitle?: string
  /** 是否禁用当前条目的操作按钮。 */
  disabled?: boolean
  /** 自定义操作按钮文案，未传时使用统一默认文案。 */
  actionText?: string
}

/** 单个弧形锚点：可视区域第几条、横向偏移、缩放比例。 */
export interface KnowledgeGraphAnchor {
  /** 可视区域里的第几条，0 表示第一条。 */
  visibleIndex: number
  /** 当前条目整行应该应用的横向偏移，单位 px。 */
  offset: number
  /** 当前卡片缩放比例。 */
  scale?: number
}

/** 弧形轨道布局配置。 */
export interface KnowledgeGraphLayout {
  /** 可视区域内每一条的横向锚点，按锚点插值后贴合设计稿弧线。 */
  anchors: Array<KnowledgeGraphAnchor>
}
