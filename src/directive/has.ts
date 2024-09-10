import pinia from "@/store"
// 按鈕權限的實現
import useUserStore from '@/store/modules/user'
// 獲取用戶相關的倉庫
let userStore = useUserStore(pinia)

export const isHasButton = (app: any ) => {
    // 獲取對應的用戶倉庫
    // 全局自定義指令: 實現按鈕的權限
    app.directive('has', {
        // 代表使用這個全局自定義指令DOM|組件掛載完畢的時候會執行一次
        mounted(el: any, options: any) {
            // 自定義指令右側的數值: 如果在用戶信息buttons數組中沒有
            // 從DOM樹上幹掉
            if (!userStore.buttons.includes(options.value)) {
                el.parentNode.removeChild(el)
            }
        }
    })
}