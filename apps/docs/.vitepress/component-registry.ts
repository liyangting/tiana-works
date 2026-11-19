export interface ComponentPreview {
  /** 相对 public 的路径，例如 /previews/gacha-lottery/01-idle.webp */
  src: string
  alt: string
  caption?: string
}

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
  /** 标记为首页 Hero 轮播的组件；全部 featured 组件参与环绕切换。 */
  featured?: boolean
  /** 首页卡片封面图，相对 public 的路径。留空时 fallback 到 previews[0]，再兜底为 CSS 占位。 */
  cover?: string
  /** 额外的静态截图（预留字段，暂不在首页使用）。 */
  previews?: ComponentPreview[]
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
    featured: true,
    // 截图放在 apps/docs/public/previews/gacha-lottery/，接入后填 cover 即可：
    // cover: '/previews/gacha-lottery/cover.webp',
    cover: '',
    previews: [],
  },
  {
    name: 'VirtualList',
    label: '虚拟滚动',
    description: '支持百万级数据的窗口化列表，含动态高度测量、滚动回弹与首屏骨架。',
    route: '/components/virtual-list',
    packageName: '@lyt/virtual-list',
    sourceUrl: 'https://github.com/liyangting/vue3-pure-components/tree/main/packages/virtual-list',
    category: '性能与渲染',
    complexity: '高阶',
    tags: ['Vue 3', '窗口化', 'Recycler', '动态高度'],
    status: '规划中',
    featured: true,
    cover: '',
    previews: [],
  },
  {
    name: 'ParticleCanvas',
    label: '粒子画布',
    description: '基于 Canvas 2D 的粒子系统，支持力场、碰撞、图片置换与 GPU 降级策略。',
    route: '/components/particle-canvas',
    packageName: '@lyt/particle-canvas',
    sourceUrl: 'https://github.com/liyangting/vue3-pure-components/tree/main/packages/particle-canvas',
    category: '视觉与渲染',
    complexity: '高阶',
    tags: ['Vue 3', 'Canvas 2D', '粒子系统', '力场模拟'],
    status: '规划中',
    featured: true,
    cover: '',
    previews: [],
  },
  {
    name: 'UploadFlow',
    label: '上传流程',
    description: '分片上传、断点续传、并发控制与失败重试的完整上传状态机组件。',
    route: '/components/upload-flow',
    packageName: '@lyt/upload-flow',
    sourceUrl: 'https://github.com/liyangting/vue3-pure-components/tree/main/packages/upload-flow',
    category: '流程与状态',
    complexity: '进阶',
    tags: ['Vue 3', 'HTTP', '状态机', '并发控制'],
    status: '规划中',
    featured: true,
    cover: '',
    previews: [],
  },
  {
    name: 'PhysicsBall',
    label: '物理弹球',
    description: 'Matter.js 驱动的弹球游戏组件，含碰撞反馈、音效同步与难度曲线配置。',
    route: '/components/physics-ball',
    packageName: '@lyt/physics-ball',
    sourceUrl: 'https://github.com/liyangting/vue3-pure-components/tree/main/packages/physics-ball',
    category: '动画与交互',
    complexity: '高阶',
    tags: ['Vue 3', 'Matter.js', '物理模拟', '游戏化'],
    status: '规划中',
    featured: true,
    cover: '',
    previews: [],
  },
]

export const sidebarItems = componentRegistry.map(component => ({
  text: `${component.name} ${component.label}`,
  link: component.route,
}))
