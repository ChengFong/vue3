export interface ResponseData {
    code: number,
    message: string,
    ok: boolean
}

// 定義SKU對象的ts類型
export interface Attr {
    id?: number
    attrId: number | string
    valueId: number | string
    valueName?: string
  }
  export interface saleAttr {
    id?: number
    saleAttrId: number | string
    saleAttrValueId: number | string
    saleAttrValueName?: string
  }
  export interface Image {
    id?: number
    imgUrl?: string
  }  
  export interface SkuData {
    category3Id?: string | number
    supId?: string | number
    tmId?: string | number
    skuName?: string
    price?: string | number
    weight?: string | number
    skuDesc?: string
    skuAttrValueList?: Attr[]
    skuSaleAttrValueList?: saleAttr[]
    skuDefaultImg?: string
    isSale?: number
    id?: number
    skuImageList?: Image[]
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

  // 獲取SKU商品詳情接口的ts類型
  export interface SkuInfoData extends ResponseData {
    data: SkuData
  }