// SKU模塊接口管理
import request from "@/utils/request";
import type { SkuResponseData } from "./type";

// 枚舉地址
enum API {
    // 獲取已有的商品的數據-SKU
    SKU_URL = '/admin/product/list'
}

// 獲取商品SKU的接口
export const reqSkuList = (page: number, limit:number) => 
    request.get<any, SkuResponseData>(API.SKU_URL + `/${page}/${limit}`)