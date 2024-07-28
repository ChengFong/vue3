// 小倉庫: layout組件相關配置倉庫
import { defineStore } from 'pinia'

const useLayoutSettingStore = defineStore('SettingStore', {
  state: () => {
    {
      return {
        fold: false, // 用戶控制菜單摺疊還是收起控制
        refsh: false, // 倉庫這個屬性用於控制刷新效果
      }
    }
  },
})

export default useLayoutSettingStore
