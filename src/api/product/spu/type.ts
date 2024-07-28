// 服務器全部接口返回的數據類型
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// SPU數據的ts類型
export interface SpuData {
  category3Id: string | number
  id?: number
  spuName: string
  tmId: number | string
  description: string
  spuImageList: null | SpuImg[]
  spuSaleAttrList: null | SaleAttr[]
}
// 數組: 元素都是已有SPU數據類型
export type Records = SpuData[]
// 定義獲取已有的SPU接口返回的數據ts類型
export interface HasSpuResponseData extends ResponseData {
  data: {
    records: Records
    total: number
    size: number
    current: number
    searchCount: boolean
    pages: number
  }
}

// 品牌數據的TS類型
export interface Trademark {
  id: number
  tmName: string
  logoUrl: string
}
// 品牌接口返回的數據ts類型
export interface AllTradeMark extends ResponseData {
  data: Trademark[]
}

// 商品圖片的ts類型
export interface SpuImg {
  id?: number
  imgName?: string
  imgUrl?: string
  createTime?: string
  updateTime?: string
  spuId?: number
  name?: string
  url?: string
}
// 已有的SPU照片牆數據的類型
export interface SpuHasImg extends ResponseData {
  data: SpuImg[]
}

// 已有的銷售屬性值對象ts類型
export interface SaleAttrValue {
  id?: number
  createTime?: null
  updateTime?: null
  spuId?: number
  baseSaleAttrId: number | string
  saleAttrValueName: string
  saleAttrName?: string
  isChecked?: null
}
// 存儲已有的銷售屬性值數組類型
export type SpuSaleAttrValueList = SaleAttrValue[]
// 銷售屬性對象ts類型
export interface SaleAttr {
  id?: number
  createTime?: null
  updateTime?: null
  supId?: number
  baseSaleAttrId: number | string
  saleAttrName: string
  spuSaleAttrValueList: SpuSaleAttrValueList
  flag?: boolean
  saleAttrValue?: string
}
// SPU已有的銷售屬性接口返回數據ts類型
export interface SaleAttrResponseData extends ResponseData {
  data: SaleAttr[]
}

// 已有的全部SPU返回數據ts類型
export interface HasSaleAttr {
  id: number
  name: string
}
export interface HasSaleAttrResponseData extends ResponseData {
  data: HasSaleAttr[]
}

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

// 獲取SKU數據接口的ts類型
export interface SkuInfoData extends ResponseData {
  data: SkuData[]
}
