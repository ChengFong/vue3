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
         <div class="charts" ref="charts">123</div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';
// 水球圖擴展插件
import 'echarts-liquidfill'

let people = ref('215908人')
// 獲取節點
let charts = ref();

onMounted(() => {
    // 獲取echarts類的實例
    let mycharts = echarts.init(charts.value);
    // 設置實例的配置項
    mycharts.setOption({
        // 標題組件
        title: {
            text: '水球圖'
        },
        // x|y軸組件
        xAxis: {},
        yAxis: {},
        // 系列: 決定你展示什麼樣的圖形圖標
        series: {
            type: 'liquidFill', // 系列
            data: [0.6, 0.4, 0.2], // 展示的數據
            waveAnimation: true, // 動畫
            animationDuration: 3,
            animationDurationUpdate: 0,
            radius: '100%', // 半徑
            outline: {
                borderDistance: 0,
                itemStyle: {
                    borderWidth: 5,
                    borderColor: '#156ACF',
                    shadowBlur: 20,
                    shadowColor: 'rgba(255, 0, 0, 1)'
                }
            }
        },
        // 布局組件
        grid: {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
        }
    })
})

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
    }
}
</style>
