<script setup>
import useClipboard from 'vue-clipboard3'
import {message} from "ant-design-vue";

const [messageApi, contextHolder] = message.useMessage();
const props = defineProps(['appId'])
const emits = defineEmits(['update:appId'])
const goBack = () => {
  emits('update:appId', 0)
}
const {toClipboard} = useClipboard()

const copy = async (text) => {
  try {
    await toClipboard(text).then(messageApi.success('内容已复制至剪贴板'))
  } catch (e) {
    console.error(e)
  }
}

</script>
<template>
  <contextHolder/>
  <div class="basic-container max-w-4xl mx-auto p-6 rounded-lg shadow-xl">
    <h2 class="text-2xl font-bold mb-6 text-center">小猫配置生成器(WS)</h2>
    <div class="w-full flex flex-wrap gap-4">
      <button @click="goBack" type="submit"
              class="basic-button text-gray-200 w-20 bg-violet-600 hover:bg-violet-700 focus:ring-violet-500">
        返回
      </button>
      <button @click="resetForm" type="submit"
              class="basic-button text-gray-200 w-20 bg-zinc-600 hover:bg-zinc-700 focus:ring-zinc-500">
        重置
      </button>
      <button @click="fillSampleData" type="submit"
              class="basic-button text-gray-200 w-20 bg-sky-600 hover:bg-sky-700 focus:ring-sky-500">
        示例
      </button>
      <button @click="copy(yamlOutput)" type="submit"
              class="basic-button text-gray-200 w-auto bg-fuchsia-600 hover:bg-fuchsia-700 focus:ring-fuchsia-500">
        复制配置
      </button>
    </div>

    <div class="grid grid-cols-2">
      <form @submit.prevent="generateYAML" class="space-y-4">
        <div>
          <label for="ipAddresses" class="block text-sm font-medium  mb-1">IP列表(每行一个)</label>
          <textarea id="ipAddresses" v-model="formData.ipAddresses" class="basic-input" rows="5" required></textarea>
        </div>
        <div>
          <label for="type" class="block text-sm font-medium  mb-1">协议类型:</label>
          <input id="type" v-model="formData.type" class="basic-input" required>
        </div>
        <div>
          <label for="port" class="block text-sm font-medium  mb-1">端口:</label>
          <input id="port" v-model="formData.port" class="basic-input" required>
        </div>
        <div>
          <label for="uuid" class="block text-sm font-medium  mb-1">UUID:</label>
          <input id="uuid" v-model="formData.uuid" class="basic-input" required>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="udp" class="block text-sm font-medium  mb-1">UDP:</label>
            <select id="udp" v-model="formData.udp" class="basic-input" required>
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </div>
          <div>
            <label for="tls" class="block text-sm font-medium  mb-1">TLS:</label>
            <select id="tls" v-model="formData.tls" class="basic-input" required>
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </div>
        </div>
        <div>
          <label for="clientFingerprint" class="block text-sm font-medium  mb-1">客户端标识:</label>
          <input id="clientFingerprint" v-model="formData.clientFingerprint" class="basic-input" required>
        </div>
        <div>
          <label for="skipCertVerify" class="block text-sm font-medium  mb-1">跳过证书验证:</label>
          <select id="skipCertVerify" v-model="formData.skipCertVerify" class="basic-input" required>
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        </div>
        <div>
          <label for="servername" class="block text-sm font-medium  mb-1">服务器地址:</label>
          <input id="servername" v-model="formData.servername" class="basic-input" required>
        </div>
        <div>
          <label for="network" class="block text-sm font-medium  mb-1">传输类型:</label>
          <input id="network" v-model="formData.network" class="basic-input" required>
        </div>
        <div>
          <label for="wsOptsPath" class="block text-sm font-medium  mb-1">WS路径:</label>
          <input id="wsOptsPath" v-model="formData.wsOptsPath" class="basic-input" required>
        </div>
        <div>
          <label for="wsOptsHeadersHost" class="block text-sm font-medium  mb-1">WS服务器地址:</label>
          <input id="wsOptsHeadersHost" v-model="formData.wsOptsHeadersHost" class="basic-input" required>
        </div>
        <button type="submit" class="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          生成配置信息
        </button>
      </form>
      <div v-if="yamlOutput" class="ml-1">
        <h3 class="mb-2">配置信息:</h3>
        <textarea
            v-model="yamlOutput"
            rows="40"
            class="basic-input"
            readonly
        ></textarea>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        ipAddresses: '',
        type: '',
        port: '',
        uuid: '',
        udp: 'true',
        tls: 'true',
        clientFingerprint: '',
        skipCertVerify: 'false',
        servername: '',
        network: '',
        wsOptsPath: '',
        wsOptsHeadersHost: ''
      },
      yamlOutput: ''
    }
  },
  methods: {
    generateYAML() {
      const ipAddresses = this.formData.ipAddresses.split('\n').filter(ip => ip.trim() !== '');
      let yaml = '';

      for (const ip of ipAddresses) {
        yaml += `- name: ${ip}\n`;
        yaml += `  type: ${this.formData.type}\n`;
        yaml += `  server: ${ip}\n`;
        yaml += `  port: ${this.formData.port}\n`;
        yaml += `  uuid: ${this.formData.uuid}\n`;
        yaml += `  udp: ${this.formData.udp}\n`;
        yaml += `  tls: ${this.formData.tls}\n`;
        yaml += `  client-fingerprint: ${this.formData.clientFingerprint}\n`;
        yaml += `  skip-cert-verify: ${this.formData.skipCertVerify}\n`;
        yaml += `  servername: ${this.formData.servername}\n`;
        yaml += `  network: ${this.formData.network}\n`;
        yaml += `  ws-opts:\n`;
        yaml += `    path: ${this.formData.wsOptsPath}\n`;
        yaml += `    headers:\n`;
        yaml += `      Host: ${this.formData.wsOptsHeadersHost}\n`;
        yaml += '\n';
      }

      this.yamlOutput = yaml;
    }, resetForm() {
      this.formData = {
        ipAddresses: '',
        type: '',
        port: '',
        uuid: '',
        udp: 'true',
        tls: 'true',
        clientFingerprint: '',
        skipCertVerify: 'false',
        servername: '',
        network: '',
        wsOptsPath: '',
        wsOptsHeadersHost: ''
      };
      this.yamlOutput = '';
    },
    fillSampleData() {
      this.formData = {
        ipAddresses: '123.45.67.89\nexample.com\n1.1.1.1\n',
        type: 'vmess',
        port: '443',
        uuid: '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
        udp: 'true',
        tls: 'true',
        clientFingerprint: 'safari',
        skipCertVerify: 'false',
        servername: 'baidu.com',
        network: 'ws',
        wsOptsPath: '/settings?ed=2048',
        wsOptsHeadersHost: 'baidu.com'
      };
      this.generateYAML(); // 假设你有一个生成YAML的方法
    }
  }
}
</script>