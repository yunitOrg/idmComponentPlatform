<template>
    <div class="cp-upload" :style="{width: '1200px' }">
        <a-alert :message="`当前正在发布【${ state.uploadTypeCN }】资源，请注意上传对应的资源文件，否则将无法正常发布！！！`" type="warning" show-icon />
        <a-upload-dragger
            class="cp-upload-dragger"
            :accept="state.uploadType!='rimage'?'.zip':'.png,.jpg,.jpeg,.gif,.svg,.webp'"
            multiple
            :disabled="state.uploadDisabled"
            :showUploadList="false"
            :customRequest="handleUpload"
        >
            <p class="ant-upload-drag-icon">
                <inbox-outlined></inbox-outlined>
            </p>
            <p class="ant-upload-text">点击或将文件拖拽到这里上传</p>
            <p class="ant-upload-hint">
                支持单个上传，支持扩展名：{{ state.uploadType!='rimage'?'.zip':'.png,.jpg,.jpeg,.gif,.svg,.webp' }}
            </p>
            <div class="ant-upload-notice">
                注意事项：<br>
                1、只能上传单个页面、模板、业务组件、图片，上传后会自动识别<br>
                2、页面、模板、业务组件均以ID（同一组织内）作为标识判断是否存在，如已存在用则需要有权限才能再次上传更新，反之不能更新<br>
                3、图片则以MD5作为唯一标识判断存在<br>
            </div>
        </a-upload-dragger>
    </div>
</template>

<script lang="ts" setup>
import { reactive, createVNode } from 'vue'
import { AxiosProgressEvent } from 'axios'
import { componentPublishApi, coreApi, useHomeCoreApi } from '@/apis'
import { Modal, message } from 'ant-design-vue'
import { ExclamationCircleOutlined, CheckCircleOutlined, InboxOutlined } from '@ant-design/icons-vue'
const router = useRouter()
const route = useRoute()
const state = reactive<any>({
    distList: [],
    selectedKey: '',
    uploadDisabled: false,
    saveAllLoading: false,
    formDataList: [],
    codeLangueList: [],
    uploadType: route.query?.type,
    uploadTypeCN: ''
})
onMounted(() => {
    state.uploadTypeCN = state.uploadType === 'rimage' ? '图片' : state.uploadType === 'page' ? '页面' : state.uploadType === 'template' ? '模板' : state.uploadType === 'bcomponent' ? '业务组件' : ''
})

const handleUpload = async (data: any) => {
    if (data.file) {
        state.uploadDisabled = true
        const controller = new AbortController()
        const item = reactive({
            name: data.file.name,
            size: (data.file.size / 1024 / 1024).toFixed(2) + 'MB',
            progress: '0',
            loaded: '0MB',
            status: 'active',
            loadDesc: '正在上传',
            codePackageId: `-${data.file.uid}`,
            isNewVersion: true,
            controller
        })
        state.distList.push(item)
        const params = {
            file: data.file,
            data: {
                upFileType: state.uploadType
            }
        }
        const res = await componentPublishApi.requestUploadDist(params, (e) => onProgress(e, item), controller.signal).catch(() => {
            afterUpload({}, item)
            return false
        })
        if (res.success) {
            afterUpload(res.result, item)
        } else {
            showWarning('上传失败', res.message)
        }
    }
}
const afterUpload = async (result: any, item: any) => {
    if (!result.dbId && result.existsLength > 0) {
        showWarning('资源已存在但无权限', '您上传的资源已经存在你的组织中，但是你暂无权限维护该资源，如需要维护权限请联系资源对应的负责人。')
        return
    }
    if (state.uploadType === 'rimage' && !result.isImage) {
        showWarning('上传失败', '您上传的资源不是图片，无法发布')
        return
    }
    if (state.upFileType === 'rimage' && result.dbId) {
        const confirmRes = await showConfirm('您上传的图片已识别到存在相同的图片，确认要继续上传吗？', '', ExclamationCircleOutlined)
        if (!confirmRes) {
            return
        }
        result.dbId = ''
    }

    let routerUrl
    switch (state.uploadType) {
        case 'rimage':
            routerUrl = 'imagePublish'
            break
        case 'page':
            routerUrl = 'pagePublish'
            break
        case 'template':
            routerUrl = 'templatePublish'
            break
        case 'bcomponent':
            routerUrl = 'bcomponentPublish'
            break
    }
    if (routerUrl) {
        router.push({
            name: routerUrl,
            query: {
                fileName: result.fileName,
                filePath: result.filePath,
                fileMD5: result.fileMD5,
                id: result.dbId,
                version: result.version
            }
        })
    }
}
const onProgress = (e: AxiosProgressEvent, item: any) => {
    if (e && e.progress) {
        item.progress = (e.progress * 100).toFixed(0)
        item.loaded = (e.loaded / 1024 / 1024).toFixed(2) + 'MB'
    }
}
const showWarning = (title: string, content: string) => {
    return new Promise((resolve) => {
        Modal.warning({
            title,
            content,
            okText: '知道了',
            onOk() {
                resolve(true)
            }
        })
    })
}
const showConfirm = (title: string, content: string, icon: any, iconColor?: string) => {
    return new Promise((resolve) => {
        Modal.confirm({
            icon: iconColor ? createVNode(icon, { style: { color: iconColor } }) : createVNode(icon),
            title,
            content,
            cancelText: '取消',
            okText: '确定',
            onOk() {
                resolve(true)
            },
            onCancel() {
                resolve(false)
            }
        })
    })
}
</script>

<style lang="scss" scoped>
.cp-upload {
    margin: 20px auto;
    border-radius: 5px;
    margin-top: 60px;
    :deep(.cp-upload-dragger) {
        margin-top: 20px;
        .ant-upload-drag-icon {
            padding-top: 60px;
        }
        .ant-upload-notice {
            text-align: left;
            color: #ff8200;
            padding: 60px 100px;
        }
    }
}
</style>
