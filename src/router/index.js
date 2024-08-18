import { createRouter, createWebHistory } from 'vue-router'
import {useThemeStore} from "@/stores/theme.js";


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      name: 'index',
      path: '/',
      component: () => import('@/views/Index.vue'),
    }

  ]
})
router.beforeEach((to, from, next) => {
  const themeStore = useThemeStore()
  themeStore.loadThemeCSS(themeStore.currentTheme)
  next()
})
export default router
