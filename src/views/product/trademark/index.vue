<template>
  <el-card class="box-card">
    <!-- 卡片頂部添加品牌按鈕 -->
    <el-button type="primary" size="default" icon="Plus" @click="addTrademark">
      添加品牌
    </el-button>
    <!-- 表格組件: 用於展示已有的平台數據 -->
    <!--
      table
      -- border: 可以設置表格縱向是否有邊框
      table-column
      -- label: 某一個列表
      -- width: 設置邊列寬度
      -- align: 設置列對齊方式
    -->
    <el-table style="margin: 10px 0px" border :data="trademarkArr">
      <el-table-column
        label="序號"
        width="80px"
        align="center"
        type="index"
      ></el-table-column>
      <!-- table-column: 默認展示數據用div -->
      <el-table-column label="品牌名稱" prop="tmName"></el-table-column>
      <el-table-column label="品牌LOGO">
        <template #="{ row }">
          <img :src="row.logoUrl" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column label="品牌操作">
        <template #="{ row }">
          <el-button
            type="primary"
            size="small"
            icon="Edit"
            @click="updateTrademark(row)"
          ></el-button>
          <el-popconfirm
            :title="`您確定要刪除${row.tmName}`"
            width="250px"
            icon="Delete"
            @confirm="removeTradeMark(row.id)"
          >
            <template #reference>
              <el-button type="primary" size="small" icon="Delete"></el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分頁器組件 -->
    <!--
      pagination
        v-model:current-page: 設置分頁器當前頁碼
        v-model:page-size: 設置每一個展示數據條數
        page-sizes: 用於設置下拉菜單數據
        background: 設置分頁器按鈕的背景顏色
        layout: 可以設置分頁器六個子組件布局調整
     -->
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="limit"
      :page-sizes="[3, 5, 7, 9]"
      :background="true"
      layout="prev, pager, next, jumper, ->, total, sizes, total"
      :total="total"
      @current-change="changePageNo"
      @size-change="sizeChange"
    ></el-pagination>
  </el-card>

  <!-- 對話框組件: 在添加品牌與修改已有品牌的業務時候使用結構 -->
  <!-- 
    v-model: 屬性用戶控制對話框的顯示與隱藏 true顯示/false隱藏
    title: 設置對話框左上角標題
  -->
  <el-dialog
    v-model="dialogFormVisible"
    :title="trademarkParams.id ? '修改品牌' : '添加品牌'"
  >
    <el-form
      style="width: 80%"
      :model="trademarkParams"
      :rules="rules"
      ref="formRef"
    >
      <el-form-item label="品牌名稱" label-width="100px" prop="tmName">
        <el-input
          placeholder="請您輸入品牌名稱"
          v-model="trademarkParams.tmName"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
        <!-- upload組件屬性: action圖片上傳路徑書寫/api，代理服務器不發送這次post請求 -->
        <el-upload
          class="avatar-uploader"
          action="/api/admin/product/fileUpload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img
            v-if="trademarkParams.logoUrl"
            :src="trademarkParams.logoUrl"
            class="avatar"
          />
          <el-icon v-else class="avatar-uploader-icon">
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>
    </el-form>
    <!-- 具名插槽: footer -->
    <template #footer>
      <el-button type="primary" size="default" @click="cancel">取消</el-button>
      <el-button type="primary" size="default" @click="confirm">確定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
// 引入組合式API函數ref
import { ref, reactive, onMounted, nextTick } from 'vue'
import {
  reqHasTrademark,
  reqAddOrUpdateTrademark,
  reqDeleteTrademark,
} from '@/api/product/trademark'
import {
  Records,
  TradeMarkResponseData,
  TradeMark,
} from '@/api/product/trademark/type'
import { ElMessage, type UploadProps } from 'element-plus'

// 當前頁碼
let pageNo = ref<number>(1)
// 每一頁展示多少條數據
let limit = ref<number>(3)
// 存儲已有品牌數據總類
let total = ref<number>(0)
// 存儲已有品牌的數據
let trademarkArr = ref<Records>([])
// 控制對話框顯示與隱藏
let dialogFormVisible = ref<boolean>(false)
// 定義收集新增品牌數據
let trademarkParams = reactive<TradeMark>({
  tmName: '',
  logoUrl: '',
})
// 獲取el-form組件實例
let formRef = ref()

// 獲取已有品牌的接口封裝為一個函數: 在任何情況下向獲取數據，調用此函數即可
const getHasTrademark = async () => {
  let result: TradeMarkResponseData = await reqHasTrademark(
    pageNo.value,
    limit.value,
  )
  if (result.code == 200) {
    total.value = result.data.total
    trademarkArr.value = result.data.records
  }
}

// 組件掛載完畢鉤子---發一次請求，獲取第一頁、一頁三個已有品牌數據
onMounted(() => {
  getHasTrademark()
})

// 分頁器當前頁碼發生變化的時候會觸發
// 對於當前頁碼發生自定義事件，組件pagination父組件回傳了數據(當前頁碼)
const changePageNo = () => {
  // 當前頁碼發生變化的時候再次發請求獲取對應已有品牌數據展示
  getHasTrademark()
}

