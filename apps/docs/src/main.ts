import { createApp } from 'vue'
import { ElContainer, ElHeader, ElLink, ElMain, ElMenu, ElMenuItem, ElSwitch } from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import App from './App.vue'
import router from './router'
import './styles/base.scss'

const savedTheme = localStorage.getItem('pf-theme')
const isDark = savedTheme ? savedTheme === 'dark' : true
document.documentElement.classList.toggle('dark', isDark)

const app = createApp(App)
app.use(router)
;[ElContainer, ElHeader, ElMain, ElMenu, ElMenuItem, ElSwitch, ElLink].forEach((component) =>
  app.use(component),
)
app.mount('#app')
