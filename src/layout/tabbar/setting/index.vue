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
  <el-button type="primary" size="small" icon="Setting" circle></el-button>
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
</script>
<script lang="ts">
export default {
  name: 'Setting',
}
</script>

<style scoped lang="scss"></style>
