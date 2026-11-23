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

export type ProjectAudience = 'B 端' | 'C 端' | '通用'

export interface ProjectEntry {
  slug: string
  name: string
  subtitle: string
  category: '业务系统' | '平台与基建'
  audience: ProjectAudience
  period: string
  role: string
  summary: string
  tags: string[]
  metrics: ProjectMetric[]
  sections: ProjectSection[]
  /** 是否在首页「精选项目」中展示。 */
  featured?: boolean
  status: '已上线' | '进行中'
  links?: { label: string; href: string }[]
}

export const projectRegistry: ProjectEntry[] = [
  {
    slug: 'smart-learning-platform',
    name: '企鹅智慧学练平台',
    subtitle: '多端统一与多模态 AIGC 的 AI 学习产品',
    category: '业务系统',
    audience: 'C 端',
    period: '2025.10 — 至今',
    role: '前端开发工程师',
    summary:
      '面向学生的 AI 学习平台，包含沉浸式知识地图、AI 学伴与多模态创作。用 pnpm workspace 统一 PC、H5、共享组件和请求层。',
    tags: ['Vue 3', 'TypeScript', 'pnpm workspace', 'SSE', 'Three.js'],
    metrics: [
      { value: '3 端', label: '统一 Monorepo' },
      { value: '3 级', label: '知识地图' },
      { value: '5 类', label: '生成内容' },
    ],
    sections: [
      {
        title: '背景与目标',
        body: '平台同时承载 PC 与 H5，AI 课堂、知识地图和创作模块并行迭代，多端代码与请求层长期各自维护，复用成本高。',
      },
      {
        title: '我的职责',
        points: [
          '基于 pnpm workspace 搭建多端 Monorepo，统一 PC、H5、共享组件、请求层和 AI 课堂组件包。',
          '开发宇宙、星系、星球三级沉浸式知识地图，支持拖拽平移、滚轮缩放、推荐路线导航和跨层级转场。',
          '参与多模态 AIGC 创作模块，覆盖文本、图片、视频、3D 和音频五类内容的生成与预览。',
          '基于 Pinia + Vue Router 实现角色动态路由、系统级菜单过滤和登录后安全回跳。',
        ],
      },
      {
        title: '方案与取舍',
        body: '视频和 3D 生成耗时不可控，先用 SSE 流式输出给出可见反馈，再用异步任务轮询收口结果；地图动画对低性能设备保留降级方案，优先保证交互不卡死。',
      },
      {
        title: '结果',
        points: [
          'PC 与 H5 共享同一套组件和请求层，新增页面不再重复实现基础能力。',
          '知识地图支持跨层级连续转场，视频首帧预热门槛降低。',
          '多来源登录与权限体系统一为一套流程。',
        ],
      },
    ],
    featured: true,
    status: '已上线',
    links: [{ label: 'ailearning.qq.com', href: 'https://ailearning.qq.com' }],
  },
  {
    slug: 'bp-banpick-tool',
    name: 'BP 对战 BanPick 工具',
    subtitle: '微信 / QQ 双端可用的移动端赛事工具',
    category: '业务系统',
    audience: 'C 端',
    period: '2025.09 — 2025.10',
    role: '独立开发',
    summary:
      '从 0 到 1 独立完成的 H5 工具，覆盖落地页、BP 对战交互和结果海报三大页面，兼容微信与 QQ 内置浏览器。',
    tags: ['Vue 3', 'TypeScript', 'WebSocket', '状态机'],
    metrics: [
      { value: '0→1', label: '独立交付' },
      { value: '3 种', label: '赛制规则' },
      { value: '2 端', label: '内置浏览器' },
    ],
    sections: [
      {
        title: '背景与目标',
        body: '赛事 BP 需要在微信和 QQ 的内置浏览器里完成，现场对实时性和操作准确度要求高。',
      },
      {
        title: '我的职责',
        points: [
          '独立完成 H5 前端与工程搭建，落地页、BP 对战、结果海报三大核心页面。',
          '实现 BO1 / BO3 / BO5 三种赛制的 Ban/Pick 状态机，动态渲染地图池和轮次操作面板。',
          '基于 WebSocket 做房间实时同步，封装心跳检测与断线重连。',
          '开发海报合成导出，支持一键保存到手机相册。',
        ],
      },
      {
        title: '方案与取舍',
        body: '状态机只允许合法操作进入下一步，禁用态用分层视觉反馈区分；移动端做资源分包和懒加载，优先保证弱网下不卡顿。',
      },
      {
        title: '结果',
        points: [
          '房间内所有成员的操作状态实时一致。',
          '结果海报可直接保存和分享，作为赛事凭证。',
          '微信、QQ 双端内置浏览器均可正常使用。',
        ],
      },
    ],
    status: '已上线',
    links: [{ label: 'ves.qq.com', href: 'https://ves.qq.com/cfm-bptool/index.html' }],
  },
  {
    slug: 'high-risk-control',
    name: '高风险管控项目',
    subtitle: 'PC 与移动端三端协同的风险管控系统',
    category: '业务系统',
    audience: 'B 端',
    period: '2025.02 — 2025.04',
    role: '前端开发工程师',
    summary:
      '面向企业风控场景的三端系统，PC 公司侧、平台侧与移动端并行开发，统一组件与权限指令后复用。',
    tags: ['Vue', 'uni-app', 'ECharts', '组件封装'],
    metrics: [
      { value: '3 端', label: '协同开发' },
      { value: '20+', label: '公用组件' },
      { value: '实时', label: '风险看板' },
    ],
    sections: [
      {
        title: '背景与目标',
        body: '同一套风控业务需要在公司侧、平台侧和移动端同时落地，三端各自实现会导致逻辑和样式不一致。',
      },
      {
        title: '我的职责',
        points: [
          '采用模块化工程结构，分离 PC 端（公司侧、平台侧）和移动端代码，保证业务逻辑同源。',
          '封装数据表格、表单校验、权限指令等全局公用组件，提升三端复用率。',
          '用 Vue mixins 抽离通用逻辑，减少重复代码。',
          '集成 ECharts 开发风险数据可视化看板，支持实时刷新。',
        ],
      },
      {
        title: '方案与取舍',
        body: '先统一数据结构和权限模型，再做三端 UI，避免为了一致性反复改动业务逻辑。',
      },
      {
        title: '结果',
        points: ['三端共用一套业务逻辑和公用组件。', '风险看板支持实时刷新，异常能第一时间暴露。'],
      },
    ],
    status: '已上线',
  },
  {
    slug: 'enterprise-saas-platform',
    name: '企业数字化 SaaS 平台',
    subtitle: '10+ 生态集成的低代码平台',
    category: '平台与基建',
    audience: 'B 端',
    period: '2021.07 — 2025.06',
    role: '核心开发',
    summary:
      '企业级低代码平台，覆盖页面设计器、表单设计器、角色权限和流程设计，集成企微、钉钉、微信等 10+ 生态。',
    tags: ['Vue 2', 'Element', '低代码', 'WebSocket'],
    metrics: [
      { value: '10+', label: '生态集成' },
      { value: '100%', label: '中英文覆盖' },
      { value: '99.9%', label: '连接稳定性' },
    ],
    sections: [
      {
        title: '背景与目标',
        body: '客户侧业务差异大，逐个定制开发成本高，需要一套可配置的低代码平台承载表单、流程和页面。',
      },
      {
        title: '我的职责',
        points: [
          '主导搭建企业级低代码平台，支持企微、钉钉、微信、高德、谷歌、支付等 10+ 生态集成。',
          '独立开发可视化页面设计器，用拖拽生成页面，降低客户使用门槛。',
          '完成国际化方案，中英文覆盖 100%。',
          '参与表单设计器、角色权限、组织结构、流程设计、自定义主题等主要业务模块。',
          '基于 WebSocket 实现多租户实时消息通道，含心跳检测和断线重连。',
        ],
      },
      {
        title: '方案与取舍',
        body: '设计器与运行态共用同一套渲染规则，避免配置时和运行时表现不一致；多租户消息按租户隔离通道，稳定性优先于功能堆叠。',
      },
      {
        title: '结果',
        points: [
          '常规页面由页面设计器配置产出，减少重复开发。',
          '多租户消息连接稳定性达到 99.9%。',
          '代码优化与资源合并后，页面加载时间下降。',
        ],
      },
    ],
    featured: true,
    status: '已上线',
    links: [{ label: 'user.zdsztech.com', href: 'https://user.zdsztech.com' }],
  },
  {
    slug: 'zd-gongchengtong',
    name: '支点工程通 App',
    subtitle: 'WebView 与原生混合的移动端应用',
    category: '平台与基建',
    audience: 'B 端',
    period: '2021.07 — 2025.06',
    role: '核心开发',
    summary:
      '与 PC 端解耦的混合开发 App，通过 JSBridge 封装相机、GPS、文件系统等 20+ 原生能力。',
    tags: ['Vue 2', 'Vant', 'JSBridge', '混合开发'],
    metrics: [
      { value: '20+', label: '原生能力' },
      { value: '1 万+', label: '下载量' },
      { value: '2 万+', label: '日活用户' },
    ],
    sections: [
      {
        title: '背景与目标',
        body: '移动端需要同时使用 Web 的迭代效率和原生能力，且不能与 PC 端代码互相牵制。',
      },
      {
        title: '我的职责',
        points: [
          '从 0 构建与 PC 端解耦的混合开发框架，集成 WebView 与原生能力。',
          '通过 JSBridge 封装相机、GPS、文件系统等 20+ 原生能力，并保持与原生一致的 API 形态。',
          '开发统一身份认证模块，集成钉钉、企微、微信三端，实现单点登录与消息推送。',
          '主导页面设计器运行态、表单上报态、国际化等配套业务。',
        ],
      },
      {
        title: '方案与取舍',
        body: 'JSBridge 调用统一错误码和超时处理，避免原生异常直接抛到页面；与 PC 端共享数据协议，但不共享状态管理。',
      },
      {
        title: '结果',
        points: [
          '下载量 1 万+，日活用户 2 万+。',
          '三端登录收敛为统一认证流程。',
          '页面设计器产出的页面可在 App 内直接运行。',
        ],
      },
    ],
    status: '已上线',
    links: [{ label: 'app.zdsztech.com', href: 'https://app.zdsztech.com' }],
  },
  {
    slug: 'saas-admin-console',
    name: 'SaaS 平台管理端',
    subtitle: 'React 技术栈的平台侧管理后台',
    category: '业务系统',
    audience: 'B 端',
    period: '2021.07 — 2023.11',
    role: '前端开发工程师',
    summary:
      '平台侧管理后台，用 React + Redux + AntDesign 承载权限、系统配置和模板中心。',
    tags: ['React', 'Redux', 'AntDesign', 'Hooks'],
    metrics: [
      { value: '20+', label: '原生组件' },
      { value: '3 大', label: '核心模块' },
      { value: '1 套', label: '权限模型' },
    ],
    sections: [
      {
        title: '背景与目标',
        body: '平台侧需要统一管理公司、模板和系统配置，并复用 PC 端的原生能力。',
      },
      {
        title: '我的职责',
        points: [
          '基于文件系统等 20+ 原生能力组件与 Hooks 开发业务模块。',
          '用 Redux 管理全局状态，处理用户权限和系统配置数据。',
          '独立开发并交付公司管理、模板中心、系统配置模块。',
          '优化数据提交，增加防抖和节流，避免重复请求。',
        ],
      },
      {
        title: '方案与取舍',
        body: '权限判断收敛到统一模型，页面只声明所需权限，不在各模块重复写判断。',
      },
      {
        title: '结果',
        points: ['公司管理、模板中心、系统配置三个模块独立交付。', '表单提交增加防抖节流，重复请求明显减少。'],
      },
    ],
    status: '已上线',
  },
  {
    slug: 'component-assets',
    name: '可复用高交互组件资产',
    subtitle: '把复杂交互沉淀成可独立交付的组件包',
    category: '平台与基建',
    audience: '通用',
    period: '持续',
    role: '独立开发',
    summary:
      '把物理动画、Canvas、虚拟列表和上传流程这类高复杂度能力拆成独立包，每个包都带公开 API、Playground 和文档。',
    tags: ['Vue 3', '组件设计', 'Matter.js', 'Canvas'],
    metrics: [
      { value: '1 个', label: '已发布' },
      { value: '4 个', label: '开发中' },
      { value: '3 类', label: '场景覆盖' },
    ],
    sections: [
      {
        title: '背景与目标',
        body: '复杂交互在不同项目里反复从零实现，动画质量和边界处理参差不齐，需要沉淀成可复用资产。',
      },
      {
        title: '我的职责',
        points: [
          '设计组件对外 API 和状态机，业务数据通过 Props 和 Emits 注入，不在组件内绑定业务。',
          '实现物理扭蛋、粒子系统、虚拟滚动、分片上传等能力。',
          '为每个组件补齐 Playground、文档、可访问性和降级策略。',
        ],
      },
      {
        title: '方案与取舍',
        body: '组件只负责表现与交互，概率、接口和奖池由使用方注入；性能预算先于视觉效果，低端设备提供简化动效。',
      },
      {
        title: '结果',
        points: [
          '扭蛋机已作为独立包发布。',
          '其余组件按同一套交付标准推进中。',
          '组件文档与在线 Demo 集中在站内组件页。',
        ],
      },
    ],
    featured: true,
    status: '进行中',
  },
]

export const projectCategories = ['业务系统', '平台与基建'] as const

export function findProject(slug: string): ProjectEntry | undefined {
  return projectRegistry.find((project) => project.slug === slug)
}

export const featuredProjects = projectRegistry.filter((project) => project.featured)
