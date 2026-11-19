import { defineConfig } from 'vitepress'
import { componentRegistry, sidebarItems } from './component-registry'

export default defineConfig({
  title: 'Component Portfolio',
  description: '独立组件项目的在线作品集与文档站',
  base: process.env.GITHUB_ACTIONS ? '/vue3-pure-components/' : '/',
  themeConfig: {
    nav: [
      { text: '作品集', link: '/' },
      { text: '组件', link: componentRegistry[0]?.route ?? '/' },
      { text: 'GitHub', link: 'https://github.com/liyangting/vue3-pure-components' },
    ],
    sidebar: {
      '/components/': [{ text: '独立组件项目', items: sidebarItems }],
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/liyangting/vue3-pure-components' }],
    footer: { message: 'MIT Licensed', copyright: 'Copyright © 2026' },
  },
})
