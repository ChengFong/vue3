<template>
  <el-table :data="permissionArr" style="width: 100%; margin-bottom: 20px;" row-key="id" border default-expand-all>
    <el-table-column label="名稱" prop="name"></el-table-column>
    <el-table-column label="權限值" prop="code"></el-table-column>
    <el-table-column label="修改時間" prop="updateTime"></el-table-column>
    <el-table-column label="操作">
      <!-- row: 即為已有的菜單對象|按鈕的對象的數據 -->
       <template #="{ row, $index }">
          <el-button type="primary" size="small" :disabled="row.level==4?true:false">{{ row.level==3?'添加功能':'添加菜單' }}</el-button>
          <el-button type="primary" size="small" :disabled="row.level==1?true:false">編輯</el-button>
          <el-button type="primary" size="small" :disabled="row.level==1?true:false">刪除</el-button>
       </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
// 引入獲取菜單請求API
import { reqAllPermission } from '@/api/acl/menu';
// 引入ts類型
import type { PermissionResponseData, PermissionList } from '@/api/acl/menu/type';

// 存儲菜單的數據
let permissionArr = ref<PermissionList>([])

// 組件掛載完畢
onMounted(() => {
  getHasPermission()
})

// 獲取菜單數據的方法
const getHasPermission = async () => {
  let result: PermissionResponseData = await reqAllPermission()
  if (result.code) {
    permissionArr.value = result.data
  }
}
</script>

<style scoped lang="scss"></style>
