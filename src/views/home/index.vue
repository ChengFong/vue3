<template>
  <el-card>
    <div class="box">
      <img :src="userStore.avatar" alt="" class="avatar">
      <div class="bottom">
        <h3 class="title">{{ getTime() }} 好呀 {{ useUserStore.name }}</h3>
        <p class="subtitle">硅谷甄選運營平台</p>
      </div>
      
    </div>
  </el-card>
  <div class="bottoms">
    <svg-icon name="welcome" width="600px" height="300px"></svg-icon>
  </div>
</template>

<script setup lang="ts">
import { getTime } from '@/utils/time';
// 引入用戶相關的倉庫，獲取當前用戶的頭像、暱稱
import useUserStore from '@/store/modules/user';
// 獲取存儲用戶信息的倉庫對象
let userStore = useUserStore()
</script>

<style scoped lang="scss">
.box {
  display: flex;
  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }
  .bottom {
    margin-left: 20px;
    .title {
      font-size: 30px;
      font-weight: 900;
      margin-bottom: 30px;
    }
    .subtitle {
      font-style: italic;
      color: gray;
    }
  }
  
}
.bottoms {
  margin-top: 10px;
  display: flex;
  justify-content: center;
}
</style>
