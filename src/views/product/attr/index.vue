<template>
  <div>
    <!-- 三級分類全局組件 -->
    <Category :scene="scene"></Category>

    <el-card style="margin: 10px 0px">
      <div v-show="scene == 0">
        <el-button
          type="primary"
          size="default"
          icon="Plus"
          :disabled="categroyStore.c3Id ? false : true"
          @click="addAttr"
        >
          添加屬性
        </el-button>
        <el-table border style="margin: 10px 0px" :data="attrArr">
          <el-table-column
            label="序號"
            type="index"
            align="center"
            width="80px"
          ></el-table-column>
          <el-table-column
            label="屬性名稱"
            width="120px"
            prop="attrName"
          ></el-table-column>
          <el-table-column label="屬性值名稱">
            <template #="{ row, $index }">
              <el-tag
                style="margin: 5px"
                v-for="(item, index) in row.attrValueList"
                :key="item.id"
              >
                {{ item.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120px">
            <!-- row: 已有的屬性對象 -->
            <template #="{ row, $index }">
              <!-- 修改已有屬性的按鈕 -->
              <el-button
                type="primary"
                size="small"
                icon="Edit"
                @click="updateAttr(row)"
              ></el-button>

              <el-popconfirm
                :title="`您確定要刪除${row.attrName}`"
                width="200px"
                icon="Delete"
                @confirm="deleteAttr(row.id)"
              >
                <template #reference>
                  <el-button
                    type="primary"
                    size="small"
                    icon="Delete"
                  ></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="scene == 1">
        <!-- 展示添加屬性與修改數據的結構 -->
        <el-form :inline="true">
          <el-form-item label="屬性名稱">
            <el-input
              placeholder="請你輸入屬性名稱"
              v-model="attrParams.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          size="default"
          icon="Plus"
          :disabled="attrParams.attrName ? false : true"
          @click="addAttrValue"
        >
          添加屬性值
        </el-button>
        <el-button type="primary" size="default" @click="cancel">
          取消
        </el-button>
        <el-table
          border
          style="margin: 10px 0px"
          :data="attrParams.attrValueList"
        >
          <el-table-column
            label="序號"
            width="80px"
            type="index"
            align="center"
          ></el-table-column>
          <el-table-column label="屬性值名稱">
            <template #="{ row, $index }">
              <el-input
                :ref="(vc: any) => (inputArr[$index] = vc)"
                v-if="row.flag"
                @blur="toLook(row, $index)"
                placeholder="請你輸入屬性值名稱"
                v-model="row.valueName"
              ></el-input>
              <div v-else @click="toEdit(row, $index)">{{ row.valueName }}</div>
            </template>
          </el-table-column>
          <el-table-column label="屬性值操作">
            <template #="{ row, $index }">
              <el-button
                type="primary"
                size="small"
                icon="Delete"
                @click="attrParams.attrValueList.splice($index, 1)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          size="default"
          @click="save"
          :disabled="attrParams.attrValueList.length > 0 ? false : true"
        >
          保存
        </el-button>
        <el-button type="primary" size="default" @click="cancel">
          取消
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
// 組合式API函數watch
import { ref, reactive, watch, nextTick, onBeforeUnmount } from 'vue'
// 引入獲取已有屬性與屬性值接口
import { reqAttr, reqAddOrUpdateAttr, reqRemoveAttr } from '@/api/product/attr'
import type { AttrResponseData, Attr, AttrValue } from '@/api/product/attr/type'
// 引入分類相關的倉庫
import useCategoryStore from '@/store/modules/category'
import { ElMessage } from 'element-plus'
let categroyStore = useCategoryStore()

// 存儲已有的屬性與屬性值
let attrArr = ref<Attr[]>([])

// 定義card組件內容切換變量
let scene = ref<number>(0) // scene=0顯示table，scene=1展示添加與修改屬性結構

// 收集新增的屬性的數據
let attrParams = reactive<Attr>({
  attrName: '', // 新增的屬性的名字
  attrValueList: [], // 新增的屬性值數組
  categoryId: '', // 三級分類的ID
  categoryLevel: 3, // 代表的是三級分類
})

// 準備一個數組:將來存儲對應的組件實例el-input
let inputArr = ref<any>([])

// 監聽倉庫三級分類ID變化
watch(
  () => categroyStore.c3Id,
  () => {
    // 清空上一次查詢的屬性與屬性值
    attrArr.value = []
    // 保證三級分類得有才能發請求
    if (!categroyStore.c3Id) return
    getAttr()
  },
)
const getAttr = async () => {
  // 獲取分類的ID
  const { c1Id, c2Id, c3Id } = categroyStore
  // 獲取分類下的已有的屬性與屬性值
  let result: AttrResponseData = await reqAttr(c1Id, c2Id, c3Id)
  if (result.code == 200) {
    attrArr.value = result.data
  }
}

// 添加屬性按鈕的回調
const addAttr = () => {
  // 每一次點擊的時候，先清空一下數據在收集數據
  Object.assign(attrParams, {
    attrName: '', // 新增的屬性的名字
    attrValueList: [], // 新增的屬性值數組
    categoryId: categroyStore.c3Id, // 三級分類的ID
    categoryLevel: 3, // 代表的是三級分類
  })

  // 切換為添加與修改屬性的結構
  scene.value = 1
}

// table表格修改已有屬性按鈕的回調
const updateAttr = (row: Attr) => {
  // 切換為添加與修改屬性的結構
  scene.value = 1

  // 將已有的屬性對向賦值給attrParams對象即可
  // ES6->Object.assing進行對象的合併
  Object.assign(attrParams, JSON.parse(JSON.stringify(row)))
}

// 取消按鈕的回調
const cancel = () => {
  scene.value = 0
}

// 添加屬性值按鈕的回調
const addAttrValue = () => {
  // 點擊添加屬性值按鈕的時候，向數組添加一個屬性值對象
  attrParams.attrValueList.push({
    valueName: '',
    flag: true, // 控制每一個屬性值編輯模式與切換模式的切換
  })

  // 獲取最後el-input組件聚焦
  nextTick(() => {
    inputArr.value[attrParams.attrValueList.length - 1].focus()
  })
}

// 保存按鈕的回調
const save = async () => {
  // 發請求
  let result: any = await reqAddOrUpdateAttr(attrParams)
  if (result.code == 200) {
    // 切換場景
    scene.value = 0

    // 提示信息
    ElMessage({
      type: 'success',
      message: attrParams.id ? '修改成功' : '添加成功',
    })

    // 獲取全部已有的屬性與屬性值
    getAttr()
  } else {
    ElMessage({
      type: 'error',
      message: attrParams.id ? '修改失敗' : '添加失敗',
    })
  }
}

// 屬性值表單元素失去焦點事件回調
const toLook = (row: AttrValue, $index: number) => {
  // 非法情況判斷1
  if (row.valueName.trim() == '') {
    // 刪除調用對應屬性值為空的元素
    attrParams.attrValueList.splice($index, 1)
    // 提示信息
    ElMessage({
      type: 'error',
      message: '屬性值不能為空',
    })
    return
  }

  // 非法情況2
  let repeat = attrParams.attrValueList.find((item) => {
    // 切記把當前失去焦點屬性值對向從當前數組扣除判斷
    if (item != row) {
      return item.valueName === row.valueName
    }
  })
  if (repeat) {
    // 將重複的屬性值從數組當中幹掉
    attrParams.attrValueList.splice($index, 1)
    // 提示信息
    ElMessage({
      type: 'error',
      message: '屬性值不能重複',
    })
    return
  }

  // 相應的屬性值對象flag:變為false，展示div
  row.flag = false
}

// 屬性值div點擊事件
const toEdit = (row: AttrValue, $index: number) => {
  // 相應的屬性值對象flag:變為true，展示input
  row.flag = true

  // nextTick: 響應式數據發生變化，獲取更新的DOM(組件實例)
  nextTick(() => {
    inputArr.value[$index].focus()
  })
}

// 刪除某一個已有的屬性方法回調
const deleteAttr = async (attrId: number) => {
  // 發現相應的刪除已有的屬性請求
  let result: any = await reqRemoveAttr(attrId)
  // 刪除成功
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '刪除成功',
    })

    // 獲取一次已有的屬性與屬性值
    getAttr()
  } else {
    ElMessage({
      type: 'error',
      message: '刪除失敗',
    })
  }
}

// 路由組件銷毀的時候，把倉庫分類相關的數據清空
onBeforeUnmount(() => {
  // 清空倉庫的數據
  categroyStore.$reset()
})
</script>

<style scoped lang="scss"></style>
