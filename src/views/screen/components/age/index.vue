<template>
    <div class="box2">
        <div class="title">
            <p>年齡比例</p>
            <img src="../../images/dataScreen-title.png" alt="">
        </div>
        <div class="charts" ref="charts">

        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
// 引入echarts
import * as echarts from 'echarts';

let charts = ref()

// 組件掛載完畢初始畫圖形圖標
onMounted(()=>{

    let mychart = echarts.init(charts.value)
    
    // 設置配置項
    let option = {
        tooltip: {
            trigger: 'item'
        },
        legend: {
            top: 40,
            right: 30,
            orient: 'vertical', // 圖例組件方向的設置
            textStyle: {
                color: 'white',
                fontSize: 14
            }
        },
        series: [
            {
            name: 'Access From',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            label: {
                show: true,
                position: 'inside',
                color: 'white'
            },
            labelLine: {
                show: false
            },
            data: [
                { value: 1048, name: '軍事' },
                { value: 735, name: '新聞' },
                { value: 580, name: '直播' },
                { value: 484, name: '娛樂' },
                { value: 300, name: '財經' }
            ]
            }
        ],
        // 調整圖形圖標的位置
        grid: {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0
        }
    };

    mychart.setOption(option);
})
</script>

<style scoped lang="scss">
.box2 {
    width: 100%;
    height: 100%;
    background: url(../../images/dataScreen-main-lb.png) no-repeat;
    background-size: 100% 100%;
    .title {
        margin-right: 2px;
        p {
            color: white;
            font-size: 20px;
        }
    }
    .charts {
        height: 260px;
    }
}
</style>
