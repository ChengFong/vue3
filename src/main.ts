import { createApp } from 'vue'
import App from '@/App.vue'
// 引入element-plus插件與樣式
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 配置element-plus國際化
// @ts-expect-error忽略当前文件ts类型的检测否则有红色提示(打包会失败)
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
// 獲取應用實例對象
const app = createApp(App)
// 安裝element-plus插件
app.use(ElementPlus, {
  locale: zhCn, // element-plus國際化配置
})
// svg插件需要配置代碼
import 'virtual:svg-icons-register'

// 引入自定義插件對象: 註冊整個項目全局組件
import globalComponent from '@/components'
// 安裝自定義插件
app.use(globalComponent)

// 引入模板的全局樣式
import '@/styles/index.scss'

// 引入路由
import router from './router'
// 引入路由鑒權文件
import './permission'
// 註冊模板路由
app.use(router)

// 引入倉庫
import pinia from './store'
// 安裝倉庫
app.use(pinia)

// 將應用掛載到掛載點上
app.mount('#app')
