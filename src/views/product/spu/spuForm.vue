<template>
  <el-form label-width="100px">
    <el-form-item label="SPU名稱">
      <el-input
        placeholder="請你輸入SPU名稱"
        v-model="spuParams.spuName"
      ></el-input>
    </el-form-item>
    <el-form-item label="SPU品牌">
      <el-select v-model="spuParams.tmId">
        <el-option
          v-for="(item, index) in allTradeMark"
          :key="item.id"
          :label="item.tmName"
          :value="item.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="SPU描述">
      <el-input
        type="textarea"
        placeholder="請你輸入SPU描述"
        v-model="spuParams.description"
      ></el-input>
    </el-form-item>
    <el-form-item label="SPU圖標">
      <!-- 
        v-model:file-list -> 展示默認圖片 
        action: 上傳圖片的接口地址
        list-type: 文件列表的類型
      -->
      <el-upload
        v-model:file-list="imgList"
        action="/api/admin/product/fileUpload"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :before-upload="handlerUpload"
      >
        <el-icon><Plus /></el-icon>
      </el-upload>

      <el-dialog v-model="dialogVisible">
        <img
          w-full
          :src="dialogImageUrl"
          alt="Preview Image"
          style="width: 100%; height: 100%"
        />
      </el-dialog>
    </el-form-item>
    <el-form-item label="SPU銷售屬性">
      <!-- 展示銷售屬性的下拉菜單 -->
      <el-select
        v-model="saleAttrIdAndValueName"
        :placeholder="
          unSelectSaleAttr.length
            ? `還未選擇${unSelectSaleAttr.length}個`
            : '無'
        "
      >
        <el-option
          v-for="(item, index) in unSelectSaleAttr"
          :key="item.id"
          :value="`${item.id}:${item.name}`"
          :label="item.name"
        ></el-option>
      </el-select>
      <el-button
        @click="addSaleAttr"
        :disabled="saleAttrIdAndValueName ? false : true"
        style="margin-left: 10px"
        type="primary"
        size="default"
        icon="Plus"
      >
        添加屬性值
      </el-button>
      <!-- table展示銷售屬性與屬性值的地方 -->
      <el-table border style="margin: 10px 0px" :data="saleAttr">
        <el-table-column
          label="序號"
          type="index"
          align="center"
          width="80px"
        ></el-table-column>
        <el-table-column
          label="銷售屬性名字"
          width="120px"
          prop="saleAttrName"
        ></el-table-column>
        <el-table-column label="銷售屬性值">
          <!-- row: 即為當前SPU已有的銷售屬性對象 -->
          <template #="{ row, $index }">
            <el-tag
              @close="row.spuSaleAttrValueList.splice(index, 1)"
              style="margin: 0px 5px"
              v-for="(item, index) in row.spuSaleAttrValueList"
              :key="item.id"
              class="mx-1"
              closable
            >
              {{ item.saleAttrValueName }}
            </el-tag>
            <el-input
              v-if="row.flag == true"
              @blur="toLook(row)"
              v-model="row.saleAttrValue"
              placeholder="請你輸入屬性值"
              size="small"
              style="width: 100px"
            ></el-input>
            <el-button
              v-else
              @click="toEdit(row)"
              type="primary"
              size="small"
              icon="Plus"
            ></el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template #="{ row, $index }">
            <el-button
              type="primary"
              size="small"
              icon="Delete"
              @click="saleAttr.splice($index, 1)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button
        :disabled="saleAttr.length > 0 ? false : true"
        type="primary"
        size="default"
        @click="save"
      >
        保存
      </el-button>
      <el-button type="primary" size="default" @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type {
  SaleAttrValue,
  SpuData,
  Trademark,
  AllTradeMark,
  SpuImg,
  SpuHasImg,
  SaleAttr,
  SaleAttrResponseData,
  HasSaleAttr,
  HasSaleAttrResponseData,
} from '@/api/product/spu/type'
import {
  reqAllTradeMakr,
  reqSpuImageList,
  reqSpuHasSaleAttr,
  reqAllSaleAttr,
  reqAddorUpdateSpu,
} from '@/api/product/spu'
import { ElMessage } from 'element-plus'

