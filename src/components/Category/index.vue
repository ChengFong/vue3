<template>
  <el-card>
    <el-form>
      <el-form-item label="一級分類">
        <el-select
          v-model="categroyStore.c1Id"
          @change="handler"
          :disabled="scene == 0 ? false : true"
        >
          <!-- 
            option: 
              label即為顯示文字
              value屬性即為select下拉菜單收集的數據 
          -->
          <el-option
            v-for="(c1, index) in categroyStore.c1Arr"
            :key="c1.id"
            :label="c1.name"
            :value="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二級分類">
        <el-select
          v-model="categroyStore.c2Id"
          @change="handler1"
          :disabled="scene == 0 ? false : true"
        >
          <el-option
            v-for="(c2, index) in categroyStore.c2Arr"
            :key="c2.id"
            :label="c2.name"
            :value="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三級分類">
        <el-select
          v-model="categroyStore.c3Id"
          :disabled="scene == 0 ? false : true"
        >
          <el-option
            v-for="(c3, index) in categroyStore.c3Arr"
            :key="c3.id"
            :label="c3.name"
            :value="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
// 引入生命週期函數鉤子
import { onMounted } from 'vue'
// 引入分類相關的倉庫
import useCategoryStore from '@/store/modules/category'
let categroyStore = useCategoryStore()

// 組件掛載完畢，通知倉庫發請求獲取一級分類的數據
onMounted(() => {
  // 獲取一級分類的數據
  getC1()
})

// 通知倉庫獲取一級分類的方法
const getC1 = async () => {
  // 通知分類倉庫發請求獲取一級分類的數據
  categroyStore.getC1()
}

// 此方法即為一級分類下拉菜單的change事件(選中值的時候觸發，保證一級分類ID有了)
const handler = () => {
  // 需要將二級、三級分類的數據清空
  categroyStore.c2Id = ''
  categroyStore.c3Arr = []
  categroyStore.c3Id = ''

  // 通知倉庫獲取二級分類的數據
  categroyStore.getC2()
}

// 此方法即為二級分類下拉菜單的change事件(選種植的時候會觸發，保證二級分類ID有了)
const handler1 = () => {
  // 清理三級分類的數組
  categroyStore.c3Id = ''

  categroyStore.getC3()
}

// 接收父組件傳遞過來的scene
defineProps(['scene'])
</script>

<style scoped lang="scss"></style>
