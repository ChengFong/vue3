export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// 已有品牌的ts數據類型
export interface TradeMark {
  id?: number
  tmName: string
  logoUrl: string
}

// 包含全部品牌數據的ts類型
export type Records = TradeMark[]

// 獲取的已有全部品牌的數據ts類型
export interface TradeMarkResponseData extends ResponseData {
  data: {
    records: Records
    total: number
    size: number
    current: number
    searchCount: boolean
    pages: number
  }
}
