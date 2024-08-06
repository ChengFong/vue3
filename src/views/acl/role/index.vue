<template>
  <el-card>
    <el-form :inline="true" class="form">
      <el-form-item label="職位搜索">
        <el-input placeholder="請你輸入搜索職位關鍵字"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="default">搜索</el-button>
        <el-button type="primary" size="default">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin: 10px 0px;">
    <el-button type="primary" size="default" icon="Plus">添加職位</el-button>
    <el-table border style="margin: 10px 0px;">
      <el-table-column type="index" align="center" label="#"></el-table-column>
      <el-table-column label="ID" align="center"></el-table-column>
      <el-table-column label="職位名稱" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="創建時間" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="更新時間" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" width="260px" align="center"></el-table-column>
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

// 默認頁碼
let pageNo = ref<number>(1)
// 一頁展示幾條數據
let pageSize = ref<number>(10)
</script>

<style scoped lang="scss">
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
}
</style>
