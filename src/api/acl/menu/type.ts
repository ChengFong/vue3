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

// 添加與修改菜單攜帶的參數ts類型
export interface MenuParams {
    id?: number, //ID
    code: string, // 權限數值
    level: number, // 幾級菜單
    name: string, // 菜單的名字
    pid: number // 菜單的ID
}