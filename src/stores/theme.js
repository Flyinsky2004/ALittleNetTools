import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    currentTheme: 'light',
    isTransitioning: false
  }),
  actions: {
    setTheme(theme) {
      this.isTransitioning = true
      this.currentTheme = theme
      this.loadThemeCSS(theme)
    },
    toggleTheme() {
      const newTheme = this.currentTheme === 'light' ? 'dark' : 'light'
      this.setTheme(newTheme)
    },
    loadThemeCSS(theme) {
      const link = document.getElementById('theme-css') || document.createElement('link')
      link.id = 'theme-css'
      link.rel = 'stylesheet'
      link.href = `/src/assets/css/main-${theme}.css`

      link.onload = () => {
        setTimeout(() => {
          this.isTransitioning = false
        }, 300)
      }

      if (!document.getElementById('theme-css')) {
        document.head.appendChild(link)
      } else {
        link.href = `/src/assets/css/main-${theme}.css`
      }
    }
  }
})