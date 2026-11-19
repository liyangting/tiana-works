export interface ComponentEntry {
  name: string
  label: string
  description: string
  route: string
  packageName: string
  sourceUrl: string
  category: string
  complexity: '进阶' | '高阶'
  tags: string[]
  status: '已发布' | '规划中'
}

/**
 * 组件作品集的唯一注册入口。
 * 新增组件时在此登记，首页卡片和侧边栏会自动同步。
 */
export const componentRegistry: ComponentEntry[] = [
  {
    name: 'GachaLottery',
    label: '扭蛋机',
    description: '集成物理扭蛋堆叠、摇晃、掉落、开球与结果回收动画的可配置抽奖组件。',
    route: '/components/gacha-lottery',
    packageName: '@lyt/gacha-lottery',
    sourceUrl: 'https://github.com/liyangting/vue3-pure-components/tree/main/packages/gacha-lottery',
    category: '动画与交互',
    complexity: '高阶',
    tags: ['Vue 3', 'Matter.js', 'GSAP', '状态机'],
    status: '已发布',
  },
]

export const sidebarItems = componentRegistry.map(component => ({
  text: `${component.name} ${component.label}`,
  link: component.route,
}))
