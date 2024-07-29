// SPU管理模塊的接口
import request from '@/utils/request'
import {
  HasSpuResponseData,
  AllTradeMark,
  SpuHasImg,
  SaleAttrResponseData,
  HasSaleAttrResponseData,
  SpuData,
  SkuData,
  SkuInfoData,
} from './type.ts'

enum API {
  // 獲取已有的SPU數據
  HASSPU_URL = '/admin/product',
  // 獲取全部品牌的數據
  ALLTRADEMARK_URL = '/admin/product/baseTrademark/getTrademarkList',
  // 獲取某個SPU下的全部的售賣商品的圖片數據
  IMAGE_URL = '/admin/product/spuImageList',
  // 獲取某一個SPU下全部的已有的銷售屬性接口地址
  SPUHASSALEATTR_URL = '/admin/product/spuSaleAttrList',
  // 獲取整個項目全部的銷售屬性[顏色、版本、尺碼]
  ALLSALEATTR_URL = '/admin/product/baseSaleAttrList',
  // 追加一個新的SPU
  ADDSPU_URL = '/admin/product/saveSpuInfo',
  // 更新已有的SPU
  UPDATESPU_URL = '/admin/product/updateSpuInfo',
  // 追加一個新增的SKU地址
  ADDSKU_URL = '/admin/product/saveSkuInfo',
  // 查看某一個已有的SPU下全部售賣的商品
  SKUINFO_URL = '/admin/product/findBySpuId',
  // 刪除已有的SPU
  REMOVESPU_URL = '/admin/product/deleteSpu',
}

// 獲取某一個三級分類下已有的SPU數據
export const reqHasSpu = (
  page: number,
  limit: number,
  category3Id: string | number,
) =>
  request.get<any, HasSpuResponseData>(
    API.HASSPU_URL + `/${page}/${limit}?category3Id=${category3Id}`,
  )

// 獲取全部的SPU品牌的數據
export const reqAllTradeMakr = () =>
  request.get<any, AllTradeMark>(API.ALLTRADEMARK_URL)

// 獲取某一個已有的SPU下全部商品的圖片地址
export const reqSpuImageList = (spuId: number) =>
  request.get<any, SpuHasImg>(API.IMAGE_URL + '/' + spuId)

// 獲取某一個已有的SPU擁有多少個銷售屬性
export const reqSpuHasSaleAttr = (spuId: number) =>
  request.get<any, SaleAttrResponseData>(API.SPUHASSALEATTR_URL + '/' + spuId)

// 獲取全部的銷售屬性
export const reqAllSaleAttr = () =>
  request.get<any, HasSaleAttrResponseData>(API.ALLSALEATTR_URL)

// 添加一個新的SPU
// 更新已有的SPU接口
export const reqAddorUpdateSpu = (data: SpuData) => {
  console.log(data)
  // 如果SPU對象擁有ID，更新有的SPU
  if (data.id) {
    return request.post<any, any>(API.UPDATESPU_URL)
  } else {
    return request.post<any, any>(API.ADDSPU_URL)
  }
}

// 添加SKU的請求方法
export const reqAddSku = (data: SkuData) =>
  request.post<any, any>(API.ADDSKU_URL, data)

// 獲取SKU數據
export const reqSkuList = (spuId: number | string) =>
  request.get<any, SkuInfoData>(API.SKUINFO_URL + '/' + spuId)

// 刪除已有的SPU
export const reqRemoveSpu = (spuId: number | string) =>
  request.delete<any, any>(API.REMOVESPU_URL + '/' + spuId)