// 存儲已有的SPU這些數據
let allTradeMark = ref<Trademark[]>([])
// 商品圖片
let imgList = ref<SpuImg[]>([])
// 已有的SPU銷售屬性
let saleAttr = ref<SaleAttr[]>([])
// 全部銷售屬性
let allSaleAttr = ref<HasSaleAttr[]>([])
// 存儲已有的SPU對象
let spuParams = ref<SpuData>({
  category3Id: '', // 收集三級分類的ID
  spuName: '', // SPU的名字
  description: '', // SPU的描述
  tmId: '', // 品牌的ID
  spuImageList: [],
  spuSaleAttrList: [],
})

// 控制對話框的顯示與隱藏
let dialogVisible = ref<boolean>(false)
// 存儲預覽圖片地址
let dialogImageUrl = ref<string>('')

// 將來收集還未選擇的銷售屬性的ID與屬性值的名字
let saleAttrIdAndValueName = ref<string>('')

let $emit = defineEmits(['changeScene'])

// 點擊取消按鈕: 通知父組件切換場景為1，展示有的SPU數據
const cancel = () => {
  $emit('changeScene', {
    flag: 0,
    params: 'update',
  })
}

// 子組件書寫一個方法
const initHasSpuData = async (spu: SpuData) => {
  // spu: 即為父組件傳遞過來的已有的SPU對象[不完整]

  // 存儲已有的SPU對象，將來在模板中展示
  spuParams.value = spu

  // 獲取全部品牌的數據
  let result: AllTradeMark = await reqAllTradeMakr()
  // 獲取某一個品牌旗下全部售賣商品的圖片
  let result1: SpuHasImg = await reqSpuImageList(spu.id as number)
  // 獲取已有的SPU銷售屬性的數據
  let result2: SaleAttrResponseData = await reqSpuHasSaleAttr(spu.id as number)
  // 獲取整個全部SPU的銷售屬性
  let result3: HasSaleAttrResponseData = await reqAllSaleAttr()

  // 存儲全部品牌的數據
  allTradeMark.value = result.data
  // SPU對應商品圖片
  imgList.value = result1.data.map((item) => {
    return {
      name: item.imgName,
      url: item.imgUrl,
    }
  })
  // 存儲已有的SPU銷售屬性
  saleAttr.value = result2.data
  // 存儲全部的銷售屬性
  allSaleAttr.value = result3.data
}

// 照片牆點擊預覽按鈕的時候觸發的鉤子
const handlePictureCardPreview = (file: any) => {
  dialogImageUrl.value = file.url
  // 對話框彈出來
  dialogVisible.value = true
}
// 照片牆刪除文件鉤子
const handleRemove = () => {
  console.log(123)
}
// 照片牆上傳成功之前鉤子約束文件的大小與類型
const handlerUpload = (file: any) => {
  if (
    file.type == 'image/png' ||
    file.type == 'image/jpeg' ||
    file.type == 'image/gif'
  ) {
    if (file.size / 1024 / 1024 < 3) {
      return true
    } else {
      ElMessage({
        type: 'error',
        message: '上傳文件務必小於3M',
      })
      return false
    }
  } else {
    ElMessage({
      type: 'error',
      message: '上傳文件務必PNG|JPG|GIF',
    })
    return false
  }
}

