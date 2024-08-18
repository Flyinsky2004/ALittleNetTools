<script setup>
import AppIcon from "@/components/AppIcon.vue";
import {reactive} from "vue";
import {message} from 'ant-design-vue';
import {defineProps, defineEmits} from 'vue'

const [messageApi, contextHolder] = message.useMessage();

const props = defineProps(['appId'])
const emit = defineEmits(['update:appId'])

const appClickHandler = (id) => {
  if (id < 0) {
    messageApi.warning('更多功能开发中...')
  } else {
    emit('update:appId', id)
  }
}

const apps = reactive([
  {
    id: 1,
    iconUrl: 'https://imgs.flyinsky.us.kg/file/94a3bdf18279c07521ea0.png',
    name: '小猫配置生成器(WS)'
  }, {
    id: -1,
    iconUrl: 'https://imgs.flyinsky.us.kg/file/27b64414afc264096f11c.png',
    name: '敬请期待...'
  }
])
</script>
<template>
  <context-holder/>
  <div class="container mx-auto px-4">
    <div class="p-4 rounded-lg mt-10 w-full">
      <div class="flex flex-wrap justify-center gap-4">
        <AppIcon
            class="cursor-pointer"
            v-for="app in apps"
            :iconUrl="app.iconUrl"
            :appName="app.name"
            @click="appClickHandler(app.id)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>