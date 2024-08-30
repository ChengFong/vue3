<template>
    <div class="box4" ref="map">
      我是地圖組件
    </div>
  </template>
  
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';
// 引入中國地圖的JSON數據
import chinaJSON from './china.json'

// 獲取DOM元素
let map = ref()
// 註冊中國地圖
echarts.registerMap('china', chinaJSON as any)

onMounted(()=>{
  let mychart = echarts.init(map.value)
  // 設置配置項
  mychart.setOption({
    // 地圖組件
    geo: {
      map: 'china', // 中國地圖
      roam: true, // 鼠標縮放的效果
      // 地圖的位置調試
      left: 50,
      top: 100,
      right: 50,
      bottom: 50,
      // 地圖上的文字地設置
      label: {
        show: true
      },
      itemStyle: {
        // 每一個多邊形的樣式
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
              offset: 0, color: 'red' // 0% 处的颜色
          }, {
              offset: 1, color: 'blue' // 100% 处的颜色
          }],
          global: false // 缺省为 false
        }
      }
    }
  })
})
</script>
  
  <style scoped lang="scss"></style>
  