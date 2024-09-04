<template>
    <div class="box8">
        <div class="title">
            <p>數據統計</p>
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
    })
})
</script>

<style scoped lang="scss">
.box8 {
    width: 100%;
    height: 100%;
    background: url(../../images/dataScreen-main-lb.png) no-repeat;
    background-size: 100% 100%;
    margin-top: 20px;

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
