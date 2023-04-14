<template>
    <!-- <input id="fileBtn" type="file" accept="image/*" style="display: none" @change="onChange" /> -->
    <!-- <a-button @click="uploadClick">图片上传</a-button> -->
    <a-modal v-model:visible="dialogVisible" title="图片裁剪" width="50%" @cancel="afterClose()">
        <div style="width: 100%; height: 50vh">
            <vueCropper ref="cropperRef" :img="options.img" :info="true" :infoTrue="options.infoTrue" :auto-crop="options.autoCrop" :fixed-box="options.fixedBox" :fixedNumber="options.fixedNumber" :fixed="options.fixed" :centerBox="options.centerBox">
            </vueCropper>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <a-button @click="afterClose()">取消</a-button>
                <a-button @click="refreshCrop">重置</a-button>
                <a-button type="primary" @click="finish"> 确认 </a-button>
            </span>
        </template>
    </a-modal>
    <!-- 裁剪的内容 -->
    <!-- <div :style="previews.div" style="float: left">
        <div v-html="previews.html"></div>
    </div> -->
</template>
<script lang="ts" setup>
import { reactive, ref } from 'vue'
import VueCropper from 'vue-cropper/src/vue-cropper.vue'
interface Options {
    img: string | ArrayBuffer | null // 裁剪图片的地址
    info: true // 裁剪框的大小信息
    outputSize: number // 裁剪生成图片的质量 [1至0.1]
    outputType: 'jpeg' // 裁剪生成图片的格式
    canScale: boolean // 图片是否允许滚轮缩放
    autoCrop: boolean // 是否默认生成截图框
    autoCropWidth: number // 默认生成截图框宽度
    autoCropHeight: number // 默认生成截图框高度
    fixedBox: boolean // 固定截图框大小 不允许改变
    fixed: boolean // 是否开启截图框宽高固定比例
    fixedNumber: Array<number> // 截图框的宽高比例  需要配合centerBox一起使用才能生效
    full: boolean // 是否输出原图比例的截图
    canMoveBox: boolean // 截图框能否拖动
    original: boolean // 上传图片按照原始比例渲染
    centerBox: boolean // 截图框是否被限制在图片里面
    infoTrue: boolean // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
}
const props = defineProps({
    isCropperImageShow: {
        type: Boolean,
        default: false
    },
    file: {
        type: File,
        default: () => {
            return null
        }
    }
})
watch(
    () => props.isCropperImageShow,
    (newVal) => {
        console.log('newVal', newVal)
        dialogVisible.value = newVal
    }
)
const emit = defineEmits(['closeCropper'])
const options: Options = reactive({
    img: '', // 需要剪裁的图片
    autoCrop: true, // 是否默认生成截图框
    autoCropWidth: 150, // 默认生成截图框的宽度
    autoCropHeight: 150, // 默认生成截图框的长度
    fixedBox: false, // 是否固定截图框的大小 不允许改变
    info: true, // 裁剪框的大小信息
    outputSize: 0.5, // 裁剪生成图片的质量 [1至0.1]
    outputType: 'jpeg', // 裁剪生成图片的格式
    canScale: false, // 图片是否允许滚轮缩放
    fixed: false, // 是否开启截图框宽高固定比例
    fixedNumber: [1, 1], // 截图框的宽高比例 需要配合centerBox一起使用才能生效
    full: true, // 是否输出原图比例的截图
    canMoveBox: false, // 截图框能否拖动
    original: false, // 上传图片按照原始比例渲染
    centerBox: true, // 截图框是否被限制在图片里面
    infoTrue: true // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
})
// const previews: any = ref({})
let fileItem: any = reactive({})
const cropperRef: any = ref({})
const dialogVisible = ref(false)
const makeInitData = () => {
    if (!props.file) {
        return
    }
    fileItem = props.file
    const URL = window.URL || window.webkitURL
    options.img = URL.createObjectURL(props.file)
    dialogVisible.value = props.isCropperImageShow
    console.log('file:', props.file)
    console.log('options.img:', options.img)
}
makeInitData()
// 触发点击事件
// const uploadClick = () => {
//     document.getElementById('fileBtn')?.click()
// }
// const onChange = (e: any) => {
//     const file = e.target.files[0]
//     fileItem = file
//     const URL = window.URL || window.webkitURL
//     options.img = URL.createObjectURL(file)
//     dialogVisible.value = true
//     console.log('file:', file)
//     console.log('options.img:', options.img)
// }
const refreshCrop = () => {
    cropperRef.value.refresh()
}
// 上传图片（点击保存按钮）
const finish = () => {
    cropperRef.value.getCropBlob((data: any) => {
        console.log('获取截图的 blob 数据:', data)
        // 下面是将blob转为formData
        const formData = new FormData()
        formData.append('file', data, new Date().getTime() + '.jpg')
        console.log('formData:', formData)
        // 下面是将blob转换为file
        data.lastModifiedDate = new Date() // 文件最后的修改日期
        const file = new File([data], fileItem?.name, {
            type: data.type,
            lastModified: Date.now()
        })
        console.log('file:', file)
        console.log('fileItem:', JSON.parse(JSON.stringify(fileItem)))
        emit('closeCropper', {
            type: 1,
            file
        })
    })
}
const afterClose = () => {
    // dialogVisible.value = false
    emit('closeCropper', {
        type: 0
    })
}
// 裁剪之后的数据
// const realTime = (data: any) => {
//     previews.value = data
// }
</script>