// 當下拉菜單發生變化的時候觸發此方法
// 這個自定義事件，分頁器組件會將下拉菜單選種數據返回
const sizeChange = () => {
  // 當前每一頁的數據量發生變化的時候，當前頁碼歸1
  pageNo.value = 1
  getHasTrademark()
}

// 添加品牌按鈕的回調
const addTrademark = () => {
  // 對話框顯示
  dialogFormVisible.value = true
  // 清空收集數據情況
  trademarkParams.id = 0
  trademarkParams.tmName = ''
  trademarkParams.logoUrl = ''

  // 第一種寫法: ts的問號語法
  // formRef.value?.clearValidate('tmName')
  // formRef.value?.clearValidate('logoUrl')

  nextTick(() => {
    formRef.value.clearValidate('tmName')
    formRef.value.clearValidate('logoUrl')
  })
}

// 修改已有品牌的按鈕的回掉
const updateTrademark = (row: TradeMark) => {
  // 對話框顯示
  dialogFormVisible.value = true

  // ES6語法合併對象
  Object.assign(trademarkParams, row)

  // 清空要驗規則錯誤提示信息
  nextTick(() => {
    formRef.value.clearValidate('tmName')
    formRef.value.clearValidate('logoUrl')
  })
}

// 對話框底部取消按鈕
const cancel = () => {
  // 對話框隱藏
  dialogFormVisible.value = false
}
const confirm = async () => {
  // 在你發請求之前，要對於整個表單進行校驗
  // 調用這個方法進行全部表單項校驗，如果校驗全部通過，在執行後面的語法
  await formRef.value.validate()

  let result: any = await reqAddOrUpdateTrademark(trademarkParams)
  // 添加|修改品牌成功
  if (result.code == 200) {
    // 對話框隱藏
    dialogFormVisible.value = false
    // 彈出提示信息
    ElMessage({
      type: 'success',
      message: trademarkParams.id ? '修改品牌成功' : '添加品牌成功',
    })

    // 再次發請求獲取已有全部的品牌數據
    if (!trademarkParams.id) {
      pageNo.value = 1
    }
    getHasTrademark()
  } else {
    // 添加品牌失敗
    ElMessage({
      type: 'error',
      message: trademarkParams.id ? '修改品牌失敗' : '添加品牌失敗',
    })
    // 對話框隱藏
    dialogFormVisible.value = false
  }
}

// 上傳圖片組件 -> 上傳圖片之前觸發的鉤子函數
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  // 鉤子是在圖片上傳成功之前觸發，上傳文件之前可以約束文件類型與大小
  // 要求: 上傳文件格式png|jpg|gif 4M
  if (
    rawFile.type == 'image/png' ||
    rawFile.type == 'image/jpeg' ||
    rawFile.type == 'image/gif'
  ) {
    if (rawFile.size / 1024 / 1024 < 4) {
      return true
    } else {
      ElMessage({
        type: 'error',
        message: '上傳文件大小小於4M',
      })
      return false
    }
  } else {
    ElMessage({
      type: 'error',
      message: '上傳文件格式務必PNG|JPG|GIF',
    })
    return false
  }
}

// 圖片上傳成功鉤子
const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response,
  uploadFile,
) => {
  // response: 即為當前這次上傳圖片post請求服務器返回的數據
  // 收集上傳圖片的地址，添加一個新的品牌的時候帶給服務器
  trademarkParams.logoUrl = response.data

  // 圖片上傳成功，清除掉對應圖片校驗結果
  formRef.value.clearValidate('logoUrl')
}

// 品牌自定義校驗規則方法
const validatorTmName = (rule: any, value: any, callBack: any) => {
  // 是當表當元素觸發blur時候，會觸發此方法
  // 自定義校驗規則
  if (value.trim().length >= 2) {
    callBack()
  } else {
    // 校驗未通過返回的錯誤提示信息
    callBack(new Error('品牌名稱位數大於等於兩位'))
  }
}
// 品牌LOGO圖片的自定義校驗規則
const validatorLogoUrl = (rule: any, value: any, callBack: any) => {
  // 如果圖片上傳
  if (value) {
    callBack()
  } else {
    callBack(new Error('LOGO圖片務必上傳'))
  }
}

// 表單校驗規則對象
const rules = {
  tmName: [
    // required: 這個字段務必校驗，表單項前面出來五角星
    // trigger: 代表觸發校驗規則時機 [blur、change]
    { required: true, trigger: 'blur', validator: validatorTmName },
  ],
  logoUrl: [{ required: true, trigger: 'change', validator: validatorLogoUrl }],
}

// 氣泡確認框確定按鈕的回調
const removeTradeMark = async (id: number) => {
  // 點擊確定按鈕刪除已有品牌請求
  let result = await reqDeleteTrademark(id)
  if (result.code == 200) {
    // 刪除成功提示信息
    ElMessage({
      type: 'success',
      message: '刪除品牌成功',
    })

    // 再次獲取已有的品牌數據
    pageNo.value =
      trademarkArr.value.length > 1 ? pageNo.value : pageNo.value - 1
    getHasTrademark()
  } else {
    ElMessage({
      type: 'error',
      message: '刪除品牌失敗',
    })
  }
}
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
