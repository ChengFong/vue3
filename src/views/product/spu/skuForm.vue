<template>
  <el-form label-width="100px">
    <el-form-item label="SKU名稱">
      <el-input placeholder="SKU名稱" v-model="skuParams.skuName"></el-input>
    </el-form-item>
    <el-form-item label="價格(元)">
      <el-input
        placeholder="價格(元)"
        type="number"
        v-model="skuParams.price"
      ></el-input>
    </el-form-item>
    <el-form-item label="價格(克)">
      <el-input
        placeholder="價格(克)"
        type="number"
        v-model="skuParams.weight"
      ></el-input>
    </el-form-item>
    <el-form-item label="SKU描述">
      <el-input
        placeholder="SKU描述"
        type="textarea"
        v-model="skuParams.skuDesc"
      ></el-input>
    </el-form-item>
    <el-form-item label="平台屬性">
      <el-form :inline="true">
        <el-form-item
          v-for="(item, index) in attrArr"
          :key="item.id"
          :label="item.attrName"
        >
          <el-select v-model="item.attrIdAndValueId">
            <el-option
              v-for="(attrValue, index) in item.attrValueList"
              :key="attrValue.id"
              :label="attrValue.valueName"
              :value="`${item.id}:${attrValue.id}`"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="銷售屬性">
      <el-form :inline="true">
        <el-form-item
          v-for="(item, index) in saleArr"
          :key="item.id"
          :label="item.saleAttrName"
        >
          <el-select v-model="item.saleIdAndValueId">
            <el-option
              v-for="(saleAttrValue, index) in item.spuSaleAttrValueList"
              :key="saleAttrValue.id"
              :label="saleAttrValue.saleAttrValueName"
              :value="`${item.id}:${saleAttrValue.id}`"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="圖片名稱">
      <el-table border :data="imgArr" ref="table">
        <el-table-column
          type="selection"
          width="80px"
          align="center"
        ></el-table-column>
        <el-table-column label="圖片">
          <template #="{ row, $index }">
            <img :src="row.imgUrl" alt="" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
        <el-table-column label="名稱" prop="imgName"></el-table-column>
        <el-table-column label="操作">
          <template #="{ row, $index }">
            <el-button type="primary" size="small" @click="handler(row)">
              設置默認
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="default" @click="save">保存</el-button>
      <el-button type="primary" size="default" @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

// 引入請求API
import { reqAttr } from '@/api/product/attr'
import {
  reqSpuImageList,
  reqSpuHasSaleAttr,
  reqAddSku,
} from '@/api/product/spu'

import type {
  SpuData,
  SpuImg,
  SpuHasImg,
  SaleAttr,
  SaleAttrResponseData,
} from '@/api/product/spu/type'
import type { Attr } from '@/api/product/attr/type'
import type { SkuData } from '@/api/product/spu/type'
import { ElMessage } from 'element-plus'

// 平台屬性
let attrArr = ref<Attr[]>([])
// 銷售屬性
let saleArr = ref<SaleAttr[]>([])
// 照片的數據
let imgArr = ref<SpuImg[]>([])
// 收集SKU的參數
let skuParams = reactive<SkuData>({
  category3Id: '',
  supId: '',
  tmId: '',
  skuName: '',
  price: '',
  weight: '',
  skuDesc: '',
  skuAttrValueList: [],
  skuSaleAttrValueList: [],
  skuDefaultImg: '',
})
// 獲取table組件實例
let table = ref<any>()

// 自定義事件的方法
let $emit = defineEmits(['changeScene'])

// 取消按鈕的回調
const cancel = () => {
  $emit('changeScene', { flag: 0, param: '' })
}

// 當前子組件的方法對外暴露
const initSkuData = async (
  c1Id: number | string,
  c2Id: number | string,
  spu: SpuData,
) => {
  // 收集數據
  skuParams.category3Id = spu.category3Id
  skuParams.supId = spu.id as number
  skuParams.tmId = spu.tmId

  // 獲取平台屬性
  let result: any = await reqAttr(c1Id, c2Id, spu.category3Id)
  // 獲取對應的銷售屬性
  let result1: SaleAttrResponseData = await reqSpuHasSaleAttr(spu.id as number)
  // 獲取照片牆的數據
  let result2: SpuHasImg = await reqSpuImageList(spu.id as number)

  attrArr.value = result.data
  saleArr.value = result1.data
  imgArr.value = result2.data
}

// 設置默認圖片的方法回調
const handler = (row: SpuImg) => {
  // 典籍的時候，全部圖片的複選框不勾選
  imgArr.value.forEach((item: SpuImg) => {
    table.value.toggleRowSelection(item, false)
  })
  // 選中的圖片才勾選
  table.value.toggleRowSelection(row, true)

  // 收集圖片地址
  skuParams.skuDefaultImg = row.imgUrl as string
}

// 保存按鈕的方法
const save = async () => {
  // 整理參數
  // 平台屬性
  skuParams.skuAttrValueList = attrArr.value.reduce((prev: any, next: any) => {
    if (next.attrIdAndValueId) {
      let [attrId, valueId] = next.attrIdAndValueId.split(':')
      prev.push({
        attrId,
        valueId,
      })
      return prev
    }
  }, [])
  // 銷售屬性
  skuParams.skuSaleAttrValueList = saleArr.value.reduce(
    (prev: any, next: any) => {
      if (next.saleIdAndValueId) {
        let [saleAttrId, saleAttrValueId] = next.saleIdAndValueId.split(':')
        prev.push({
          saleAttrId,
          saleAttrValueId,
        })
        return prev
      }
    },
    [],
  )

  // 添加SKU的請求
  let result: any = await reqAddSku(skuParams)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '添加SKU成功',
    })

    // 通知父組件切換場景為零
    $emit('changeScene', { flag: 0, params: '' })
  } else {
    ElMessage({
      type: 'error',
      message: '添加SKU失敗',
    })
  }
}

// 對外暴露方法
defineExpose({ initSkuData })
</script>

<style scoped lang="scss"></style>
