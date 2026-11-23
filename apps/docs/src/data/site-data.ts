/**
 * 站点级个人资料。
 * 首页、关于我页面共用同一份数据，避免两处文案各写一遍。
 */

export interface ProfileLink {
  label: string
  icon: 'mail' | 'github'
  href?: string
  /** 提供后点击链接改为复制该文本，不再跳转。 */
  copy?: string
}

export interface AboutBlock {
  title: string
  body: string
}

export interface ExperienceItem {
  period: string
  company: string
  role: string
  desc?: string
}

export interface StackGroup {
  label: string
  items: string[]
}

export interface AboutPhase {
  label: string
  period: string
  title: string
  summary: string
  points: string[]
  current?: boolean
}

export interface AboutPrinciple {
  title: string
  body: string
}

export const profile = {
  name: 'Tiana',
  displayName: '李杨婷',
  role: '前端开发工程师',
  statement: '把复杂交互做稳，把工程细节做实。',
  subline: '项目、组件与工程实践，都记录在这里。',
  location: '陕西西安',
  avatar: '',
  intro: [
    '8 年前端开发。经历过从 0 到 1 搭建新项目，也长期维护迭代老系统，独立覆盖需求拆解、技术选型、架构落地、上线与运维的完整链路。',
    '深耕 Vue 生态，也写 React 和 uni-app。做过企业级低代码 SaaS、混合 App 和 3D 可视化，也做面向用户的 AI 学习产品；B 端和 C 端都完整走过从需求到上线的流程。',
    '对我来说，项目完成的标准不止功能可用，更在于边界清晰、方案可复用、代码好交接。',
  ],
  links: [
    { label: 'tiana112625@gmail.com', icon: 'mail', copy: 'tiana112625@gmail.com' },
    { label: 'GitHub', icon: 'github', href: 'https://github.com/liyangting' },
  ] as ProfileLink[],
}

/** 首页摘要与关于页共用的三条做事方式。 */
export const aboutBlocks: AboutBlock[] = [
  {
    title: '从边界开始',
    body: '先写清组件管什么、不管什么：状态怎么流转、输入输出是什么、失败和降级走哪条路。视觉实现放在这些之后。',
  },
  {
    title: '偏爱有手感的交互',
    body: '动效、物理和 Canvas 是我更愿意投入的方向，但性能预算和降级方案必须先成立，而不是最后再补。',
  },
  {
    title: '交付，而不是演示',
    body: '独立包、公开 API、Playground、文档和可访问性，缺一项就不算完成。组件应该能被别人接手，而不是只能由我维护。',
  },
]

/** 关于页的能力阶段对照：手写期与 AI 协同期。 */
export const aboutPhases: AboutPhase[] = [
  {
    label: '手写期',
    period: '入行早期',
    title: '没有补全，也没有生成',
    summary: '低代码平台、混合 App、3D 地球和多租户实时消息，都是自己一层层搭出来的。',
    points: [
      '主导企业级低代码平台，独立搭可视化页面设计器与表单设计器',
      '用 JSBridge 封装 20+ 原生能力，做 WebView 与原生混合的 App 框架',
      '用 ECharts GL 做可交互 3D 地球；WebSocket 撑多租户消息，连接稳定性 99.9%',
    ],
  },
  {
    label: 'AI 协同期',
    period: '近一年多',
    title: 'AI 起草，人做判断',
    summary: '把探索、脚手架和重复劳动交给 AI，精力放在方案、边界和验收上。',
    points: [
      '参与 AI 课堂与多模态 AIGC，处理文本、图片、视频、3D、音频五类内容',
      '用 SSE 流式输出和异步任务轮询，解决长耗时生成的前端体验',
      '用 pnpm workspace 搭多端 Monorepo；AI 起草的改动必须过类型、lint、构建和实测',
    ],
    current: true,
  },
]

/** AI 时代没有改变的三项能力。 */
export const aboutPrinciples: AboutPrinciple[] = [
  {
    title: '定位问题',
    body: '从报错、现象、代码三侧收敛，判断问题在框架、状态、渲染还是构建层。',
  },
  {
    title: '纠错验证',
    body: 'AI 的方案一定会有错，能识别错、缩小范围、给出最小修复才是分界线。',
  },
  {
    title: '架构取舍',
    body: '知道什么该抽象、什么该留在原地，避免生成“看起来完整”的过度设计。',
  },
]

export const experienceTimeline: ExperienceItem[] = [
  {
    period: '2025.09 — 至今',
    company: '亿达信息技术有限公司（腾讯项目）',
    role: '前端开发工程师',
    desc: '负责企鹅智慧学练平台 PC/H5，参与 AI 课堂、多模态创作、沉浸式知识地图与多端 Monorepo 建设。',
  },
  {
    period: '2024.03 — 2025.07',
    company: '浙江支点数字科技有限公司',
    role: '前端开发工程师',
    desc: '负责企业数字化 SaaS 平台与移动端产品迭代，覆盖低代码、混合 App、管理端与官网。',
  },
  {
    period: '2021.07 — 2024.03',
    company: '博彦科技（西安）',
    role: '前端开发工程师',
    desc: '驻场支点项目，参与低代码 SaaS 平台与混合 App 从 0 搭建，负责页面设计器、原生能力封装等核心模块。',
  },
  {
    period: '2019.01 — 2021.07',
    company: '西安银信博锐信息科技有限公司',
    role: '前端开发工程师',
    desc: 'C 端教育类产品前端开发，早期项目从略。',
  },
]

export const stackGroups: StackGroup[] = [
  { label: '框架与语言', items: ['Vue 2 / Vue 3', 'TypeScript', 'React', 'uni-app'] },
  { label: '渲染与可视化', items: ['Three.js', 'ECharts GL', 'Canvas 2D', 'GSAP', 'Lottie', 'Matter.js'] },
  { label: '工程与质量', items: ['pnpm workspace', 'Vite', 'Webpack', 'ESLint', 'Monorepo'] },
  {
    label: '业务与集成',
    items: ['低代码 / 页面设计器', 'WebSocket', 'SSE', 'JSBridge 混合开发', '微信 / 企微 / 钉钉生态'],
  },
  { label: 'AI 与智能', items: ['多模态生成', '流式输出', '异步任务轮询', 'AIGC 创作'] },
]

export const stackSummary = [
  'Vue 3',
  'TypeScript',
  'React',
  'Three.js',
  'ECharts',
  'WebSocket / SSE',
  '低代码',
  '多端 Monorepo',
  'AI 应用',
]
