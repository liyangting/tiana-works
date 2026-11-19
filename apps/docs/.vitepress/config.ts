import { defineConfig } from 'vitepress'
import { componentRegistry, sidebarItems } from './component-registry'

export default defineConfig({
  title: 'Tiana',
  description: '李杨婷的 Vue 3 复杂组件作品集',
  base: process.env.GITHUB_ACTIONS ? '/vue3-pure-components/' : '/',
  // 深色优先：首次访问默认深色，仍保留右上角的浅色切换。
  appearance: { initialValue: 'dark' },
  head: [
    [
      'script',
      {},
      // 旧版本曾把 auto 写入本地存储，导致深色默认值不生效；这里做一次迁移。
      `try{if(localStorage.getItem('vitepress-theme-appearance')==='auto'){localStorage.setItem('vitepress-theme-appearance','dark')}}catch(e){}`,
    ],
  ],
  themeConfig: {
    nav: [
      { text: '作品', link: '/#pf-works' },
      { text: '关于', link: '/#pf-about' },
      { text: '组件', link: componentRegistry[0]?.route ?? '/' },
    ],
    sidebar: {
      '/components/': [{ text: '独立组件项目', items: sidebarItems }],
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/liyangting/vue3-pure-components' }],
    footer: { message: 'MIT Licensed', copyright: 'Copyright © 2026' },
  },
})
