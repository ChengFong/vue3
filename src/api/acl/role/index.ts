// 角色管理模塊的接口
import request from "@/utils/request";
import type { RoleResponseData, RoleData, MenuResponseData } from "./type";

// 枚舉地址
enum API {
    // 獲取全部的職位接口
    ALLROLE_URL = '/admin/acl/role',
    // 新增崗位的接口地址
    ADDROLE_URL = '/admin/acl/role/save',
    // 更新已有的職位
    UPDATEROLE_URL = '/admin/acl/role/update',
    // 獲取全部的菜單與按鈕的數據
    ALLPERMISSION_URL = '/admin/acl/permission/toAssign',
    // 給相應的職位分配權限
    SETPERMISSION_URL = '/admin/acl/permission/doAssign',
    // 刪除已有的職位
    REMOVEROLE_URL = '/admin/acl/role/remove'
}

// 獲取全部的角色
export const reqAllRoleList = (page: number, limit: number, roleName: string) => 
     request.get<any, RoleResponseData>(API.ALLROLE_URL + `/${page}/${limit}?roleName=${roleName}`)

// 添加職位與更新已有的職位接口
export const reqAddOrUpdateRole = (data: RoleData) => {
    if (data.id) {
        return request.put<any, any>(API.UPDATEROLE_URL, data)
    } else {
        return request.post<any, any>(API.ADDROLE_URL, data)
    }
}

// 獲取全部菜單與按鈕權限數據
export const reqAllMenuList = (roleId: number) => request.get<any, MenuResponseData>(API.ALLPERMISSION_URL + `/${roleId}`)

// 給相應的職位下發權限
export const reqSetPermission = (roleId: number, permissionId: number[]) => request.post<any, any>(API.SETPERMISSION_URL + `roleId=${roleId}&permissionId=${permissionId}`)

// 刪除已有的職位
export const reqRemoveRole = (roleId: number) => request.delete<any, any>(API.REMOVEROLE_URL + `/${roleId}`)