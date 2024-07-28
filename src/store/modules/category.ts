// 商品分類全局組件的小倉庫
import { defineStore } from 'pinia'
// 引入分類接口方法
import { reqC1, reqC2, reqC3 } from '@/api/product/attr'
import type { CategoryResponseData } from '@/api/product/attr/type'
import type { CategoryState } from './types/type'

const useCategoryStore = defineStore('Category', {
  state: (): CategoryState => {
    return {
      // 存儲一級分類的數據
      c1Arr: [],
      // 存儲一級分類的ID
      c1Id: '',
      // 存儲對應一級分類下二級分類的數據
      c2Arr: [],
      // 收集二級分類的ID
      c2Id: '',
      // 存儲三級分類的數據
      c3Arr: [],
      // 存儲三級分類的ID
      c3Id: '',
    }
  },
  actions: {
    // 獲取一級分類的方法
    async getC1() {
      const result: CategoryResponseData = await reqC1()
      if (result.code == 200) {
        this.c1Arr = result.data
      }
    },
    // 獲取二級分類的數據
    async getC2() {
      // 獲取對應一級分類下的二級分類的數據
      const result: CategoryResponseData = await reqC2(this.c1Id)
      if (result.code == 200) {
        this.c2Arr = result.data
      }
    },
    // 獲取三級分類的數據
    async getC3() {
      const result = await reqC3(this.c2Id)
      if (result.code == 200) {
        this.c3Arr = result.data
      }
    },
  },
  getters: {},
})

export default useCategoryStore
