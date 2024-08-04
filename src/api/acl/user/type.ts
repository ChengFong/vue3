// 帳號信息的ts類型
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// 代表一個帳號信息的ts類型
export interface User {
  id?: number
  createTime?: string
  updateTime?: string
  username?: string
  password?: string
  name?: string
  phone?: string
  roleName?: string
}
// 數組包含全部的用戶信息
export type Records = User[]
// 獲取全部用戶信息接口返回的數據ts類型
export interface UserResponseData extends ResponseData {
  data: {
    records: Records
    total: number
    size: number
    current: number
    orders: []
    optimizeCountSql: boolean
    hitCount: boolean
    countId: null
    maLimit: null
    searchCount: boolean
    pages: number
  }
}

// 代表一個職位的ts類型
export interface RoleData {
  id?: number
  createTime?: string
  updateTime?: string
  roleName: string
  remark: string
}
// 全部職位的列表
export type AllRole = RoleData[]
// 獲取全部職位的接口返回的數據ts類型
export interface AllRoleResponseData extends ResponseData {
  data: {
    assignRoles: AllRole
    allRolesList: AllRole
  }
}
