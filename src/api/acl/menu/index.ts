import request from "@/utils/request";
import type { PermissionResponseData } from "./type";

// 枚舉地址
enum API {
    // 獲取全部菜單與按鈕的標識數據
    ALLPERMISSION_URL = '/admin/acl/permission'
}

// 獲取菜單數據
export const reqAllPermission = () => request.get<any, PermissionResponseData>(API.ALLPERMISSION_URL)