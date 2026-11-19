/** 扭蛋机的运行阶段。 */
export type MachineStatus = 'idle' | 'shaking' | 'dropping' | 'revealing' | 'open'
export type GachaStatus = MachineStatus
export type GachaMachineTop = 'default' | 'alternate'

export interface Prize {
  id: string
  name: string
  description?: string
  imageUrl?: string
  /** `0` 代表不可抽中；省略或小于 0 代表无限库存。 */
  stock?: number
  /** 未使用 `draw` 时的本地抽取权重，默认 `1`。 */
  weight?: number
  /** 兼容展示层：是否显示在幸运中奖名单中。 */
  showInLuckyWinners?: boolean
}
export type GachaPrize = Prize

/** 将抽取交给接口或父组件处理。返回 `null` 表示本次没有结果。 */
export type DrawHandler = () => Prize | null | Promise<Prize | null>
export type GachaDrawHandler = DrawHandler
