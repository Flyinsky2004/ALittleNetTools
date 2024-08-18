<template>
  <div class="appIcon flex flex-col items-center p-4 rounded-lg shadow-md w-24">
    <img :src="iconUrl" alt="App Icon" class="w-16 h-16 mb-2 rounded-lg">
    <span class="text-center text-sm font-medium">{{ appName }}</span>
  </div>
</template>

<script>
export default {
  props: {
    iconUrl: {
      type: String,
      required: true
    },
    appName: {
      type: String,
      required: true
    }
  }
}
</script>