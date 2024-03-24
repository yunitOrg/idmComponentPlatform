<template>
    <AUpload
        v-show="props.multiple || !state.fileList || !state.fileList.length"
        :accept="props.accept"
        :multiple="props.multiple"
        :disabled="loading"
        :show-upload-list="false"
        :before-upload="handleUpload"
    >
        <slot>
            <AButton :disabled="loading"><upload-outlined />上传文件</AButton>
        </slot>
    </AUpload>
    <div v-show="state.fileList && state.fileList.length">
        <div v-for="item, index in state.fileList" :key="index" class="file-item">
            <span :class="{'click-able': !item.loading && item.url}" :style="!item.loading && !item.url ? 'color: #ff4d4f' : ''" @click="handleFileDownload(item)">
                <LoadingOutlined v-show="item.loading" class="icon" />
                <PaperClipOutlined v-show="!item.loading && item.url" class="icon" />
                <ExclamationCircleOutlined v-show="!item.loading && !item.url" style="color: #ff4d4f" />
                {{ item.name }}
            </span>
            <DeleteOutlined v-show="!item.loading" class="icon delete" @click="handleFileRemove(item)" />
        </div>
    </div>
</template>
<script lang="ts" setup>
import { componentPublishApi } from '@/apis'
import { timestampToTime } from '@/utils'
import { UploadOutlined, LoadingOutlined, PaperClipOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue'
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
    // maxCount: {
    //     type: Number,
    //     default: 1
    // },
    accept: {
        type: String,
        default: '.zip,.rar'
    }
})
const state = reactive<any>({
    fileList: []
})
const loading = ref(false)
const emit = defineEmits(['update:value'])

watch(() => props.value, () => {
    state.fileList = props.value
}, { deep: true, immediate: true })

const handleUpload = async (data: any) => {
    const params = {
        file: data,
        data: props.paramsData
    }
    loading.value = true
    const file = reactive({ name: data.name, url: '', loading: true, size: 0, time: '' })
    if (props.multiple) {
        state.fileList = [...state.fileList, file]
    } else {
        state.fileList = [file]
    }
    const res = await componentPublishApi.requestUploadDist(params).catch(() => {
        loading.value = false
        file.loading = false
        message.error('上传失败！')
        return false
    })
    loading.value = false
    file.loading = false
    if (res.success) {
        file.url = res.result.filePath
        file.size = res.result.fileSize
        file.time = timestampToTime(res.timestamp)
        emit('update:value', state.fileList)
    } else {
        message.error('上传失败！')
    }
    return false
}
const handleFileDownload = async (file: any) => {
    if (file.url) {
        componentPublishApi.downloadStaticFile(file.url)
    }
}
const handleFileRemove = async (file: any) => {
    const fileList = state.fileList.filter((item: any) => item.name !== file.name)

    emit('update:value', fileList)
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
