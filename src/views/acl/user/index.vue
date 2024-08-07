<template>
  <el-card style="height: 80px">
    <el-form :inline="true" class="form">
      <el-form-item label="用戶名:">
        <el-input placeholder="請你輸入搜索用戶名" v-model="keyword"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="default" :disabled="keyword?false:true" @click="search">搜索</el-button>
        <el-button type="primary" size="default" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin: 10px 0px">
    <el-button type="primary" size="default" @click="addUser">
      添加用戶
    </el-button>
    <el-button type="primary" size="default" :disabled="selectIdArr.length?false:true" @click="deleteSelectUser">批量刪除</el-button>
    <!-- table展示用戶信息 -->
    <el-table style="margin: 10px 0px" border :data="userArr" @selection-change="selectChange">
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column label="#" align="center" type="index"></el-table-column>
      <el-table-column label="ID" align="center" prop="id"></el-table-column>
      <el-table-column
        label="用戶名字"
        align="center"
        prop="username"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="用戶名稱"
        align="center"
        prop="name"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="用戶角色"
        align="center"
        prop="roleName"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="創建時間"
        align="center"
        prop="createTime"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="更新時間"
        align="center"
        prop="updateTime"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column label="操作" width="300px" align="center">
        <template #="{ row, $index }">
          <el-button
            type="primary"
            size="small"
            icon="User"
            @click="setRole(row)"
          >
            分配角色
          </el-button>
          <el-button
            type="primary"
            size="small"
            icon="Edit"
            @click="updateUser(row)"
          >
            編輯
          </el-button>
          <el-popconfirm
            :title="`您確定要刪除${row.username}`"
            width="260px"
            icon="Delete"
            @confirm="deleteUser(row.id)"
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
      :page-sizes="[5, 7, 9, 11]"
      layout="prev, pager, next, jumper,->,sizes,total"
      :background="true"
      :total="total"
      @current-change="getHasUser"
      @size-change="handler"
    ></el-pagination>
  </el-card>
  <!-- 抽屜結構: 完成添加新的用戶帳號|更新已有的帳號信息 -->
  <el-drawer v-model="drawer">
    <!-- 頭部標題:將來文字內容應該動態的 -->
    <template #header>
      <h4>{{ userParams.id ? '更新用戶' : '添加用戶' }}</h4>
    </template>
    <!-- 身體部分 -->
    <template #default>
      <el-form :model="userParams" :rules="rules" ref="formRef">
        <el-form-item label="用戶姓名" prop="username">
          <el-input
            placeholder="請您輸入用戶姓名"
            v-model="userParams.username"
          ></el-input>
        </el-form-item>
        <el-form-item label="用戶暱稱" prop="name">
          <el-input
            placeholder="請您輸入用戶暱稱"
            v-model="userParams.name"
          ></el-input>
        </el-form-item>
        <el-form-item label="用戶密碼" prop="password" v-if="!userParams.id">
          <el-input
            placeholder="請您輸入用戶密碼"
            v-model="userParams.password"
          ></el-input>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="save">確定</el-button>
      </div>
    </template>
  </el-drawer>
  <!-- 抽屜結構: 用戶某一個已有的帳號進行職位分配 -->
  <el-drawer v-model="drawer1">
    <template #header>
      <h4>分配角色</h4>
    </template>
    <template #default>
      <el-form>
        <el-form-item label="用戶姓名">
          <el-input v-model="userParams.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="職位列表">
          <el-checkbox
            v-model="checkAll"
            :indeterminate="isIndeterminate"
            @change="handleCheckAllChange"
          >
            全選
          </el-checkbox>
          <!-- 顯示職位的複選框 -->
          <el-checkbox-group v-model="userRole" @change="handleCheckedChange">
            <el-checkbox
              v-for="(role, index) in allRole"
              :key="index"
              :label="role"
            >
              {{ role.roleName }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="drawer1=false">取消</el-button>
        <el-button type="primary" @click="confirmClick">確定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { reqUserInfo, reqAddOrUpdateUser, reqAllRole, reqSetUserRole, reqDeleteUser, reqRemoveUser } from '@/api/acl/user'
import type {
  UserResponseData,
  Records,
  User,
  AllRoleResponseData,
  AllRole,
  SetRoleData
} from '@/api/acl/user/type'
import { ElMessage } from 'element-plus'
import useLayoutSettingStore from '@/store/modules/setting'

// 默認頁碼
let pageNo = ref<number>(1)
// 一頁展示幾條數據
let pageSize = ref<number>(5)
// 用戶總個數
let total = ref<number>(0)
// 存儲全部用戶的數組
let userArr = ref<Records>([])
// 定義響應式數據控制抽屜的顯示與隱藏
let drawer = ref<boolean>(false)
// 控制分配角色抽屜顯示與隱藏
let drawer1 = ref<boolean>(false)
// 收集用戶信息的響應式數據
let userParams = reactive<User>({
  username: '',
  name: '',
  password: '',
})
// 獲取form組件實例
let formRef = ref<any>()

// 存儲全部職位的數據
let allRole = ref<AllRole>([])
// 當前用戶已有的職位
let userRole = ref<AllRole>([])

// 準備一個數組存儲批量刪除的用戶的ID
let selectIdArr = ref<User[]>([])

// 定義響應式數據: 收集用戶輸入進來的關鍵字
let keyword = ref<string>('')

// 獲取模板setting倉庫
let settingStore = useLayoutSettingStore()

// 組件掛載完畢
onMounted(() => {
  getHasUser()
})

// 獲取全部已有的用戶信息
const getHasUser = async (pager = 1) => {
  // 收集當前頁碼
  pageNo.value = pager
  let result: UserResponseData = await reqUserInfo(pageNo.value, pageSize.value, keyword.value)
  if (result.code == 200) {
    total.value = result.data.total
    userArr.value = result.data.records
  }
}

// 分頁器下拉菜單的自定義事件的回調
const handler = () => {
  getHasUser()
}

// 添加用戶按鈕的回調
const addUser = () => {
  // 抽屜顯示出來
  drawer.value = true
  // 清空數據
  Object.assign(userParams, {
    id: 0,
    username: '',
    name: '',
    password: '',
  })
  // 清除上一次的錯誤的提示信息
  nextTick(() => {
    formRef.value.clearValidate('username')
    formRef.value.clearValidate('name')
    formRef.value.clearValidate('password')
  })
}

// 更新已有的用戶按鈕的回調
// row: 即為已有用戶的帳號信息
const updateUser = (row: User) => {
  // 抽屜顯示出來
  drawer.value = true

  // 存儲收集已有的帳號信息
  Object.assign(userParams, row)
  // 清除上一次的錯誤的提示信息
  nextTick(() => {
    formRef.value.clearValidate('username')
    formRef.value.clearValidate('name')
  })
}

// 保存按鈕的回調
const save = async () => {
  // 點擊保存按鈕的時候，務必須要保證表單全部符合條件在去發請求
  await formRef.value.validate()

  // 保存按鈕: 添加新的用戶 | 更新已有的用戶帳號信息
  let result: any = await reqAddOrUpdateUser(userParams)
  // 添加或者更新成功
  if (result.code == 200) {
    // 關閉抽屜
    drawer.value = false
    // 提示信息
    ElMessage({
      type: 'success',
      message: userParams.id ? '更新成功' : '添加成功',
    })

    // 瀏覽器自動刷新一次
    window.location.reload()
  } else {
    // 關閉抽屜
    drawer.value = false
    // 提示信息
    ElMessage({
      type: 'error',
      message: userParams.id ? '更新失敗' : '添加失敗',
    })
  }
}

// 取消按鈕的回調
const cancel = () => {
  // 關閉抽屜
  drawer.value = false
}

// 校驗用戶名字回調函數
const validatorUsername = (rule: any, value: any, callBack: any) => {
  // 用戶名字|暱稱，長度只少五位
  if (value.trim().length > 5) {
    callBack()
  } else {
    callBack(new Error('用戶名字至少五位'))
  }
}
// 校驗用戶暱稱回調函數
const validatorname = (rule: any, value: any, callBack: any) => {
  // 用戶名字|暱稱，長度只少五位
  if (value.trim().length > 5) {
    callBack()
  } else {
    callBack(new Error('用戶暱稱至少五位'))
  }
}
const validatorPassword = (rule: any, value: any, callBack: any) => {
  // 用戶名字|暱稱，長度只少五位
  if (value.trim().length > 6) {
    callBack()
  } else {
    callBack(new Error('用戶密碼至少六位'))
  }
}
// 表單校驗的規則對象
const rules = {
  // 用戶名字
  username: [{ required: true, trigger: 'blur', validator: validatorUsername }],
  // 用戶暱稱
  name: [{ required: true, trigger: 'blur', validator: validatorname }],
  // 用戶的密碼
  password: [{ required: true, trigger: 'blur', validator: validatorPassword }],
}

// 分配角色按鈕的回調
const setRole = async (row: User) => {
  // 存儲已有的用戶信息
  Object.assign(userParams, row)
  // 獲取全部的職位的數據與當前用戶以有的職位數據
  let result: AllRoleResponseData = await reqAllRole(userParams.id as number)
  if (result.code == 200) {
    // 存儲全部的職位
    allRole.value = result.data.allRolesList
    // 存儲當前用戶已有的職位
    userRole.value = result.data.assignRoles
    // 抽屜顯示出來
    drawer1.value = true
  }
}

// 全選複選框收集數據: 是否全選
let checkAll = ref<boolean>(false)
// 設置不確定狀態，僅負責樣式控制
let isIndeterminate = ref<boolean>(true)
// 全選複選框的change事件
const handleCheckAllChange = (val: boolean) => {
  // val: true(全選) | false(沒有全選)
  userRole.value = val ? allRole.value : []
  isIndeterminate.value = false
}
// 底部的複選框change事件
const handleCheckedChange = (value: string[]) => {
  // 已經勾選的這些項目的長度
  const checkedCount = value.length
  checkAll.value = checkedCount === allRole.value.length
  // 頂部的複選框不確定的樣式
  isIndeterminate.value = !(checkedCount === allRole.value.length)
}

// 確定按鈕的回調(分配職位)
const confirmClick = async () => {
  // 收集參數
  let data: SetRoleData = {
    userId: userParams.id as number,
    roleIdList: userRole.value.map(item => item.id as number)
  }
  // 分配用戶的職位
  let result: any = await reqSetUserRole(data)
  if (result.code == 200) {
    // 提示信息
    ElMessage({type: 'success', message: '分配職務成功'})
    // 關閉抽屜
    drawer1.value = false
    // 獲取更新完畢用戶的信息， 更新完畢留在當前頁
    getHasUser(pageNo.value)
  }
}

// 刪除某一個用戶
const deleteUser = async (userId: number) => {
  let result: any = await reqRemoveUser(userId)
  if (result.code == 200) {
    ElMessage({type:'success', message:'刪除成功'})
    getHasUser(userArr.value.length > 1 ?pageNo.value : pageNo.value-1)
  }
}

// table複選框勾選的時候會觸發的事件
const selectChange = (value: any) => {
  selectIdArr.value = value
}
// 批量刪除按鈕的回調
const deleteSelectUser = async () => {
  // 整理批量刪除的參數
  let idsList: any = selectIdArr.value.map(item => {
    return item.id
  })
  // 批量刪除的請求
  let result: any = await reqDeleteUser(idsList)
  if (result.code == 200) {
    ElMessage({type:'success', message:'刪除成功'})
    getHasUser(userArr.value.length > 1 ?pageNo.value : pageNo.value-1)
  }
}

// 搜索按鈕的問題
const search = () => {
  // 根據關鍵字獲取相應的用戶數據
  getHasUser()
  // 清空關鍵字
  keyword.value = ''
}
// 重置按鈕
const reset = () => {
  settingStore.refsh = !settingStore.refsh 
}
</script>

<style scoped lang="scss">
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
