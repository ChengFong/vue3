<template>
    <div class="box">
        <div class="top">
            <p class="title">實時遊客統計</p>
            <p class="bg"></p>
            <p class="right">可預約總量<span>9999</span>人</p>
        </div>
        <div class="number">
            <span v-for="(item, index) in people" :key="index">{{ item }}</span>
        </div>
        <!-- 盒子將來echarts展示圖形圖標的節點 -->
         <div class="charts">123</div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
let people = ref('215908人')
</script>

<style scoped lang="scss">
.box {
    background: url(../../images/dataScreen-main-lb.png) no-repeat;
    background-size: 100% 100%;
    margin-top: 10px;
    margin-left: 20px;

    .top {
        .title {
            color: white;
            font-size: 20px;        
        }
        .bg {
             width: 68px;
             height: 7px;
             background: url(../../images/dataScreen-title.png) no-repeat;
             background-size: 100% 100%;
             margin-top: 10px;
        }
        .right {
            float: right;
            color: white;
            font-size: 20px; 
            span {
                color: yellowgreen
            }
        }
    }

    .number {
        margin-top: 30px;
        display: flex;
        padding: 10px;
        span {
            flex: 1;
            height: 40px;
            text-align: center;
            line-height: 40px;
            background: url(../../images/total.png) no-repeat;
            background-size: 100% 100%;
            color: #29fcff;
        }
    }

    .charts {
        width: 100%;
        height: 250px;
        background: red;
    }
}
</style>
