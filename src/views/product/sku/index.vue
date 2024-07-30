<template>
  <el-card>
    <el-table border style="margin: 10px 0px" :data="skuArr">
      <el-table-column
        label="序號"
        type="index"
        align="center"
        width="80px"
      ></el-table-column>
      <el-table-column
        label="名稱"
        show-overflow-tooltip
        width="150px"
        prop="skuName"
      ></el-table-column>
      <el-table-column
        label="描述"
        show-overflow-tooltip
        width="150px"
        prop="skuDesc"
      ></el-table-column>
      <el-table-column label="圖片" width="150px">
        <template #="{ row, $index }">
          <img
            :src="row.skuDefaultImg"
            alt=""
            style="width: 100px; height: 100px"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="重量"
        width="150px"
        prop="weight"
      ></el-table-column>
      <el-table-column
        label="價格"
        width="150px"
        prop="price"
      ></el-table-column>
      <el-table-column label="操作" width="250px" fixed="right">
        <template #="{ row, $index }">
          <el-button
            type="primary"
            size="samll"
            :icon="row.isSale == 1 ? 'Bottom' : 'Top'"
            @click="updateSale(row)"
          ></el-button>
          <el-button
            type="primary"
            size="samll"
            icon="Edit"
            @click="updateSku"
          ></el-button>
          <el-button type="primary" size="samll" icon="InfoFilled" @click="findSku(row)"></el-button>
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
    <!-- 抽屜組件: 展示商品詳情 -->
    <el-drawer v-model="drawer">
      <!-- 標題部份 -->
      <template #header>
        <h4>查看商品的詳情</h4>
      </template>
      <template #default>
        <el-row style="margin: 10px 0px;">
          <el-col :span="6">名稱</el-col>
          <el-col :span="18">{{ skuInfo.skuName }}</el-col>
        </el-row>
        <el-row style="margin: 10px 0px;">
          <el-col :span="6">描述</el-col>
          <el-col :span="18">{{ skuInfo.skuDesc }}</el-col>
        </el-row>
        <el-row style="margin: 10px 0px;">
          <el-col :span="6">價格</el-col>
          <el-col :span="18">{{ skuInfo.price }}</el-col>
        </el-row>
        <el-row style="margin: 10px 0px;">
          <el-col :span="6">平台屬性</el-col>
          <el-col :span="18">
            <el-tag style="margin: 5px;" v-for="item in skuInfo.skuAttrValueList" :key="item.id">{{ item.valueName }}</el-tag>
          </el-col>
        </el-row>
        <el-row style="margin: 10px 0px;">
          <el-col :span="6">銷售屬性</el-col>
          <el-col :span="18">
            <el-tag style="margin: 5px;" v-for="item in skuInfo.skuSaleAttrValueList" :key="item.id">{{ item.saleAttrValueName }}</el-tag>
          </el-col>
        </el-row>
        <el-row style="margin: 10px 0px;">
          <el-col :span="6">商品圖片</el-col>
          <el-col :span="18">
            <el-carousel :interval="4000" type="card" height="200px">
              <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
                <img :src="item.imgUrl" alt="" style="width: 100%; height: 100%;">
              </el-carousel-item>
            </el-carousel>
          </el-col>
        </el-row>
      </template>
    </el-drawer>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
// 引入請求
import { reqSkuList, reqSaleSku, reqCancelSale, reqSkuInfo } from '@/api/product/sku'
import type { SkuResponseData, SkuData, SkuInfoData } from '@/api/product/sku/type'
import { ElMessage } from 'element-plus'

// 分頁器當前頁碼
let pageNo = ref<number>(1)
// 每一頁展是幾條數據
let pageSize = ref<number>(10)
let total = ref<number>(0)
let skuArr = ref<SkuData[]>([])
// 控制抽屜顯示與隱藏的字段
let drawer = ref<boolean>(false)
let skuInfo = ref<SkuData>({})

// 組件掛載完畢
onMounted(() => {
  getHasSku()
})

const getHasSku = async (pager = 1) => {
  // 當前分頁器的頁碼
  pageNo.value = pager

  let result: SkuResponseData = await reqSkuList(pageNo.value, pageSize.value)
  if (result.code == 200) {
    total.value = result.data.total
    skuArr.value = result.data.records
  }
}

// 分頁器下拉菜單發生變化觸發
const handler = (pageSizes: number) => {
  getHasSku()
}

// 商品的上架與下架的操作
const updateSale = async (row: SkuData) => {
  // 如果當前商品的isSale==1，說明當前商品是上架的狀態 -> 更新為下架
  // 否則else情況與上面情況相反
  if (row.isSale == 1) {
    // 下架操作
    await reqCancelSale(row.id as number)
    // 提示信息
    ElMessage({ type: 'success', message: '下架成功' })
    // 發請求獲取當前更新完畢的全部已有的SKU
    getHasSku(pageNo.value)
  } else {
    // 上架操作
    await reqSaleSku(row.id as number)
    // 提示信息
    ElMessage({ type: 'success', message: '上架成功' })
    // 發請求獲取當前更新完畢的全部已有的SKU
    getHasSku(pageNo.value)
  }
}

// 更新已有的SKU
const updateSku = () => {
  ElMessage({ type: 'success', message: '程序員在努力的更新中...' })
}

// 查看商品詳情按鈕的回調
const findSku = async (row: SkuData) => {
  // 抽屜展示出來
  drawer.value = true
  // 獲取已有商品詳情數據
  let result: SkuInfoData = await reqSkuInfo(row.id as number)
  if (result.code == 200) {
    // 存儲已有的SKU
    skuInfo.value = result.data
  }
}
</script>

<style scoped>
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
