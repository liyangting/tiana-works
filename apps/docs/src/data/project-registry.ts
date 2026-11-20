/**
 * 项目经验注册表。
 * 列表页、详情展开和首页精选都从这里取数据；新增项目时只需在此登记。
 */

export interface ProjectMetric {
  value: string
  label: string
}

export interface ProjectSection {
  title: string
  body?: string
  points?: string[]
}

export interface ProjectEntry {
  slug: string
  name: string
  subtitle: string
  category: '业务系统' | '平台与基建' | '工程效能'
  period: string
  role: string
  summary: string
  tags: string[]
  metrics: ProjectMetric[]
  sections: ProjectSection[]
  /** 是否在首页「精选项目」中展示。 */
  featured?: boolean
  /** 示例占位数据，替换为真实项目后改为已上线。 */
  status: '示例' | '已上线'
  links?: { label: string; href: string }[]
}

export const projectRegistry: ProjectEntry[] = [
  {
    slug: 'interactive-lottery-platform',
    name: '互动抽奖活动平台',
    subtitle: '把一次性活动页面拆成可配置的抽奖中台',
    category: '业务系统',
    period: '2024.03 — 2025.06',
    role: '前端负责人',
    summary:
      '面向运营活动的抽奖中台，覆盖扭蛋、转盘、盲盒等玩法。将玩法、奖池与活动配置解耦，让新活动从排期开发变成配置上线。',
    tags: ['Vue 3', '抽奖中台', '组件化', '状态机'],
    metrics: [
      { value: '20+', label: '复用活动' },
      { value: '40%', label: '交付周期下降' },
      { value: '3 类', label: '玩法统一接入' },
    ],
    sections: [
      {
        title: '背景与目标',
        body: '运营活动节奏快、玩法重复度高，过去每个活动都单独开发页面，导致交付周期长、动画质量参差。目标是把玩法沉淀成组件，把奖池和配置交给服务端。',
      },
      {
        title: '我的职责',
        points: [
          '拆解玩法与业务边界，设计抽奖组件的对外 API 和状态机。',
          '实现扭蛋、转盘两类高复杂度玩法，统一开奖与结果回收流程。',
          '与后端约定奖池、抽奖接口和降级策略，保证断网和超时可恢复。',
        ],
      },
      {
        title: '方案与取舍',
        body: '组件只负责表现与交互，抽取结果由使用方注入，避免在客户端泄露概率。动画与开奖解耦，动画中断不会影响业务结果；低端设备降级为简化动效。',
      },
      {
        title: '结果',
        points: [
          '新活动接入从排期开发变为配置 + 少量主题定制。',
          '玩法组件被多个活动复用，动画与埋点口径统一。',
          '沉淀了可独立发布的抽奖组件包，即本站的 GachaLottery。',
        ],
      },
    ],
    featured: true,
    status: '示例',
  },
  {
    slug: 'visual-page-builder',
    name: '可视化搭建平台',
    subtitle: '面向运营的拖拽搭建与物料体系',
    category: '平台与基建',
    period: '2023.05 — 2024.02',
    role: '核心开发',
    summary: '拖拽式页面搭建平台，提供物料协议、画布渲染、属性面板和发布链路，让运营可以独立完成活动页搭建。',
    tags: ['Vue 3', '物料协议', '拖拽', '低代码'],
    metrics: [
      { value: '30+', label: '物料组件' },
      { value: '5 min', label: '页面搭建耗时' },
      { value: '98%', label: '首屏达标率' },
    ],
    sections: [
      {
        title: '背景与目标',
        body: '活动页结构高度相似，但每次仍需前端介入。目标是提供一套物料协议和搭建器，让运营在约束内自由组合。',
      },
      {
        title: '我的职责',
        points: [
          '设计物料 schema 与渲染协议，统一编辑器与运行时的数据格式。',
          '实现画布拖拽、层级调整、撤销重做与属性面板联动。',
          '沉淀 30+ 常用物料，并接入图片与埋点能力。',
        ],
      },
      {
        title: '方案与取舍',
        body: '编辑器与运行时共用同一套渲染器，避免「编辑时好看、发布后不一致」。物料能力刻意收窄，只开放安全可控的配置项，换取稳定性。',
      },
      {
        title: '结果',
        points: [
          '常规活动页由运营自助搭建，前端只维护物料。',
          '发布链路内置体积与首屏校验，避免大图拖慢页面。',
        ],
      },
    ],
    featured: true,
    status: '示例',
  },
  {
    slug: 'frontend-performance-governance',
    name: '前端性能治理与虚拟列表',
    subtitle: '从监控指标到可复用的长列表方案',
    category: '工程效能',
    period: '2025.07 — 至今',
    role: '主导',
    summary: '建立前端性能基线与告警，针对长列表场景落地虚拟滚动方案，支撑百万级数据的流畅浏览。',
    tags: ['性能优化', '虚拟列表', '监控', 'Vue 3'],
    metrics: [
      { value: '2.4s → 0.9s', label: 'LCP' },
      { value: '100 万', label: '列表数据量' },
      { value: '63%', label: '渲染耗时下降' },
    ],
    sections: [
      {
        title: '背景与目标',
        body: '业务页面数据量持续增长，长列表出现滚动卡顿和首屏白屏。治理目标不是单点优化，而是建立可度量、可回归的性能基线。',
      },
      {
        title: '我的职责',
        points: [
          '接入性能监控，定义 LCP、长任务和滚动帧率基线。',
          '设计虚拟列表方案，支持动态高度测量与滚动位置恢复。',
          '推动性能预算进入发布流程，形成回归拦截。',
        ],
      },
      {
        title: '方案与取舍',
        body: '虚拟列表优先保证滚动稳定，动态高度采用测量缓存而非预估；对无法测量的场景提供固定高度降级。监控数据采样上报，避免治理本身成为负担。',
      },
      {
        title: '结果',
        points: [
          '核心页面 LCP 从 2.4s 降到 0.9s，长列表滚动保持稳定。',
          '性能预算进入发布流程，新增页面默认纳入基线检查。',
          '长列表方案抽象为独立组件，供其他业务复用。',
        ],
      },
    ],
    featured: true,
    status: '示例',
  },
]

export const projectCategories = ['业务系统', '平台与基建', '工程效能'] as const

export function findProject(slug: string): ProjectEntry | undefined {
  return projectRegistry.find((project) => project.slug === slug)
}

export const featuredProjects = projectRegistry.filter((project) => project.featured)
