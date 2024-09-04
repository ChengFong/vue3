<template>
    <div class="box7">
        <div class="title">
            <p>年度遊客量對比</p>
            <img src="../../images/dataScreen-title.png" alt="">
        </div>
        <div class="charts" ref="charts"></div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';

// 獲取DOM節點
let charts = ref()

// 組件掛載完畢
onMounted(() => {
    // 一個容器可以同時展示多種類型的圖形圖標
    let mychart = echarts.init(charts.value)
    // 設置配置項
    mychart.setOption({
        title: {
            text: '散點圖',
            left: '40%',
            textStyle: {
                color: 'white'
            }
        },
        xAxis: {
            type: 'category',
            show: true
        },
        yAxis: {
            show: false
        },
        grid: {
            left: 20,
            top: 20,
            right: 0,
            bottom: 20
        },
        series: {
            type: 'scatter',
            data: [33, 88, 21, 9, 788, 234, 1213, 1231, 6674, 3],
            // 標記圖形設置
            symbol: 'diamond',
            symbolSize: 16,
            // 圖文標籤
            label: {
                show: true,
                position: 'top',
                color: 'red'
            },
            // 散點圖標記的顏色
            itemStyle: {
                color: 'cyan'
            }
        }
    })
})
</script>

<style scoped lang="scss">
.box7 {
    width: 100%;
    height: 100%;
    background: url(../../images/dataScreen-main-lb.png) no-repeat;
    background-size: 100% 100%;
    margin: 20px 0px;

    .title {
        p {
            color: white;
            font-size: 18px;
        }
    }

    .charts {
        height: calc(100% - 30px);
    } 
}

</style>
