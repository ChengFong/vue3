export interface ResponseData {
    code: number,
    message: string,
    ok: boolean
}

// 定義SKU對象的ts類型
export interface Attr {
    attrId: number | string
    valueId: number | string
  }
  export interface saleAttr {
    saleAttrId: number | string
    saleAttrValueId: number | string
  }
  export interface SkuData {
    category3Id: string | number
    supId: string | number
    tmId: string | number
    skuName: string
    price: string | number
    weight: string | number
    skuDesc: string
    skuAttrValueList?: Attr[]
    skuSaleAttrValueList?: saleAttr[]
    skuDefaultImg: string
  }

  // 獲取SKU接口返回的數據ts類型
  export interface SkuResponseData extends ResponseData {
    data: {
        records: SkuData[],
        total: number,
        size: number,
        current: number,
        orders: [],
        optimizeCountSql: boolean,
        hitCount: boolean,
        countId: null,
        maLimit: null,
        searchCount: boolean,
        pages: number
    }
  }