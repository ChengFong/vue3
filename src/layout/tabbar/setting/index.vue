<template>
  <el-button
    type="primary"
    size="small"
    icon="Refresh"
    circle
    @click="updateRefsh"
  ></el-button>
  <el-button
    type="primary"
    size="small"
    icon="FullScreen"
    circle
    @click="fullScreen"
  ></el-button>
  <el-popover
    placement="bottom"
    title="主題設置"
    :width="300"
    trigger="hover"
  >
    <!-- 表單元素 -->
    <el-form>
      <el-form-item label="主題顏色">
        <el-color-picker @change="setColor" v-model="color" show-alpha size="samll" :predefine="predefineColors" />
      </el-form-item>
      <el-form-item label="暗黑模式">
        <el-switch
          @change="changeDark"
          v-model="dark"
          size="samll"
          class="mt-2"
          inline-prompt
          active-icon="MoonNight"
          inactive-icon="Sunny"
        />
      </el-form-item>
    </el-form>
    <template #reference>
      <el-button type="primary" size="small" icon="Setting" circle></el-button>
    </template>
  </el-popover>
  <img
    :src="userStore.avatar"
    style="width: 24px; height: 24px; margin: 0px 10px; border-radius: 50%"
  />
  <!-- 下拉菜單 -->
  <el-dropdown>
    <span class="el-dropdown-link">
      {{ userStore.username }}
      <el-icon class="el-icon--right"><arrow-down /></el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="logout">退出登錄</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router'
// 獲取用戶相關的小倉庫
import useUserStore from '@/store/modules/user'
// 獲取骨架的小倉庫
import useLayoutSettingStore from '@/store/modules/setting'

let layoutSettingStore = useLayoutSettingStore()
let userStore = useUserStore()
// 獲取路由器對象
let $router = useRouter()
// 獲取路由對象
let $route = useRoute()
// 收集開關的數據
let dark = ref<boolean>(false)

// 刷新按鈕點擊回調
const updateRefsh = () => {
  layoutSettingStore.refsh = !layoutSettingStore.refsh
}

// 全屏按鈕點擊的回調
const fullScreen = () => {
  // DOM對象的一個屬性: 可以用來判斷當前是不是全屏模式[全屏:true,不是全屏:false]
  let full = document.fullscreenElement
  // 切換為全屏模式
  if (!full) {
    // 文檔根結點的方法requestFullscreen，實現全屏模式
    document.documentElement.requestFullscreen()
  } else {
    // 變為不是全屏模式 -> 退出全屏模式
    document.exitFullscreen()
  }
}

// 退出登錄點擊回調
const logout = async () => {
  // 第一件事情: 需要向服務器發請求[退出登錄接口]
  // 第二件事情: 倉庫當中關於用於相關的數據清空[token|username|avatar]
  // 第三件事情: 跳轉到登錄頁面
  await userStore.userLogout()
  // 跳轉到登錄頁面
  $router.push({ path: '/login', query: { redirect: $route.path } })
}

// 顏色組件的數據
const color = ref('rgba(255, 69, 0, 0.68)')
const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
])

// switch開關的change事件進行暗黑模式的切換
const changeDark = () => {
  // 獲取HTML根結點
  let html = document.documentElement
  // 判斷HTML標籤是否有類名
  dark.value?html.className='dark':html.className=''
}

// 主題顏色的設置
const setColor = () => {
  // 通知js修改根結點的樣式對象的屬性與屬性值
  const html = document.documentElement
  html.style.setProperty('--el-color-primary', color.value)
}
</script>

<script lang="ts">
export default {
  name: 'Setting',
}
</script>

<style scoped lang="scss"></style>
