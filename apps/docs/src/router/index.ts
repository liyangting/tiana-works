import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: () => import('../views/HomeView.vue') },
    { path: '/projects', name: 'projects', component: () => import('../views/ProjectsView.vue') },
    { path: '/components', name: 'components', component: () => import('../views/ComponentsView.vue') },
    {
      path: '/components/gacha-lottery',
      name: 'gacha-lottery',
      component: () => import('../views/GachaLotteryView.vue'),
    },
    {
      path: '/components/waterfall',
      name: 'waterfall',
      component: () => import('../views/WaterfallView.vue'),
    },
    { path: '/about', name: 'about', component: () => import('../views/AboutView.vue') },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior(to, _from, savedPosition) {
    if (to.hash) {
      return { el: to.hash, top: 96, behavior: 'smooth' }
    }
    if (savedPosition) return savedPosition
    return { top: 0 }
  },
})

export default router
