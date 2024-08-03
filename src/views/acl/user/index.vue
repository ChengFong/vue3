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
    <el-button type="primary" size="default" @click="addUser">
      添加用戶
    </el-button>
    <el-button type="primary" size="default">批量刪除</el-button>
    <!-- table展示用戶信息 -->
    <el-table style="margin: 10px 0px" border :data="userArr">
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
          <el-button type="primary" size="small" icon="User">
            分類角色
          </el-button>
          <el-button
            type="primary"
            size="small"
            icon="Edit"
            @click="updateUser(row)"
          >
            編輯
          </el-button>
          <el-button type="primary" size="small" icon="Delete">刪除</el-button>
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
      <h4>添加用戶</h4>
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
        <el-form-item label="用戶密碼" prop="password">
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
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { reqUserInfo, reqAddOrUpdateUser } from '@/api/acl/user'
import type { UserResponseData, Records, User } from '@/api/acl/user/type'
import { ElMessage } from 'element-plus'

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
// 收集用戶信息的響應式數據
let userParams = reactive<User>({
  username: '',
  name: '',
  password: '',
})
// 獲取form組件實例
let formRef = ref<any>()

// 組件掛載完畢
onMounted(() => {
  getHasUser()
})

// 獲取全部已有的用戶信息
const getHasUser = async (pager = 1) => {
  // 收集當前頁碼
  pageNo.value = pager
  let result: UserResponseData = await reqUserInfo(pageNo.value, pageSize.value)
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
    // 獲取最新的全部帳號信息
    getHasUser()
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
</script>

<style scoped lang="scss">
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
