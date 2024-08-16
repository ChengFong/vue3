<template>
  <el-table :data="permissionArr" style="width: 100%; margin-bottom: 20px;" row-key="id" border default-expand-all>
    <el-table-column label="名稱" prop="name"></el-table-column>
    <el-table-column label="權限值" prop="code"></el-table-column>
    <el-table-column label="修改時間" prop="updateTime"></el-table-column>
    <el-table-column label="操作">
      <!-- row: 即為已有的菜單對象|按鈕的對象的數據 -->
       <template #="{ row, $index }">
          <el-button @click="addPermission(row)" type="primary" size="small" :disabled="row.level==4?true:false">{{ row.level==3?'添加功能':'添加菜單' }}</el-button>
          <el-button @click="updatePermission(row)" type="primary" size="small" :disabled="row.level==1?true:false">編輯</el-button>
          <el-popconfirm
            :title="`您確定要刪除${row.name}`"
            width="260px"
            icon="Delete"
            @confirm="removeMenu(row.id)"
            >
            <template #reference>
              <el-button type="primary" size="small" icon="Delete" :disabled="row.level==1?true:false">刪除</el-button>
            </template>
          </el-popconfirm>
       </template>
    </el-table-column>
  </el-table>
  <!-- 對話框組件: 添加或者更新已有的菜單的數據結構 -->
  <el-dialog :title="menuData.id?'更新菜單':'添加菜單'" v-model="dialogVisible">
    <!-- 表單組件: 收集新增與已有的菜單的數據 -->
    <el-form>
      <el-form-item label="名稱">
        <el-input placeholder="請你輸入菜單名稱" v-model="menuData.name"></el-input>
      </el-form-item>
      <el-form-item label="權限">
        <el-input placeholder="請你輸入權限數值" v-model="menuData.code"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="save()">
        確定
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
// 引入獲取菜單請求API
import { reqAllPermission, reqAddOrUpdateMenu, reqRemoveMenu } from '@/api/acl/menu';
// 引入ts類型
import type { PermissionResponseData, PermissionList, Permission, MenuParams } from '@/api/acl/menu/type';
import { ElMessage } from 'element-plus';

// 存儲菜單的數據
let permissionArr = ref<PermissionList>([])
// 控制對話框的顯示與隱藏
let dialogVisible = ref<boolean>(false);
// 攜帶的參數
let menuData = reactive<MenuParams>({
  "code": "",
  "level": 0,
  "name": "",
  "pid": 0
})

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

// 添加菜單按鈕的回調
const addPermission = (row: Permission) => {

  // 清空數據
  Object.assign(menuData, {
    "id": 0,
    "code": "",
    "level": 0,
    "name": "",
    "pid": 0
  }) 

  // 對話框顯示出來
  dialogVisible.value = true
  // 收集新增的菜單的level數值
  menuData.level = row.level + 1
  // 給誰新增子菜單
  menuData.pid = row.id as number
}

// 編輯已有的菜單
const updatePermission = (row: Permission) => {
  dialogVisible.value = true

  // 點擊修改按鈕: 收集已有的菜單的數據進行更新
  Object.assign(menuData, row)
}

// 確定按鈕的回調
const save = async () => {
  let result: any = await reqAddOrUpdateMenu(menuData)
  if (result.code == 200) {
    // 對話框隱藏
    dialogVisible.value = false
    // 提示信息
    ElMessage({type: 'success', message: menuData.id? '更新成功': '添加成功'})
    // 再次獲取全部最新的菜單的數據
    getHasPermission()
  }
}

// 刪除按鈕回調
const removeMenu = async (id: number) => {
  let result: any = await reqRemoveMenu(id)
  if (result.code == 200) {
    ElMessage({type: 'success', message: '刪除成功'})
    getHasPermission()
  }
}
</script>

<style scoped lang="scss"></style>
