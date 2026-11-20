/**
 * 站点级个人资料。
 * 首页、关于我页面共用同一份数据，避免两处文案各写一遍。
 */

export interface ProfileLink {
  label: string
  icon: 'juejin' | 'mail' | 'github'
  href: string
}

export interface AboutBlock {
  title: string
  body: string
}

export interface ExperienceItem {
  period: string
  company: string
  role: string
  desc: string
}

export interface StackGroup {
  label: string
  items: string[]
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
    '不局限单一框架，深耕 Vue 生态，也经手物理动画、Canvas 渲染、长列表、大文件上传这类复杂场景。',
    '对我来说，项目完成的标准不止功能可用，更在于边界清晰、方案可复用、代码好交接。',
  ],
  links: [
    { label: '掘金', icon: 'juejin', href: '' },
    { label: '邮箱', icon: 'mail', href: '' },
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

export const experienceTimeline: ExperienceItem[] = [
  {
    period: '2025 — 至今',
    company: '公司名称待补充',
    role: '高级前端工程师',
    desc: '负责复杂交互组件与前端性能治理，沉淀可复用的组件资产。此处为示例占位，替换为真实经历即可。',
  },
  {
    period: '2023 — 2025',
    company: '公司名称待补充',
    role: '前端工程师',
    desc: '参与互动活动平台与可视化搭建系统建设，负责前端方案设计与核心模块实现。此处为示例占位。',
  },
  {
    period: '2021 — 2023',
    company: '公司名称待补充',
    role: '前端工程师',
    desc: '负责中后台业务系统开发，推动组件库与工程规范落地。此处为示例占位。',
  },
]

export const stackGroups: StackGroup[] = [
  { label: '框架与语言', items: ['Vue 3', 'TypeScript', 'Vite', 'Node.js'] },
  { label: '渲染与动效', items: ['Canvas 2D', 'WebGL', 'GSAP', 'Matter.js', 'CSS 动画'] },
  { label: '工程与质量', items: ['pnpm workspace', '组件库设计', '性能优化', '自动化测试'] },
  { label: '文档与交付', items: ['Vite', 'Playground', '可访问性', 'API 设计'] },
]

export const stackSummary = [
  'Vue 3',
  'TypeScript',
  'Vite',
  'pnpm',
  'GSAP',
  'Matter.js',
  'Canvas / WebGL',
  'CSS 动效',
  '性能优化',
]
