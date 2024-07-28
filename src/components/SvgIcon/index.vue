<template>
  <!-- 測試SVG圖標使用 -->
  <!-- svg:圖標外層容器節點, 內部需要與use標籤結合使用 -->
  <svg :style="{ width, height }">
    <!-- xlink:href 執行用哪一個圖標, 屬性值務必 #icon-圖標名字 -->
    <!-- use標籤fill屬性可以設置圖標的顏色 -->
    <use :xlink:href="prefix + name" :fill="color"></use>
  </svg>
</template>

<script setup lang="ts">
// 接受父組件傳遞過來的參數
defineProps({
  // xlink:href 屬性值前綴
  prefix: {
    type: String,
    default: '#icon-',
  },
  // 提供使用的圖標名字
  name: String,
  // 接收父組件傳遞顏色
  color: {
    type: String,
    default: '',
  },
  // 接收父組件傳遞寬度
  width: {
    type: String,
    default: '16px',
  },
  // 接收父組件傳遞高度
  height: {
    type: String,
    default: '16px',
  },
})
</script>

<style scoped></style>
