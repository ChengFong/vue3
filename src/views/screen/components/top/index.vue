<template>
  <div class="top">
    <div class="left">
      <span class="lbtn" @click="goHome">首頁</span>
    </div>
    <div class="center">
      <div class="title">智慧旅遊可視化大數據平台</div>
    </div>
    <div class="right">
      <span class="rbtn">統計報告</span>
      <span class="time">當前時間: {{ time }}</span>
    </div>
  </div>
</template>
  
<script setup lang="ts">
// 點擊首頁按鈕回到首頁
import { useRouter } from 'vue-router';
import { ref, onMounted, onUnmounted } from 'vue';
import moment from 'moment'

// 獲取路由器對象
let $router = useRouter()
// 存儲當前時間
let time = ref()
let timer = ref(0)

// 組件掛載完畢更新當前的事件
onMounted(() => {
  timer.value = setInterval(()=>{
    time.value = moment().format('YYYY年MM月DD日 hh:mm:ss')
  }, 1000)
})
onUnmounted(() => {
  clearInterval(timer.value)
})

// 按鈕的點擊回調
const goHome = () => {
  $router.push('/home')
}
</script>
  
<style scoped lang="scss">
  .top {
    width: 100%;
    height: 40px;
    display: flex;
    .left {
      flex: 1.5;
      background: url(../../images/dataScreen-header-left-bg.png) no-repeat;
      background-size: cover;
      .lbtn {
        width: 150px;
        height: 40px;
        float: right;
        background: url(../../images/dataScreen-header-btn-bg-l.png) no-repeat;
        background-size: 100% 100%;
        text-align: center;
        line-height: 40px;
        color: #29fcff;
        font-size: 20px;
      }
    }
    .center {
      flex: 2;
      .title {
        width: 100%;
        height: 74px;
        background: url(../../images/dataScreen-header-center-bg.png) no-repeat;
        background-size: 100% 100%;
        text-align: center;
        line-height: 74px;
        color: #29fcff;
        font-size: 30px;
      }
    }
    .right {
      flex: 1.5;
      background: url(../../images/dataScreen-header-left-bg.png) no-repeat;
      background-size: cover;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .rbtn {
        width: 150px;
        height: 40px;
        float: left;
        background: url(../../images/dataScreen-header-btn-bg-r.png) no-repeat;
        background-size: 100% 100%;
        text-align: center;
        line-height: 40px;
        color: #29fcff;
        font-size: 20px;
      }
      .time {
        color: #29fcff;
        font-size: 20px;
      }
    }
  }
</style>
  