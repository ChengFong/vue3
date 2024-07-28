<template>
  <div class="login_container">
    <el-row>
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24">
        <el-form
          class="login_form"
          :model="loginForm"
          :rules="rules"
          ref="loginForms"
        >
          <h1>Hello</h1>
          <h2>歡迎來到硅谷甄選</h2>
          <el-form-item prop="username">
            <el-input
              :prefix-icon="User"
              v-model="loginForm.username"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              :prefix-icon="Lock"
              v-model="loginForm.password"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              class="login_btn"
              type="primary"
              size="default"
              :loading="loading"
              @click="login"
            >
              登錄
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { User, Lock } from '@element-plus/icons-vue'
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElNotification } from 'element-plus'

// 引入獲取當前時間的函數
import { getTime } from '@/utils/time'

// 引入用戶相關的小倉庫
import useUserStore from '@/store/modules/user'
let useStore = useUserStore()

// 獲取路由器
let $router = useRouter()
// 獲取路由對象
let $route = useRoute()

// 定義變量控制按鈕加載效果
let loading = ref(false)

// 收集帳號與密碼的數據
let loginForm = reactive({ username: 'admin', password: '111111' })

// 獲取el-form組件
let loginForms = ref()

// 登錄按鈕回調
const login = async () => {
  // 保證全部表單校驗通過再法請求
  await loginForms.value.validate()

  // 加載效果: 開始加載
  loading.value = true

  // 點擊登錄按鈕以後幹甚麼?
  // 通知倉庫發登錄請求
  // 請求成功->首頁展示數據的地方
  // 請求失敗->彈出登錄失敗信息
  try {
    // 保證登錄成功
    await useStore.userLogin(loginForm)
    // 編程式導航跳轉到展示數據首頁
    // 判斷登錄的時候，路由路徑當中是否有query參數，如果有就往query參數挑戰，沒有跳轉到首頁
    let redirect: any = $route.query.redirect
    $router.push({ path: redirect || '/' })
    // 登錄成功提示信息
    ElNotification({
      type: 'success',
      message: '歡迎回來',
      title: `HI, ${getTime()}好`,
    })

    // 登錄成功加載效果消失
    loading.value = false
  } catch (error) {
    // 登錄失敗加載效果消失
    loading.value = false

    // 登錄失敗提示信息
    ElNotification({
      type: 'error',
      message: (error as Error).message,
    })
  }
}

// 自定義校驗規則函數
const validatorUserName = (rule: any, value: any, callback: any) => {
  // rules: 即為校驗規則對象
  // value: 即為表單元素文本內容
  // 函數: 如果符合條件callBack放行通過即可
  // 如果不符合條件callBack方法，注入錯誤提示信息
  if (value.length >= 5) {
    callback()
  } else {
    callback(new Error('帳號長度至少五位'))
  }
}
const validatorPassword = (rule: any, value: any, callback: any) => {
  if (value.length >= 6) {
    callback()
  } else {
    callback(new Error('密碼長度至少六位'))
  }
}

// 定義表單校驗需要配置對象
const rules = {
  // 規則對象屬性:
  // required: 代表這個字段務必要校驗的
  // min: 文本長度至少多少位
  // max: 文本長度最多多少位
  // message: 錯誤的提示信息
  // trigger: 觸發校驗表單的時機 change->文本發生變化觸發校驗,blur->失去焦點的時候觸發校驗
  username: [
    {
      trigger: 'change',
      validator: validatorUserName,
    },
  ],
  password: [
    {
      trigger: 'change',
      validator: validatorPassword,
    },
  ],
}
</script>

<style scoped lang="scss">
.login_container {
  width: 100%;
  height: 100vh;
  background: url(@/assets/images/background.jpg) no-repeat;
  background-size: cover;

  .login_form {
    position: relative;
    width: 80%;
    top: 30vh;
    background: url(@/assets/images/login_form.png) no-repeat;
    background-size: cover;
    padding: 40px;

    h1 {
      color: white;
      font-size: 40px;
    }

    h2 {
      color: white;
      font-size: 20px;
      margin: 20px 0px;
    }

    .login_btn {
      width: 100%;
    }
  }
}
</style>
