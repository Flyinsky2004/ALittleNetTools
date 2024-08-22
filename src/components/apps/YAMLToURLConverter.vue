<script setup>
import {ref} from "vue";
import yaml from 'js-yaml'
import {message} from "ant-design-vue";

const [messageApi, contextHolder] = message.useMessage();
const yamlInput = ref('')
const urlOutput = ref('')
const urlInput = ref('')
const yamlOutput = ref('')
const props = defineProps(['appId'])
const emits = defineEmits(['update:appId'])
const goBack = () => {
  emits('update:appId', 0)
}
const convertYamlToUrl = () => {
  try {
    const parsedYaml = yaml.load(yamlInput.value)
    if (Array.isArray(parsedYaml)) {
      urlOutput.value = parsedYaml.map(item => {
        const {
          type,
          uuid,
          server,
          port,
          encryption = 'none',
          security = 'tls',
          servername,
          fp = 'randomized',
          network = 'ws',
          'ws-opts': wsOpts
        } = item
        const host = wsOpts?.headers?.Host || server
        const path = wsOpts?.path || '/'
        const encodedName = encodeURIComponent(item.name)
        return `${type}://${uuid}@${server}:${port}?encryption=${encryption}&security=${security}&sni=${servername}&fp=${fp}&type=${network}&host=${host}&path=${encodeURIComponent(path)}#${encodedName}`
      }).join('\n')
    } else {
      urlOutput.value = '非法的YAML格式'
    }
  } catch (error) {
    urlOutput.value = `发生错误: ${error.message}`
  }
}

const convertUrlToYaml = () => {
  try {
    const urls = urlInput.value.split('\n').filter(url => url.trim() !== '')
    const configs = urls.map(url => {
      const [urlPart, name] = url.split('#')
      const match = urlPart.match(/^(.*?):\/\/(.*?)@(.*?):(\d+)/)
      if (!match) {
        throw new Error(`非法URL格式: ${urlPart}`)
      }
      const [, type, uuid, server, port] = match
      const searchParams = new URLSearchParams(urlPart.split('?')[1])

      return {
        name: decodeURIComponent(name || ''),
        type,
        server,
        port: parseInt(port),
        uuid,
        udp: true,
        tls: searchParams.get('security') === 'tls',
        'client-fingerprint': searchParams.get('fp'),
        'skip-cert-verify': false,
        servername: searchParams.get('sni'),  // Correctly map 'sni' to 'servername'
        network: searchParams.get('type'),
        'ws-opts': {
          path: decodeURIComponent(searchParams.get('path') || '/'),
          headers: {
            Host: searchParams.get('host') || server
          }
        }
      }
    })
    yamlOutput.value = yaml.dump(configs)
  } catch (error) {
    yamlOutput.value = `发生错误: ${error.message}`
  }
}
</script>
<template>
  <contextHolder/>
  <div class="basic-container max-w-4xl mx-auto p-6 rounded-lg shadow-xl">
    <button @click="goBack" class="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">返回</button>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <h2 class="text-xl font-bold mb-2">YAML转URL</h2>
        <textarea v-model="yamlInput" class="basic-input w-full h-64 p-2 border rounded"
                  placeholder="此处输入YAML 换行隔开"></textarea>
        <button @click="convertYamlToUrl" class="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          转为URL
        </button>
      </div>
      <div>
        <h2 class="text-xl font-bold mb-2">URL结果</h2>
        <textarea v-model="urlOutput" class="basic-input w-full h-64 p-2 border rounded" readonly></textarea>
      </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
      <div>
        <h2 class="text-xl font-bold mb-2">URL转YAML</h2>
        <textarea v-model="urlInput" class="basic-input w-full h-64 p-2 border rounded"
                  placeholder="此处输入URL 换行隔开"></textarea>
        <button @click="convertUrlToYaml" class="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          转为YAML
        </button>
      </div>
      <div>
        <h2 class="text-xl font-bold mb-2">YAML结果</h2>
        <textarea v-model="yamlOutput" class="basic-input w-full h-64 p-2 border rounded" readonly></textarea>
      </div>
    </div>
  </div>
</template>
<style scoped>
textarea {
  @apply dark:text-black;
}
</style>