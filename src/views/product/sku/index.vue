<template>
  <el-card>
    <el-table border style="margin: 10px 0px;">
      <el-table-column label="序號" type="index" align="center" width="80px"></el-table-column>
      <el-table-column label="名稱" show-overflow-tooltip width="150px"></el-table-column>
      <el-table-column label="描述" show-overflow-tooltip width="150px"></el-table-column>
      <el-table-column label="圖片" width="150px"></el-table-column>
      <el-table-column label="重量" width="150px"></el-table-column>
      <el-table-column label="價格" width="150px"></el-table-column>
      <el-table-column label="操作" width="250px" fixed="right"></el-table-column>
    </el-table>
    <!-- 分頁器 -->
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 30, 40]"
      layout="prev, pager, next, jumper,->,sizes,total"
      :background="true"
      :total="400"
    ></el-pagination>
  </el-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// 分頁器當前頁碼
let pageNo = ref<number>(1)
// 每一頁展是幾條數據
let pageSize = ref<number>(10)
</script>

<style scoped lang="scss"></style>
