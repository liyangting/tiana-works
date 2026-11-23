/**
 * 瀑布流组件的公共类型。
 * 组件只约定“每一项是一个对象”以及可选的 height 高度提示，不关心业务字段含义。
 */
export type WaterfallRecord = Record<string, any>

/** 用于 v-for key、高度缓存 key 与 DOM 标识。 */
export type WaterfallItemKey<T> = keyof T | ((item: T, index: number) => string | number)

export interface WaterfallProps<T extends WaterfallRecord> {
  items?: T[]
  columns?: number
  /** key 为容器宽度断点（px 字符串），value 为列数。 */
  responsiveColumns?: Record<string, number>
  /** number 自动补 px，同时用于列间距与卡片纵向间距。 */
  gap?: number | string
  /** 设置后按容器宽度推导列数，并固定每列宽度。 */
  itemWidth?: number | string
  itemKey?: WaterfallItemKey<T>
}

export interface WaterfallSlotProps<T> {
  item: T
  index: number
}

export interface WaterfallColumnItem<T> {
  /** 已解析的稳定 key。 */
  key: string
  item: T
  index: number
}

/** 数据项上允许出现的高度提示，仅用于首屏估算。 */
export interface WaterfallHeightHint {
  height?: number
}
