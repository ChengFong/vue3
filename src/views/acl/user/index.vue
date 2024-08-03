<template>
  <el-card style="height: 80px">
    <el-form :inline="true" class="form">
      <el-form-item label="用戶名:">
        <el-input placeholder="請你輸入搜索用戶名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="default">搜索</el-button>
        <el-button type="primary" size="default">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin: 10px 0px">
    <el-button type="primary" size="default">添加用戶</el-button>
    <el-button type="primary" size="default">批量刪除</el-button>
    <!-- table展示用戶信息 -->
    <el-table style="margin: 10px 0px" border>
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column label="#" align="center"></el-table-column>
      <el-table-column label="ID" align="center"></el-table-column>
      <el-table-column label="用戶名字" align="center"></el-table-column>
      <el-table-column label="用戶名稱" align="center"></el-table-column>
      <el-table-column label="用戶角色" align="center"></el-table-column>
      <el-table-column label="創建時間" align="center"></el-table-column>
      <el-table-column label="更新時間" align="center"></el-table-column>
      <el-table-column
        label="操作"
        width="260px"
        align="center"
      ></el-table-column>
    </el-table>
    <!-- 分頁器 -->
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="pageSize"
      :page-sizes="[5, 7, 9, 11]"
      layout="prev, pager, next, jumper,->,sizes,total"
      :background="true"
      :total="400"
    ></el-pagination>
  </el-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
// 默認頁碼
let pageNo = ref<number>(1)
// 一頁展示幾條數據
let pageSize = ref<number>(5)
</script>

<style scoped lang="scss">
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
