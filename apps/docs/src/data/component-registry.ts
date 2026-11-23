import gachaCover from '../assets/gacha-lottery-cover.svg'
import waterfallCover from '../assets/waterfall.svg'
import physicsBallCover from '../assets/physics-ball-cover.svg'
import particleCanvasCover from '../assets/particle-canvas-cover.svg'
import uploadFlowCover from '../assets/upload-flow-cover.svg'
import virtualListCover from '../assets/virtual-list-cover.svg'

export interface ComponentPreview {
  /** 组件截图，由 Vite 作为模块资源引入，例如 src/assets/xxx.webp */
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
  /** 轮播卡片主色，用于底部信息区、强调线与激活描边。 */
  accent?: string
  /** 首页卡片封面图，引用 src/assets 中的图片。留空时 fallback 到 previews[0]，再兜底为 CSS 占位。 */
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
    sourceUrl: 'https://github.com/liyangting/tiana-works/tree/main/packages/gacha-lottery',
    category: '动画与交互',
    complexity: '高阶',
    tags: ['Vue 3', 'Matter.js', 'GSAP', '状态机'],
    status: '已发布',
    featured: true,
    accent: '#2f8074',
    cover: gachaCover,
    previews: [],
  },
  {
    name: 'Waterfall',
    label: '瀑布流',
    description: '最短列优先的纯净瀑布流布局，含容器尺寸监听、卡片高度实测、分页加载与图片尺寸工具。',
    route: '/components/waterfall',
    packageName: '@lyt/waterfall',
    sourceUrl: 'https://github.com/liyangting/tiana-works/tree/main/packages/waterfall',
    category: '布局与渲染',
    complexity: '进阶',
    tags: ['Vue 3', '瀑布流', 'ResizeObserver', '分页加载'],
    status: '已发布',
    featured: true,
    accent: '#c9a374',
    cover: waterfallCover,
    previews: [],
  },
  {
    name: 'VirtualList',
    label: '虚拟滚动',
    description: '支持百万级数据的窗口化列表，含动态高度测量、滚动回弹与首屏骨架。',
    route: '/components/virtual-list',
    packageName: '@lyt/virtual-list',
    sourceUrl: 'https://github.com/liyangting/tiana-works/tree/main/packages/virtual-list',
    category: '性能与渲染',
    complexity: '高阶',
    tags: ['Vue 3', '窗口化', 'Recycler', '动态高度'],
    status: '规划中',
    featured: true,
    accent: '#6d78c8',
    cover: virtualListCover,
    previews: [],
  },
  {
    name: 'ParticleCanvas',
    label: '粒子画布',
    description: '基于 Canvas 2D 的粒子系统，支持力场、碰撞、图片置换与 GPU 降级策略。',
    route: '/components/particle-canvas',
    packageName: '@lyt/particle-canvas',
    sourceUrl: 'https://github.com/liyangting/tiana-works/tree/main/packages/particle-canvas',
    category: '视觉与渲染',
    complexity: '高阶',
    tags: ['Vue 3', 'Canvas 2D', '粒子系统', '力场模拟'],
    status: '规划中',
    featured: true,
    accent: '#4f7f5b',
    cover: particleCanvasCover,
    previews: [],
  },
  {
    name: 'UploadFlow',
    label: '上传流程',
    description: '分片上传、断点续传、并发控制与失败重试的完整上传状态机组件。',
    route: '/components/upload-flow',
    packageName: '@lyt/upload-flow',
    sourceUrl: 'https://github.com/liyangting/tiana-works/tree/main/packages/upload-flow',
    category: '流程与状态',
    complexity: '进阶',
    tags: ['Vue 3', 'HTTP', '状态机', '并发控制'],
    status: '规划中',
    featured: true,
    accent: '#c2764a',
    cover: uploadFlowCover,
    previews: [],
  },
  {
    name: 'PhysicsBall',
    label: '物理弹球',
    description: 'Matter.js 驱动的弹球游戏组件，含碰撞反馈、音效同步与难度曲线配置。',
    route: '/components/physics-ball',
    packageName: '@lyt/physics-ball',
    sourceUrl: 'https://github.com/liyangting/tiana-works/tree/main/packages/physics-ball',
    category: '动画与交互',
    complexity: '高阶',
    tags: ['Vue 3', 'Matter.js', '物理模拟', '游戏化'],
    status: '规划中',
    cover: physicsBallCover,
    previews: [],
  },
]
