<template>
  <el-card>
    <el-table border>
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
      ></el-table-column>
      <el-table-column
        label="描述"
        show-overflow-tooltip
        width="150px"
      ></el-table-column>
      <el-table-column label="圖片" width="150px"></el-table-column>
      <el-table-column label="重量" width="150px"></el-table-column>
      <el-table-column label="價格" width="150px"></el-table-column>
      <el-table-column
        label="操作"
        width="250px"
        fixed="right"
      ></el-table-column>
    </el-table>
  </el-card>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss"></style>
