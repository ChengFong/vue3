// 數據類型定義
export interface ResponseData {
    code: number,
    message: string,
    ok: boolean
}

// 菜單數據與按鈕數據的ts類型
export interface Permission {
    id?: number,
    createTime: string,
    updateTime: string,
    pid: number,
    name: string,
    code: string,
    toCode: string,
    type: number,
    status: string,
    level: number,
    children?: PermissionList,
    select: boolean
}
export type PermissionList = Permission[]
// 菜單接口返回的數據類型
export interface PermissionResponseData extends ResponseData {
    data: PermissionList
}