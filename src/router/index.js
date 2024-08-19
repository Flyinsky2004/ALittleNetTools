import { createRouter, createWebHistory } from 'vue-router'
import {useThemeStore} from "@/stores/theme.js";
import axios from "axios";


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      name: 'index',
      path: '/',
      component: () => import('@/views/Index.vue'),
    }, {
      name: '403',
      path: "/403",
      component: () => import('@/components/common/403.vue')
    }

  ]
})
router.beforeEach(async (to, from, next) => {
  const themeStore = useThemeStore()
  themeStore.initTheme()
  // if (to.path === '/403') {
  //   next()
  // } else {
  //   try {
  //     // 使用 ipapi.co 服务获取 IP 信息
  //     const response = await axios.get('http://ip-api.com/json')
  //     const {countryCode} = response.data
  //
  //     // 检查是否为中国大陆 IP
  //     if (countryCode === 'CN') {
  //       // 如果是中国大陆 IP，重定向到 /403 页面
  //       next('/403')
  //     } else {
  //       // 如果不是中国大陆 IP，允许访问
  //       next()
  //     }
  //   } catch (error) {
  //     console.error('获取 IP 信息失败:', error)
  //     // 如果获取 IP 信息失败，为了安全起见，重定向到 /403 页面
  //     next('/403')
  //   }
  // }
  next()
})
export default router
