<template>
    <div class="clearfix">
        <a-upload
            :file-list="computedFileList"
            accept=".png,.jpg,.jpeg,.gif"
            list-type="picture-card"
            :disabled="props.disabled"
            :before-upload="handleUpload"
            :max-count="multiple ? undefined : 1"
            @preview="handlePreview"
            @remove="handleRemove"
        >
            <div>
                <PlusOutlined />
                <div style="margin-top: 8px">上传图片</div>
            </div>
        </a-upload>
        <a-modal :visible="state.previewVisible" :title="null" :footer="null" @cancel="handleCancel">
            <img alt="example" style="width: 100%" :src="state.previewImage" />
        </a-modal>
    </div>
</template>
<script lang="ts" setup>
import { componentPublishApi } from '@/apis'
import { getImagePath } from '@/utils'
import { PlusOutlined } from '@ant-design/icons-vue'
import { message, UploadFile } from 'ant-design-vue'
const props = defineProps({
    value: {
        type: Array<UploadFile>,
        default() {
            return []
        }
    },
    paramsData: {
        type: Object,
        default() {
            return {}
        }
    },
    multiple: {
        type: Boolean,
        default: false
    },
    disabled: {
        type: Boolean,
        default: false
    }
    // maxCount: {
    //     type: Number,
    //     default: 1
    // },
    // accept: {
    //     type: String,
    //     default: '.zip,.rar'
    // }
})
const state = reactive<any>({
    fileList: [],
    previewVisible: false,
    previewImage: ''
})
const emit = defineEmits(['update:value'])

watch(() => props.value, () => {
    state.fileList = props.value
}, { deep: true, immediate: true })

const computedFileList = computed(() => state.fileList?.map((item: any) => ({ ...item, url: getImagePath(item.src) })))

const handleUpload = async (data: any) => {
    console.log(data)
    const params = {
        file: data,
        data: props.paramsData
    }
    const file = reactive({
        name: data.name,
        src: '',
        // url: '',
        width: null,
        height: null,
        size: null,
        status: 'uploading'
    })
    if (props.multiple) {
        state.fileList = [...state.fileList, file]
    } else {
        state.fileList = [file]
    }
    const res = await componentPublishApi.requestUploadDist(params, (e) => onProgress(e, file)).catch(() => {
        file.status = 'error'
        message.error('上传失败！')
        return false
    })
    if (res.success) {
        file.status = 'done'
        // file.url = getImagePath(res.result.filePath)
        file.src = res.result.filePath
        file.width = res.result.imageWidth
        file.height = res.result.imageHeight
        file.size = res.result.fileSize
        emit('update:value', state.fileList)
    } else {
        file.status = 'error'
        message.error('上传失败！')
    }
    return false
}
const handleRemove = async (file: any) => {
    const fileList = state.fileList.filter((item: any) => item.name !== file.name)
    emit('update:value', fileList)
}
const handlePreview = (file: any) => {
    console.log('handlePreview')
    state.previewImage = file.url
    state.previewVisible = true
}
const handleCancel = () => {
    state.previewVisible = false
}
const onProgress = (e: any, item: any) => {
    if (e && e.progress) {
        item.percent = (e.progress * 100)
    }
}
</script>

<style lang="scss" scoped>
.file-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 5px;
    &:hover {
        transition: background-color .3s;
        background-color: #f5f5f5;
        .delete {
            transition: color .3s;
            color: rgba(0,0,0,0.45);
        }
    }
}
.icon {
    color: rgba(0,0,0,0.45);
}
.delete {
    color: transparent;
    padding: 0 10px;
    &:hover{
        transition: color .3s;
        color: rgba(0,0,0,0.45);
    }
}
.click-able {
    cursor: pointer;
    &:hover {
        color: #1890FF;
    }
}
</style>
