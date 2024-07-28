// 引入項目中全部的全局組件
import SvgIcon from '@/components/SvgIcon/index.vue'
import Category from '@/components/Category/index.vue'
import type { App, Component } from 'vue'

// 引入element-plus提供全部圖標組件
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 全局對象
const components: { [name: string]: Component } = { SvgIcon, Category }

// 對外暴露插件對象
export default {
  install(app: App) {
    // 註冊項目全部的全局組件
    Object.keys(components).forEach((key) => {
      // 註冊為全局組件
      app.component(key, components[key])
    })

    // 將element-plus提供圖標註冊為全局組件
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component)
    }
  },
}
