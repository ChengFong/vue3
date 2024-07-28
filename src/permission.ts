// 路由鑒權: 鑒權，項目當中路由能不能被訪問權限的設置(某一個路由什麼條件下可以訪問、什麼條件下不可以訪問)
import router from '@/router'
import nprogress from 'nprogress'
// 引入進度條樣式
import 'nprogress/nprogress.css'
import settring from './settring'
nprogress.configure({ showSpinner: false })

// 獲取用戶相關的小倉庫內部token數據，去判斷用戶是否登錄成功
import useUserStore from './store/modules/user'
import pinia from './store'
const userStore = useUserStore(pinia)

// 全局守衛: 項目當中任意路由切換都會觸發的鉤子
// 全局前置守衛
router.beforeEach(async (to: any, from: any, next: any) => {
  document.title = `${settring.title} - ${to.meta.title}`

  // to: 你將要訪問哪個路由
  // from: 你從哪個路由而來
  // next: 路由的放行函數
  nprogress.start()
  // 獲取token，去判斷用戶登錄，還是未登錄
  const token = userStore.token
  // 獲取用戶名字
  const username = userStore.username
  if (token) {
    // 用戶登錄判斷
    if (to.path == '/login') {
      // 登錄成功，訪問login，不能訪問，指向首頁
      next({ path: '/' })
    } else {
      // 登錄成功訪問其餘六個路由(登錄排除)
      // 有用戶信息
      if (username) {
        // 放行
        next()
      } else {
        // 如果沒有用戶信息，在守衛這裡發請求獲取到了用戶信息再放行
        try {
          await userStore.userInfo()
          next()
        } catch (error) {
          // token過期: 獲取不到用戶信息
          // 用戶手動修改本地存儲token
          // 退出登錄->用戶相關的數據清空
          await userStore.userLogout()
          next({ path: '/login', query: { redirect: to.path } })
        }
      }
    }
  } else {
    // 用戶未登錄判斷
    if (to.path == '/login') {
      next()
    } else {
      next({ path: '/login', query: { redirect: to.path } })
    }
  }
})

// 全局後置守衛
router.afterEach((to: any, from: any) => {
  nprogress.done()
})

// 第一個問題: 任意路由切換實現進度條業務 ---nprogress
// 第二個問題: 路由鑒權(路由組件訪問權限的設置)
// 全部路由組件: 登錄|404|任意路由|首頁|數據大屏|權限管理(三個子路由)|商品管理(四個子路由)

// 用戶未登錄: 可以訪問login，其餘六個路由不能訪問(指向login)
// 用戶登錄成功: 不可以訪問login[指向首頁]，其餘的路由可以訪問
