// SKU模塊接口管理
import request from "@/utils/request";
import type { SkuResponseData, SkuInfoData } from "./type";

// 枚舉地址
enum API {
    // 獲取已有的商品的數據-SKU
    SKU_URL = '/admin/product/list',
    // 上架
    SALE_URL = '/admin/product/onSale',
    // 下架
    CANCELSALE_URL = '/admin/product/cancelSale',
    // 獲取商品詳情的接口
    SKUINFO_URL = '/admin/product/getSkuInfo',
    // 刪除已有的商品
    DELETESKU_URL = '/admin/product/deleteSku'
}

// 獲取商品SKU的接口
export const reqSkuList = (page: number, limit:number) => 
    request.get<any, SkuResponseData>(API.SKU_URL + `/${page}/${limit}`)

// 已有商品上架的請求
export const reqSaleSku = (skuId: number) => 
    request.get<any, any>(API.SALE_URL + `/${skuId}`)

// 下架的請求
export const reqCancelSale = (skuId: number) => 
    request.get<any, any>(API.CANCELSALE_URL + `/${skuId}`)

// 獲取商品詳情的接口
export const reqSkuInfo = (skuId: number) => 
    request.get<any, SkuInfoData>(API.SKUINFO_URL + `/${skuId}`)

// 刪除某一個已有的商品
export const reqRemoveSku = (skuId: number) => 
    request.delete<any, any>(API.DELETESKU_URL + `/${skuId}`)