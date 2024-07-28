<template>
  <div class="layout_container">
    <!-- 左側菜單 -->
    <div class="layout_slider">
      <Logo></Logo>
      <!-- 展示菜單 -->
      <!-- 滾動組件 -->
      <el-scrollbar class="scrollbar">
        <!-- 菜單組件 -->
        <el-menu
          :default-active="$route.path"
          :collapse="LayoutSettingStore.fold ? true : false"
          background-color="#001529"
          text-color="white"
          active-text-color="yellowgreen"
        >
          <!-- 根據路由動態生成菜單 -->
          <Menu :menuList="userStore.menuRoutes"></Menu>
        </el-menu>
      </el-scrollbar>
    </div>
    <!-- 頂部導航 -->
    <div
      class="layout_tabbar"
      :class="{ fold: LayoutSettingStore.fold ? true : false }"
    >
      <!-- layout組件的頂部導航tabbar -->
      <Tabbar></Tabbar>
    </div>
    <!-- 內容展示區域 -->
    <div
      class="layout_main"
      :class="{ fold: LayoutSettingStore.fold ? true : false }"
    >
      <Main></Main>
    </div>
  </div>
</template>

<script setup lang="ts">
// 獲取路由對象
import { useRoute } from 'vue-router'
// 引入左側菜單logo子組件
import Logo from './logo/index.vue'
// 引入菜單組件
import Menu from './menu/index.vue'
// 右側內容展示區域
import Main from './main/index.vue'
// 引入頂部tabbar組件
import Tabbar from './tabbar/index.vue'

// 獲取用戶相關的小倉庫
import useUserStore from '@/store/modules/user'
let userStore = useUserStore()

// 獲取layout配置相關的倉庫
import useLayoutSettingStore from '@/store/modules/setting'
let LayoutSettingStore = useLayoutSettingStore()

// 獲取路由對象
let $route = useRoute()
</script>
<script lang="ts">
export default {
  name: 'Layout',
}
</script>

<style scoped lang="scss">
.layout_container {
  width: 100%;
  height: 100vh;

  .layout_slider {
    color: white;
    width: $base-menu-width;
    height: 100vh;
    background: $base-menu-background;
    transition: all 0.3s;

    .scrollbar {
      width: 100%;
      height: calc(100% - $base-menu-logo-height);
      .el-menu {
        border-right: none;
      }
    }
  }

  .layout_tabbar {
    position: fixed;
    width: calc(100% - $base-menu-width);
    height: $base-tabbar-height;
    top: 0px;
    left: $base-menu-width;
    transition: all 0.3s;

    &.fold {
      width: calc(100vw - $base-menu-min-width);
      left: $base-menu-min-width;
    }
  }

  .layout_main {
    position: absolute;
    width: calc(100% - $base-menu-width);
    height: calc(100vh - $base-tabbar-height);
    left: $base-menu-width;
    top: $base-tabbar-height;
    padding: 20px;
    overflow: auto;
    transition: all 0.3s;

    &.fold {
      width: calc(100vw - $base-menu-min-width);
      left: $base-menu-min-width;
    }
  }
}
</style>
