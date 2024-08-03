// 用戶管理模塊的接口
import request from '@/utils/request'
import type { UserResponseData } from './type'

// 枚舉地址
enum API {
  // 獲取全部已有用戶帳號信息
  ALLUSER_URL = '/admin/acl/user',
}

// 獲取用戶帳號信息的接口
export const reqUserInfo = (page: number, limit: number) =>
  request.get<any, UserResponseData>(API.ALLUSER_URL + `/${page}/${limit}`)
