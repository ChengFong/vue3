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