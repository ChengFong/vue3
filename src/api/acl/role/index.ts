// 角色管理模塊的接口
import request from "@/utils/request";
import type { RoleResponseData } from "./type";

// 枚舉地址
enum API {
    // 獲取全部的職位接口
    ALLROLE_URL = '/admin/acl/role'
}

// 獲取全部的角色
export const reqAllRoleList = (page: number, limit: number, roleName: string) => 
     request.get<any, RoleResponseData>(API.ALLROLE_URL + `/${page}/${limit}?roleName=${roleName}`)