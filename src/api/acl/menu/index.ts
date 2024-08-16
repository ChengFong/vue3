import request from "@/utils/request";
import type { PermissionResponseData, MenuParams } from "./type";

// 枚舉地址
enum API {
    // 獲取全部菜單與按鈕的標識數據
    ALLPERMISSION_URL = '/admin/acl/permission',
    // 給某一級菜單新增一個子菜單
    ADDMENU_URL = '/admin/acl/permission/save',
    // 更新某一個已有的菜單
    UPDATE_URL = '/admin/acl/permission/update',
    // 刪除已有的菜單
    DELETEMENU_URL = '/admin/acl/permission/remove'
}

// 獲取菜單數據
export const reqAllPermission = () => request.get<any, PermissionResponseData>(API.ALLPERMISSION_URL)
// 添加與更新菜單的方法
export const reqAddOrUpdateMenu = (data: MenuParams) => {
    if (data.id) {
        return request.put<any, any>(API.UPDATE_URL, data)
    } else {
        return request.post<any, any>(API.ADDMENU_URL, data)
    }
}
// 刪除某一個已有的菜單
export const reqRemoveMenu = (id: number) => request.delete<any, any>(API.DELETEMENU_URL + '/' + id)