<script setup>
import {useThemeStore} from "@/stores/theme.js";
import {onMounted, watch} from "vue";

const themeStore = useThemeStore()
onMounted(() => {
  themeStore.loadThemeCSS(themeStore.currentTheme)
})

watch(() => themeStore.isTransitioning, (isTransitioning) => {
  document.body.style.transition = isTransitioning ? 'background-color 0.3s, color 0.3s' : ''
})
</script>

<template>
  <div class="edge-container" :class="['app', { 'theme-transition': themeStore.isTransitioning }]">
    <RouterView/>
  </div>
</template>

<style scoped>
.theme-transition,
.theme-transition * {
  transition: background-color 0.1s, color 0.1s !important;
}
</style>
