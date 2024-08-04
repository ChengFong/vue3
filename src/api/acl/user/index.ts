// 用戶管理模塊的接口
import request from '@/utils/request'
import type { UserResponseData, User, AllRoleResponseData } from './type'

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
}

// 獲取用戶帳號信息的接口
export const reqUserInfo = (page: number, limit: number) =>
  request.get<any, UserResponseData>(API.ALLUSER_URL + `/${page}/${limit}`)

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
