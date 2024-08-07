<template>
  <el-card>
    <el-form :inline="true" class="form">
      <el-form-item label="職位搜索">
        <el-input placeholder="請你輸入搜索職位關鍵字" v-model="keyword"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="default" :disabled="keyword?false:true" @click="search">搜索</el-button>
        <el-button type="primary" size="default" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin: 10px 0px;">
    <el-button type="primary" size="default" icon="Plus">添加職位</el-button>
    <el-table border style="margin: 10px 0px;" :data="allRole">
      <el-table-column type="index" align="center" label="#"></el-table-column>
      <el-table-column label="ID" align="center" prop="id"></el-table-column>
      <el-table-column label="職位名稱" align="center" show-overflow-tooltip prop="roleName"></el-table-column>
      <el-table-column label="創建時間" align="center" show-overflow-tooltip prop="createTime"></el-table-column>
      <el-table-column label="更新時間" align="center" show-overflow-tooltip prop="updateTime"></el-table-column>
      <el-table-column label="操作" width="280px" align="center">
        <!-- row: 已有的職位對象 -->
        <template #="{ row, $index }">
          <el-button type="primary" size="smal" icon="User">分配權限</el-button>
          <el-button type="primary" size="smal" icon="Edit">編輯</el-button>
          <el-button type="primary" size="smal" icon="Delete">刪除</el-button>
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
      @current-change="getHasRole"
      @size-change="sizeChange"
    ></el-pagination> 
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
// 請求方法
import { reqAllRoleList } from '@/api/acl/role';
import type { RoleResponseData, Records } from '@/api/acl/role/type'; 

// 默認頁碼
let pageNo = ref<number>(1)
// 一頁展示幾條數據
let pageSize = ref<number>(10)
// 職位總各數
let total = ref<number>(0)
// 搜尋職位關鍵字
let keyword = ref<string>('')
// 存儲全部已有的職位
let allRole = ref<Records>([])

// 引入骨架的倉庫
import useLayoutSettingStore from '@/store/modules/setting';
let settingStore = useLayoutSettingStore()

// 組件掛載完畢
onMounted(()=> {
  // 獲取職位請求
  getHasRole()
})

// 獲取全部用戶信息的方法|分頁器當前頁碼發生變化的回調
const getHasRole = async (pager = 1) => {
  // 修改當前頁碼
  pageNo.value = pager
  let result: RoleResponseData = await reqAllRoleList(pageNo.value, pageSize.value, keyword.value)
  if (result.code == 200) {
    total.value = result.data.total
    allRole.value = result.data.records
  }
}

// 下拉菜單的回調
const sizeChange = () => {
  getHasRole()
}

// 搜索按鈕的回調
const search = () => {
  // 再次發請求根據關鍵字
  getHasRole()
  keyword.value = ''
}

// 重置按鈕的回調
const reset = () => {
  settingStore.refsh = !settingStore.refsh
}
</script>

<style scoped lang="scss">
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
}
</style>
