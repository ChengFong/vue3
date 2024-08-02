<template>
  <el-card style="height: 80px;">
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
  <el-card style="margin: 10px 0px;">
    123
  </el-card>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
