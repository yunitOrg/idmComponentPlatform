<template>
    <editor :id="editorid" v-model="tinycontent" :init="tinyinit" />
</template>

<script setup lang="ts">
import { componentPublishApi } from '@/apis'
import { getImagePath } from '@/utils'
import { message } from 'ant-design-vue'
import Editor from '@tinymce/tinymce-vue'
import { computed, ref } from 'vue'

import { TINY_FONT_FAMILY_FORMATS, TINY_FONT_SIZE_FORMATS, TINY_PLUGINS, TINY_TOOLBAR } from '../enums/tinymceConstants'

const props = defineProps({
    modelValue: {
        type: String,
        required: true,
        default: ''
    },
    editorid: {
        type: String,
        default: 'tiny'
    },
    plugins: {
        type: [String, Array],
        default: TINY_PLUGINS
    },
    toolbar: {
        type: [String, Array],
        default: TINY_TOOLBAR
    },
    toolbarMode: {
        type: String,
        default: 'wrap'
    },
    fontFamilyFormats: {
        type: String,
        default: TINY_FONT_FAMILY_FORMATS
    },
    fontSizeFormats: {
        type: String,
        default: TINY_FONT_SIZE_FORMATS
    }
})

const tinyinit = ref({
    selector: '#{props.editorid}',
    height: '100%',
    resize: false, // 不允许用户调整大小
    language: 'zh_CN', // 汉化
    branding: false, // 隐藏tinymce右下角水印
    convert_urls: false, // 不自动转换链接地址
    plugins: props.plugins, // 插件
    contextmenu: '', // 上下文菜单
    menubar: false, // 菜单栏
    toolbar_mode: props.toolbarMode, // 工具栏多行显示样式
    toolbar: props.toolbar, // 工具栏
    font_family_formats: props.fontFamilyFormats, // 字体选择
    font_size_formats: props.fontSizeFormats, // 字号选择
    // 自定义图片上传
    images_upload_handler: async (blobInfo: { blob: () => any }) => {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await componentPublishApi.requestUploadDist({
                    file: blobInfo.blob(),
                    data: { upFileType: 'image' }
                }).catch(() => {
                    message.error('上传失败！')
                    return false
                })
                resolve(getImagePath(res.result.filePath))
            } catch (err) {
                reject(err)
            }
        })
    }
})

const emit = defineEmits(['update:modelValue'])

// 双向绑定
const tinycontent = computed({
    get(): string {
        return props.modelValue
    },
    set(value) {
        emit('update:modelValue', value)
    }
})
</script>
<style scoped>
</style>

function uploadFile(formData: FormData) {
  throw new Error('Function not implemented.')
}
