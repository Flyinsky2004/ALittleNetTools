<script setup>
import {ref} from 'vue';
import {message} from "ant-design-vue";
import useClipboard from "vue-clipboard3";

const [messageApi, contextHolder] = message.useMessage();
const link = ref('');
const ipList = ref('');
const result = ref('');
const props = defineProps(['appId'])
const emits = defineEmits(['update:appId'])
const goBack = () => {
  emits('update:appId', 0);
}
const generateLinks = () => {
  const ips = ipList.value.split('\n').filter(ip => ip.trim() !== '');
  const linkPattern = link.value;

  const updatedLinks = ips.map(ip => {
    return linkPattern.replace(/\/\/(.*?)\:/, `//${ip}:`);
  });

  result.value = updatedLinks.join('\n');
  messageApi.success("节点链接生成完毕")
};
const {toClipboard} = useClipboard()

const copy = async (text) => {
  try {
    await toClipboard(text).then(messageApi.success('内容已复制至剪贴板'))
  } catch (e) {
    console.error(e)
  }
}
const fillExample = () => {
  link.value = 'vless://d4a7f8e2-5b47-4e83-a3a1-00c1c95f31e9@192.168.0.102:443?encryption=none&security=tls&sni=random-sni.example.com&fp=randomized&type=ws&host=random-host.example.com&path=%2F%3Fed%3D2560#random-host.example.com\n'
  ipList.value = '123.45.67.89\nexample.com\n1.1.1.1\n'
  generateLinks()
}
const resetData = () => {
  ipList.value = ''
  result.value = ''
  link.value = ''
}
</script>
<template>
  <contextHolder/>
  <div class="basic-container max-w-4xl mx-auto p-6 rounded-lg shadow-xl">
    <h2 class="text-2xl font-bold mb-6 text-center">链接批量生成器(IP列)</h2>
    <div class="mb-4">
      <label class="block  text-sm font-bold mb-2" for="link">
        节点链接
      </label>
      <textarea
          id="link"
          v-model="link"
          class="basic-input shadow appearance-none border rounded w-full py-2 px-3  leading-tight focus:outline-none focus:shadow-outline"
          rows="4"
          placeholder="输入节点链接"
      ></textarea>
    </div>
    <div class="mb-4">
      <label class="block  text-sm font-bold mb-2" for="ips">
        IP 地址列表
      </label>
      <textarea
          id="ips"
          v-model="ipList"
          class="basic-input shadow appearance-none border rounded w-full py-2 px-3  leading-tight focus:outline-none focus:shadow-outline"
          rows="4"
          placeholder="每行一个IP地址"
      ></textarea>
    </div>
    <div class="flex gap-4">
      <button
          @click="goBack"
          class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        返回
      </button>
      <button
          @click="generateLinks"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        生成链接
      </button>
      <button
          @click="copy(result.valueOf)"
          class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        复制链接
      </button>
      <button
          @click="fillExample"
          class="bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        示例
      </button>
      <button
          @click="resetData"
          class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        重置
      </button>
    </div>
    <div class="mt-4">
      <label class="block  text-sm font-bold mb-2" for="result">
        生成的链接
      </label>
      <textarea
          id="result"
          v-model="result"
          class="basic-input shadow appearance-none border rounded w-full py-2 px-3  leading-tight focus:outline-none focus:shadow-outline"
          rows="6"
          readonly
      ></textarea>
    </div>
  </div>
</template>

<style scoped>

</style>
