<template>
  <div>
    <!-- 三級分類 -->
    <Category :scene="scene"></Category>
    <el-card style="margin: 10px 0px">
      <div v-show="scene == 0">
        <el-button
          type="primary"
          size="default"
          icon="Plus"
          :disabled="categoryStore.c3Id ? false : true"
          @click="addSpu"
        >
          添加SPU
        </el-button>
        <el-table style="margin: 10px 0px" border :data="records">
          <el-table-column
            label="序號"
            type="index"
            align="center"
            width="80px"
          ></el-table-column>
          <el-table-column label="SPU名稱" prop="spuName"></el-table-column>
          <el-table-column
            label="SPU描述"
            prop="description"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column label="SPU操作">
            <!-- row: 即為已有的SPU對象 -->
            <template #="{ row, $index }">
              <el-button
                type="primary"
                size="small"
                icon="Plus"
                title="添加SKU"
                @click="addSku(row)"
              ></el-button>
              <el-button
                type="primary"
                size="small"
                icon="Edit"
                title="修改SPU"
                @click="updateSpu(row)"
              ></el-button>
              <el-button
                type="primary"
                size="small"
                icon="View"
                title="查看SKU列表"
                @click="findSku(row)"
              ></el-button>
              <el-button
                type="primary"
                size="small"
                icon="Delete"
                title="刪除SPU"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分頁器 -->
        <el-pagination
          v-model:current-page="pageNo"
          v-model:page-size="pageSize"
          :page-sizes="[3, 5, 7, 9]"
          layout="prev, pager, next, jumper,->,sizes,total"
          :background="true"
          :total="total"
          @current-change="getHasSpu"
          @size-change="changeSize"
        ></el-pagination>
      </div>
      <!-- 添加SPU|修改SPU子組件 -->
      <SpuForm
        ref="spu"
        v-show="scene == 1"
        @changeScene="changeScene"
      ></SpuForm>
      <!-- 添加SKU的子組件 -->
      <SkuForm
        ref="sku"
        v-show="scene == 2"
        @changeScene="changeScene"
      ></SkuForm>
      <!-- dialog對話框: 展示已有的SKU數據 -->
      <el-dialog title="SKU列表" v-model="show">
        <el-table border="" :data="skuArr">
          <el-table-column prop="skuName" label="SKU名字"></el-table-column>
          <el-table-column prop="price" label="SKU價格"></el-table-column>
          <el-table-column prop="weight" label="SKU重量"></el-table-column>
          <el-table-column label="SKU圖片">
            <template #="{ row, $index }">
              <img
                :src="row.skuDefaultImg"
                style="width: 100px; height: 100px"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { reqHasSpu, reqSkuList } from '@/api/product/spu'
import {
  HasSpuResponseData,
  Records,
  SkuInfoData,
} from '@/api/product/spu/type'

// 引入分類的倉庫
import SpuForm from './spuForm.vue'
import SkuForm from './skuForm.vue'

// 引入分類的倉庫
import useCategoryStore from '@/store/modules/category'
let categoryStore = useCategoryStore()

import type { SkuData, SpuData } from '@/api/product/spu/type'

// 場景的數據
let scene = ref<number>(0) //0:顯示已有SPU, 1:添加或修改已有SPU, 2:添加SKU的結構
// 分頁器默認頁碼
let pageNo = ref<number>(1)
// 每一頁展示幾條數據
let pageSize = ref<number>(3)

// 存儲已有的SPU的數據
let records = ref<Records>([])
// 存儲已有SPU總個數
let total = ref<number>(0)

// 獲取子組件實例SpuForm
let spu = ref<any>()
// 獲取子組件時間SkuForm
let sku = ref<any>()

// 存儲全部的SKU數據
let skuArr = ref<SkuData[]>([])
let show = ref<boolean>(false)

// 監聽三級分類ID變化
watch(
  () => categoryStore.c3Id,
  () => {
    // 務必保證有三級分類ID
    if (!categoryStore.c3Id) return
    getHasSpu()
  },
)

// 此方法執行: 可以獲取某一個三級分類下全部的已有的SPU
const getHasSpu = async (pager = 1) => {
  // 修改當前頁碼
  pageNo.value = pager

  let result: HasSpuResponseData = await reqHasSpu(
    pageNo.value,
    pageSize.value,
    categoryStore.c3Id,
  )
  if (result.code == 200) {
    records.value = result.data.records
    total.value = result.data.total
  }
}
// 分頁器下拉菜單發生變化的時候觸發
const changeSize = () => {
  getHasSpu()
}

// 添加新的SPU按鈕的回調
const addSpu = () => {
  // 切換為場景1: 添加與修改已有SPU結構->SpuForm
  scene.value = 1
  // 點擊添加SPU按鈕，調用子組件的方法初始化數據
  spu.value.initAddSpu(categoryStore.c3Id)
}

// 子組件SpuForm綁定自定義事件: 目前是讓子組件通知父組件切換場景為0
const changeScene = (obj: any) => {
  // 子組件Spuform點擊取消變為場景0: 展示已有的SPU
  scene.value = obj.flag

  if (obj.params == 'update') {
    // 更新留在當前頁面
    getHasSpu(pageNo.value)
  } else {
    // 添加留在第一頁
    getHasSpu()
  }
}

// 修改已有的SPU按鈕的回調
const updateSpu = (row: SpuData) => {
  // 切換為場景1: 添加與修改已有SPU結構->SpuForm
  scene.value = 1
  // 調用子組件實例方法獲取完整已有的SPU數據
  spu.value.initHasSpuData(row)
}

// 添加SKU按鈕的回調
const addSku = (row: SpuData) => {
  // 點擊添加SKU按鈕切換場景為2
  scene.value = 2
  // 調用子組件的方法初始化添加SKU的數據
  sku.value.initSkuData(categoryStore.c1Id, categoryStore.c2Id, row)
}

// 查看SKU列表的數據
const findSku = async (row: SpuData) => {
  let result: SkuInfoData = await reqSkuList(row.id as number)
  if (result.code == 200) {
    skuArr.value = result.data
    console.log(skuArr.value)
    // 對話框顯示出來
    show.value = true
  }
}
</script>

<style scoped lang="scss"></style>
