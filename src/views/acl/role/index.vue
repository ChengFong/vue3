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
    <el-button type="primary" size="default" icon="Plus" @click="addRole">添加職位</el-button>
    <el-table border style="margin: 10px 0px;" :data="allRole">
      <el-table-column type="index" align="center" label="#"></el-table-column>
      <el-table-column label="ID" align="center" prop="id"></el-table-column>
      <el-table-column label="職位名稱" align="center" show-overflow-tooltip prop="roleName"></el-table-column>
      <el-table-column label="創建時間" align="center" show-overflow-tooltip prop="createTime"></el-table-column>
      <el-table-column label="更新時間" align="center" show-overflow-tooltip prop="updateTime"></el-table-column>
      <el-table-column label="操作" width="280px" align="center">
        <!-- row: 已有的職位對象 -->
        <template #="{ row, $index }">
          <el-button type="primary" size="smal" icon="User" @click="setPermission(row)">分配權限</el-button>
          <el-button type="primary" size="smal" icon="Edit" @click="updateRole(row)">編輯</el-button>
          <el-popconfirm
            :title="`您確定要刪除${row.roleName}`"
            width="260px"
            icon="Delete"
            @confirm="removeRole(row.id)"
            >
            <template #reference>
              <el-button type="primary" size="small" icon="Delete">刪除</el-button>
            </template>
          </el-popconfirm>
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
  <!-- 添加職位與更新已有職位的結構: 對話框 -->
  <el-dialog v-model="dialogVisible" :title="roleParams.id?'更新職位':'添加職位'">
    <el-form :model="roleParams" :rules="rules" ref="form">
      <el-form-item label="職位名稱" prop="roleName">
        <el-input placeholder="請你輸入職位名稱" v-model="roleParams.roleName"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" size="default" @click="dialogVisible=false">取消</el-button>
      <el-button type="primary" size="default" @click="save">確定</el-button>
    </template>
  </el-dialog>
  <!-- 抽屜組件: 分配職位的菜單權限與按鈕的權限 -->
  <el-drawer v-model="drawer">
    <template #header>
      <h4>分配菜單與按鈕的權限</h4>
    </template>
    <template #default>
      <!-- 樹形控件 -->
      <el-tree
        ref="tree"
        style="max-width: 600px"
        :data="menuArr"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="selectArr"
        :props="defaultProps"
      />
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="drawer=false">取消</el-button>
        <el-button type="primary" @click="handler">確定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue';
// 請求方法
import { reqAllRoleList, reqAddOrUpdateRole, reqAllMenuList, reqSetPermission, reqRemoveRole } from '@/api/acl/role';
import type { RoleResponseData, Records, RoleData, MenuResponseData, MenuList, MenuData } from '@/api/acl/role/type'; 

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
// 控制對話框的顯示與隱藏
let dialogVisible = ref<boolean>(false)
// 收集新增崗位數據
let roleParams = reactive<RoleData>({
  roleName: ''
})
// 獲取form組件實例
let form = ref<any>()
// 控制抽屜顯示與隱藏
let drawer = ref<boolean>(false)
// 定義數組存儲用戶權限的數據
let menuArr = ref<MenuList>([])

// 準備一個數組: 數組用於存儲勾選的節點的ID(四級的)
let selectArr = ref<number[]>([])
// 獲取tree組件實例
let tree = ref<any>()

// 引入骨架的倉庫
import useLayoutSettingStore from '@/store/modules/setting';
import { ElMessage } from 'element-plus';
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

// 添加職位按鈕的回調
const addRole = () => {
  // 對話框顯示出來
  dialogVisible.value = true
  // 清空數據
  Object.assign(roleParams, {
    roleName: '',
    id: 0
  })
  // 清空上一次表單校驗錯誤結果
  nextTick(()=>{
    form.value.clearValidate('roleName')
  })
}
// 更新已有的職位按鈕的回調
const updateRole = (row: RoleData) => {
   // 對話框顯示出來
   dialogVisible.value = true
   // 存儲已有的職位---帶有ID的
   Object.assign(roleParams, row)
   // 清空上一次表單校驗錯誤結果
  nextTick(()=>{
    form.value.clearValidate('roleName')
  })
}

// 自定義校驗規則的回調
const validatorRoleName = (rule: any, value: any, callBack: any) => {
  if (value.trim().length >= 2) {
    callBack()
  } else {
    callBack(new Error('職位名稱至少兩位'))
  }
}
// 職位校驗規則
const rules = {
  roleName: [
    {required: true, trigger: 'blur', validator: validatorRoleName}
  ]
}

// 確定按鈕的回調
const save = async () => {
  // 表單校驗結果，結果通過在發請求、結果沒有通過不應該再發生請求
  await form.value.validate()
  // 添加職位|更新職位的請求
  let result: any = await reqAddOrUpdateRole(roleParams)
  if (result.code == 200) {
    // 提示文字
    ElMessage({type: 'success', message: roleParams.id?'更新成功':'添加成功'})
    // 對話框顯示
    dialogVisible.value = false
    // 再次獲取全部的已有職位
    getHasRole(roleParams.id?pageNo.value:1)
  }
}

// 分配權限按鈕的回調
// 已有的職位的數據
const setPermission = async (row: RoleData) => {
  // 抽屜顯示出來
  drawer.value = true
  // 收集當前要分類權限的職位的數據
  Object.assign(roleParams, row)
  // 根據職位獲取權限的數據
  let result: MenuResponseData = await reqAllMenuList(roleParams.id as number)
  if (result.code == 200) {
    menuArr.value = result.data
    selectArr.value = filterSelectArr(menuArr.value, [])
  }
}

const filterSelectArr = (allData: MenuList, initArr: any) => {
  allData.forEach((item: MenuData) => {
    if (item.select && item.level == 4) {
      initArr.push(item.id)
    }
    if (item.children && item.children.length > 0) {
      filterSelectArr(item.children, initArr)
    }
  })
  return initArr
}

// 樹型控件資料
const defaultProps = {
  children: 'children',
  label: 'name',
}

// 抽屜確定按鈕的回調
const handler = async () => {
  // 職位的ID
  const roleId = roleParams.id as number
  // 選中節點的ID
  let arr = tree.value.getCheckedKeys()
  // 半選的ID
  let arr1 = tree.value.getHalfCheckedKeys()
  let permissionId = arr.concat(arr1)

  // 下發權限
  let result: any = await reqSetPermission(roleId, permissionId)
  if (result.code == 200) {
    // 抽屜關閉
    drawer.value = false
    // 提示信息
    ElMessage({type:'success', message:'分配權限成功'})
    // 頁面刷新
    window.location.reload()
  }
}

// 刪除已有的職位
const removeRole = async (id: number) => {
  let result:any = await reqRemoveRole
  if (result.code == 200) {
    // 提示信息
    ElMessage({type:'success', message:'刪除成功'})
    getHasRole(allRole.value.length > 1 ? pageNo.value : pageNo.value - 1)
  }
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
