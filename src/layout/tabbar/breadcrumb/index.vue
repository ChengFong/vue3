<template>
  <el-icon style="margin-right: 10px" @click="changeIcon">
    <component :is="LayoutSettingStore.fold ? 'Fold' : 'Expand'"></component>
  </el-icon>
  <!-- 左側麵包屑 -->
  <el-breadcrumb separator-icon="ArrowRight">
    <!-- 麵包動態展示路由名字與標題 -->
    <el-breadcrumb-item
      v-for="(item, index) in $route.matched"
      :key="index"
      :to="item.path"
      v-show="item.meta.title"
    >
      <!-- 圖標 -->
      <el-icon style="margin: 0px 2px">
        <component :is="item.meta.icon"></component>
      </el-icon>
      <!-- 麵包屑展示匹配路由的標題 -->
      <span>{{ item.meta.title }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import useLayoutSettingStore from '@/store/modules/setting'
import { useRoute } from 'vue-router'

// 獲取layout配置相關的倉庫
let LayoutSettingStore = useLayoutSettingStore()

// 獲取路由對象
let $route = useRoute()

// 點擊圖標的方法
const changeIcon = () => {
  // 圖標進行切換
  LayoutSettingStore.fold = !LayoutSettingStore.fold
}
</script>
<script lang="ts">
export default {
  name: 'Breadcrumb',
}
</script>

<style scoped lang="scss"></style>
