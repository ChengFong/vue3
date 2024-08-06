// 用戶管理模塊的接口
import request from '@/utils/request'
import type { UserResponseData, User, AllRoleResponseData, SetRoleData } from './type'

// 枚舉地址
enum API {
  // 獲取全部已有用戶帳號信息
  ALLUSER_URL = '/admin/acl/user',
  // 添加一個新的用戶帳號
  ADDUSER_URL = '/admin/acl/user/save',
  // 更新已有的用戶帳號
  UPDATEUSER_URL = '/admin/acl/user/update',
  // 獲取全部職位，當前帳號擁有的職位接口
  ALLROLE_URL = '/admin/acl/user/toAssign',
  // 給已有的用戶分配角色接口
  SETROLE_URL = '/amdin/acl/user/doAssignRole',
  // 刪除某一個帳號
  DELETEUSER_URL = '/admin/acl/user/remove',
  // 批量刪除的接口
  DELETEALLUSER_URL = '/admin/acl/user/batchRemove'
}

// 獲取用戶帳號信息的接口
export const reqUserInfo = (page: number, limit: number, username: string) =>
  request.get<any, UserResponseData>(API.ALLUSER_URL + `/${page}/${limit}?username=${username}`)

// 添加用戶與更新已有用戶的接口
export const reqAddOrUpdateUser = (data: User) => {
  // 攜帶參數有ID更新
  if (data.id) {
    return request.put<any, any>(API.UPDATEUSER_URL, data)
  } else {
    return request.post<any, any>(API.ADDUSER_URL, data)
  }
}

// 獲取全部職位以及包含當前用戶的已有的職位
export const reqAllRole = (userId: number) =>
  request.get<any, AllRoleResponseData>(API.ALLROLE_URL + `/${userId}`)

// 分配職位
export const reqSetUserRole = (data: SetRoleData) => request.post<any, any>(API.SETROLE_URL, data)

// 刪除某一個帳號的信息
export const reqRemoveUser = (userId: number) => request.delete<any,any> (API.DELETEUSER_URL + `/${userId}`)

// 批量刪除的接口
export const reqDeleteUser = (idList: number[]) => request.delete(API.DELETEALLUSER_URL, {data:idList})