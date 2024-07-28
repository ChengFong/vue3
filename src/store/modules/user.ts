// 創建用戶相關的小倉庫
import { defineStore } from 'pinia'
// 引入接口
import { reqLogin, reqUserInfo, reqLogout } from '@/api/user'
// 引入數據類型
import type {
  loginFormData,
  loginResponseData,
  userInfoReponseData,
} from '@/api/user/type'
import type { UserState } from './types/type'
// 引入操作本地存儲的工具方法
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from '@/utils/token'
// 引入路由(常量路由)
import { constantRoute } from '@/router/routes'
// 創建用戶小倉庫
const useUserStore = defineStore('User', {
  // 小倉庫存儲數據地方
  state: (): UserState => {
    return {
      token: GET_TOKEN(), // 用戶唯一標識token
      menuRoutes: constantRoute, // 倉庫存儲生成菜單需要數組(路由)
      username: '',
      avatar: '',
    }
  },
  // 異步|邏輯的地方
  actions: {
    // 用戶登錄的方法
    async userLogin(data: loginFormData) {
      // 登錄請求
      const result: loginResponseData = await reqLogin(data)
      // 登錄請求: 成功200->token
      // 登錄請求: 失敗201->登錄失敗錯誤的信息
      if (result.code == 200) {
        // pinia倉庫存儲一下token
        // 由於pinia|vuex存儲數據其實利用js對象
        this.token = result.data as string
        // 本地存儲持久化存儲一份
        SET_TOKEN(result.data as string)
        // 能保證當前async函數返回一個成功的promise
        return 'ok'
      } else {
        return Promise.reject(new Error(result.data))
      }
    },
    // 獲取用戶信息方法
    async userInfo() {
      // 獲取用戶信息進行存儲倉庫當中(用戶頭像、名字)
      const result: userInfoReponseData = await reqUserInfo()
      // 如果獲取用戶信息成功，存儲一下用戶信息
      if (result.code == 200) {
        this.username = result.data.username
        this.avatar = result.data.avatar
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
    // 退出登錄
    async userLogout() {
      const result = await reqLogout()
      if (result.code == 200) {
        // 目前沒有mock接口: 退出登錄接口(通知服務器本地用戶唯一標示失效)
        this.token = ''
        this.username = ''
        this.avatar = ''

        REMOVE_TOKEN()
        return 'ok;'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
  },
  getters: {},
})

// 對外暴露獲取小倉庫方法
export default useUserStore
