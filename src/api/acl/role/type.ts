export interface ResponseData {
    code: number
    message: string
    ok: boolean
}

// 職位數據類型
export interface RoleData {
    id?: number
    createTime?: string
    updateTime?: string
    roleName: string
    remark?: string
}
// 全部職位的數組的ts類型
export type Records = RoleData[]
// 全部職位數據的相應的ts類型
export interface RoleResponseData extends ResponseData {
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

// 菜單與按鈕數據的ts類型
export interface MenuData {
    id: number
    createTime: string
    updateTime: string
    pid: number
    name: string
    code: string
    toCode: string
    type: number
    status: null
    level: number
    children?: MenuList
    select: boolean
}
export type MenuList = MenuData[]

// 菜單權限與按鈕權限數據的ts類型
export interface MenuResponseData extends ResponseData {
    data: MenuList
}