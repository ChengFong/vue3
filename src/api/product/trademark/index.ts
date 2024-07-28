// 書寫品牌管理模塊接口
import request from '@/utils/request'
import { TradeMarkResponseData, TradeMark } from './type'

// 品牌管理模塊接口地址
enum API {
  // 獲取已有品牌接口
  TRADEMARK_URL = '/admin/product/baseTrademark/',
  // 添加品牌
  ADDTRADEMARK_URL = '/admin/product/baseTrademark/save',
  // 修改已有品牌
  UPDATETRADEMARK_URL = '/admin/product/baseTrademark/update',
  // 刪除已有品牌
  DELETE_URL = '/admin/product/baseTrademark/remove',
}

// 獲取已有品牌接口方法
// page: 獲取第幾頁 ---默認第一頁
// limit: 獲取幾個已有品牌的數據
export const reqHasTrademark = (page: number, limit: number) =>
  request.get<any, TradeMarkResponseData>(
    API.TRADEMARK_URL + `${page}/${limit}`,
  )

// 添加與修改已有品牌接口方法
export const reqAddOrUpdateTrademark = (data: TradeMark) => {
  if (data.id) {
    // 修改已有品牌的數據
    return request.put<any, any>(API.UPDATETRADEMARK_URL, data)
  } else {
    // 新增品牌
    return request.post<any, any>(API.ADDTRADEMARK_URL, data)
  }
}

// 刪除某一個已有品牌的數據
export const reqDeleteTrademark = (id: number) => {
  request.delete<any, any>(API.DELETE_URL + `${id}`)
}
