<template>
  <div class="container">
    <!-- 數據大屏展示內容區域 -->
    <div class="screen" ref="screen">
      <!-- 數據大屏頂部 -->
      <div class="top"><Top/></div>
      <div class="bottom">
        <div class="left">
          <Tourist class="tourist"></Tourist>
          <Sex class="sex"></Sex>
          <Age class="age"></Age>
        </div>
        <div class="center">
          <Map class="map"></Map>
          <Line class="line"></Line>
        </div>
        <div class="right">右側</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
// 引入頂部的子組件
import Top from './components/top/index.vue'
// 引入左側三個子組件
import Tourist from './components/tourist/index.vue'
import Sex from './components/sex/index.vue'
import Age from './components/age/index.vue'
// 引入中間兩個子組件
import Map from './components/map/index.vue'
import Line from './components/line/index.vue'

// 獲取數據大屏展示內容盒子的DOM元素
let screen = ref()

onMounted(() => {
  screen.value.style.transform = `scale(${getScale()}) translate(-50%,-50%)`
})

// 定義大屏縮放比例
function getScale(w = 1920, h = 1080) {
  const ww = window.innerWidth / w
  const wh = window.innerHeight / h
  return ww < wh ? ww : wh
}

// 監聽視口變化
window.onresize = () => {
  screen.value.style.transform = `scale(${getScale()}) translate(-50%,-50%)`
}

</script>

<style scoped lang="scss">
.container {
  width: 100vw;
  height: 100vh;
  background: url( ./images/bg.png) no-repeat;
  background-size: cover;
  .screen {
    position: fixed;
    transform-origin: left top;
    width: 1920px;
    height: 1080px;
    left: 50%;
    top: 50%;
    .top {
      width: 100%;
      height: 40px;
    }
    .bottom {
      display: flex;
      .right {
        flex: 1;
      }
      .left {
        flex: 1;
        height: 1040px;
        display: flex;
        flex-direction: column;
        .tourist {
          flex: 1.2;
        }
        .sex {
          flex: 1;
        }
        .age {
          flex: 1;
        }
         
      }
      .center {
        flex: 2;
        display: flex;
        flex-direction: column;
        .map {
          flex: 4;
        }
        .line {
          flex: 1;
        }
      }
    }
  }
}
</style>