// 計算出當前SPU還未擁有的銷售屬性
let unSelectSaleAttr = computed(() => {
  // 全部銷售屬性: 顏色、版本、尺碼
  // 已有的銷售屬性: 顏色、版本
  let unSelectAttr = allSaleAttr.value.filter((item) => {
    return saleAttr.value.every((item1) => {
      return item.name != item1.saleAttrName
    })
  })
  return unSelectAttr
})
// 添加銷售屬性的方法
let addSaleAttr = () => {
  const [baseSaleAttrId, saleAttrName] = saleAttrIdAndValueName.value.split(':')
  // 準備一個新的銷售屬性對象: 將來貸給服務器即可
  let newSaleAttr: SaleAttr = {
    baseSaleAttrId,
    saleAttrName,
    spuSaleAttrValueList: [],
  }
  // 追加到數處當中
  saleAttr.value.push(newSaleAttr)
  // 清空收集的數據
  saleAttrIdAndValueName.value = ''
}

// 屬性值按鈕的點擊事件
const toEdit = (row: SaleAttr) => {
  // 點擊按鈕的時候，input組件不就不出來->編輯模式
  row.flag = true
  row.saleAttrValue = ''
}

// 表單元素失去焦點的事件回調
const toLook = (row: SaleAttr) => {
  // 整理收集的屬性的ID與屬性值的名字
  const { baseSaleAttrId, saleAttrValue } = row
  // 整理成服務器需要的屬性執形式
  let newSaleAttrValue: SaleAttrValue = {
    baseSaleAttrId,
    saleAttrValueName: saleAttrValue as string,
  }

  // 非法情況判斷
  if ((saleAttrValue as string).trim() == '') {
    ElMessage({
      type: 'error',
      message: '屬性值不能為空',
    })
    return
  }

  // 判斷屬性值是否在數組當中存在
  let repeat = row.spuSaleAttrValueList.find((item) => {
    return item.saleAttrValueName == saleAttrValue
  })
  if (repeat) {
    ElMessage({
      type: 'error',
      message: '屬性值重複',
    })
    return
  }

  // 追加新的屬性值對象
  row.spuSaleAttrValueList.push(newSaleAttrValue)
  // 切換為查看模式
  row.flag = false
}

// 保存按鈕的回調
const save = async () => {
  // 整理參數
  // 1: 照片牆的數據
  spuParams.value.spuImageList = imgList.value.map((item: any) => {
    return {
      imgName: item.name, // 圖片的名字
      imgUrl: (item.response && item.response.data) || item.url,
    }
  })
  // 2. 整理銷售屬性的數據
  spuParams.value.spuSaleAttrList = saleAttr.value

  // 發請求: 添加SPU | 更新已有的SPU
  let result = await reqAddorUpdateSpu(spuParams.value)
  if (result.code == 200) {
    // 成功
    ElMessage({
      type: 'success',
      message: spuParams.value.id ? '更新成功' : '添加成功',
    })

    // 通知父組件切換場景為0
    $emit('changeScene', {
      flag: 0,
      params: spuParams.value.id ? 'update' : 'add',
    })
  } else {
    // 失敗
    ElMessage({
      type: 'success',
      message: spuParams.value.id ? '更新失敗' : '添加失敗',
    })
  }
}

// 添加一個新的SPU的初始化請求方法
const initAddSpu = async (c3Id: number | string) => {
  // 清空數據
  Object.assign(spuParams.value, {
    category3Id: '', // 收集三級分類的ID
    spuName: '', // SPU的名字
    description: '', // SPU的描述
    tmId: '', // 品牌的ID
    spuImageList: [],
    spuSaleAttrList: [],
  })
  // 清空照片
  imgList.value = []
  // 清空銷售屬性
  saleAttr.value = []
  saleAttrIdAndValueName.value = ''

  // 存儲三級分類的ID
  spuParams.value.category3Id = c3Id

  // 獲取全部品牌的數據
  let result: AllTradeMark = await reqAllTradeMakr()
  // 獲取整個全部SPU的銷售屬性
  let result1: HasSaleAttrResponseData = await reqAllSaleAttr()

  // 存儲全部品牌的數據
  allTradeMark.value = result.data
  // 存儲全部的銷售屬性
  allSaleAttr.value = result1.data
}
// 對外暴露
defineExpose({ initHasSpuData, initAddSpu })
</script>

<style scoped lang="scss"></style>
