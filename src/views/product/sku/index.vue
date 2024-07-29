<template>
  <el-card>
    <el-table border style="margin: 10px 0px;" :data="skuArr">
      <el-table-column label="序號" type="index" align="center" width="80px"></el-table-column>
      <el-table-column label="名稱" show-overflow-tooltip width="150px" prop="skuName"></el-table-column>
      <el-table-column label="描述" show-overflow-tooltip width="150px" prop="skuDesc"></el-table-column>
      <el-table-column label="圖片" width="150px">
        <template #="{row, $index}">
          <img :src="row.skuDefaultImg" alt="" style="width: 100px;height: 100px;">
        </template>
      </el-table-column>
      <el-table-column label="重量" width="150px" prop="weight"></el-table-column>
      <el-table-column label="價格" width="150px" prop="price"></el-table-column>
      <el-table-column label="操作" width="250px" fixed="right">
        <template #="{row, $index}">
          <el-button type="primary" size="samll" icon="Top"></el-button>
          <el-button type="primary" size="samll" icon="Edit"></el-button>
          <el-button type="primary" size="samll" icon="InfoFilled"></el-button>
          <el-button type="primary" size="samll" icon="Delete"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分頁器 -->
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 30, 40]"
      layout="prev, pager, next, jumper,->,sizes,total"
      :background="true"
      :total="total"
      @current-change="getHasSku"
      @size-change="handler"
    ></el-pagination>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
// 引入請求
import { reqSkuList } from '@/api/product/sku';
import type { SkuResponseData, SkuData } from '@/api/product/sku/type';

// 分頁器當前頁碼
let pageNo = ref<number>(1)
// 每一頁展是幾條數據
let pageSize = ref<number>(10)
let total = ref<number>(0)
let skuArr = ref<SkuData[]>([])

// 組件掛載完畢
onMounted(() => {
  getHasSku()
})

const getHasSku = async (pager=1) => {

  // 當前分頁器的頁碼
  pageNo.value = pager

  let result: SkuResponseData = await reqSkuList(pageNo.value, pageSize.value);
  if (result.code == 200) {
    total.value = result.data.total;
    skuArr.value = result.data.records
  }
}

// 分頁器下拉菜單發生變化觸發
const handler = (pageSizes: number) => {
  getHasSku()
}
</script>

<style scoped lang="scss"></style>
