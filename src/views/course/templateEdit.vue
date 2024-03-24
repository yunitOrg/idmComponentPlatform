<template>
    <div class="imagetext-mdedit-header">
        <div class="back-title" @click="() => router.push(`/creativeCenter/templateManageList`)">
            <LeftOutlined />
            <span>返回</span>
        </div>
        <a-input v-model:value="state.formData.title" :disabled="state.isPreview" size="large" show-count :maxlength="100" placeholder="输入模板名称" />
        <a-button size="large" @click="() => modal.visiable = true">维护模板信息</a-button>
        <a-button key="submit" size="large" type="primary" :disabled="state.isPreview" @click="onFinish">保存模板</a-button>
    </div>
    <v-md-editor
        v-if="!state.isPreview"
        v-model:model-value="state.formData.content"
        readOnly
        height="calc(100vh - 70px)"
        toc-nav-position-right
        :toolbar="customToolbarConfig"
        left-toolbar="undo redo clear | h bold italic strikethrough quote | ul ol table hr | link image code | import export "
        :disabled-menus="[]"
        @upload-image="handleUploadImage" />
    <v-md-preview v-else ref="preview" :text="state.formData.content"></v-md-preview>
    <input id="openFile" type="file" accept=".md" style="display: none" />
    <a-modal
        v-model:visible="modal.visiable"
        width="550px"
        cancelText="取消"
        okText="确认"
        :okButtonProps="{
            type: 'primary'
        }"
        @ok="() => modal.visiable = false">
        <template #title>
            <div class="imagetext-mdedit-modal-title">
                <span>模板信息</span>
            </div>
        </template>
        <AForm
            ref="formRef"
            class="dist-form"
            name="dist_info"
            :model="state.formData"
            :label-col="{ span: 6 }"
            :wrapper-col="{ span: 16 }">
            <a-form-item name="id" hidden />
            <a-form-item name="status" hidden />
            <a-form-item name="coverUrl" label="封面">
                <IImageUpload v-model:value="state.formData.coverUrl" :disabled="state.isPreview" :paramsData="{ upFileType: 'image' }" />
            </a-form-item>
            <a-form-item name="isopen" label="是否公开" :rules="[{ required: true, message: '必填!' }]">
                <a-switch v-model:checked="state.formData.isopen" :disabled="state.isPreview" :checkedValue="1" :unCheckedValue="0" />
            </a-form-item>
        </AForm>
    </a-modal>
</template>
<script lang="ts" setup>
import { getImagePath, downloadFile } from '@/utils'
import { LeftOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { useCourseApi, componentPublishApi } from '@/apis'
import { useUserStore } from '@/store/modules/user'
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const userInfo = userStore.userInfo || { id: 0 }
const modal = reactive({
    visiable: true,
    activeTab: 0,
    activeId: '101',
    templateList: [
        {
            id: '101',
            title: '学习计划模板实例',
            imgSrc: '',
            updateTime: '08月13日'
        },
        {
            id: '102',
            title: '系列文章模板',
            imgSrc: '',
            updateTime: '08月13日'
        },
        {
            id: '103',
            title: 'bug记录模板',
            imgSrc: '',
            updateTime: '08月13日'
        }
    ]
})
const customToolbarConfig = {
    export: {
        title: '导出',
        icon: 'iconfont icon-daochu',
        action: (editor: any) => {
            const title = (editor.titles.length && `${editor.titles?.[0]?.title}.md`) || '下载.md'
            const blob = new Blob([editor.text], { type: 'text/plain;charset=utf-8' })
            downloadFile(blob, title)
        }
    },
    import: {
        title: '导入(仅支持md格式文件)',
        icon: 'iconfont icon-daoru',
        action: (editor: any) => {
            const openFile = document.getElementById('openFile')
            if (openFile) {
                openFile.click()
                openFile.addEventListener('change', (e: any) => {
                    const selectedFile = e.target.files[0]
                    const reader = new FileReader()
                    reader.readAsText(selectedFile)
                    reader.onload = () => {
                        editor.insert((selected: any) => {
                            return {
                                // 要插入的文本
                                text: reader.result,
                                // 插入后要选中的文本
                                selected
                            }
                        })
                    }
                })
            }
        }
    }
}
const state = reactive({
    templateId: route.query?.templateId,
    isPreview: route.query?.isPreview as any,
    formData: {
        content: '',
        coverUrl: [] as any,
        isopen: 0,
        userId: userInfo.id,
        title: ''
    }
})

onMounted(() => {
    state.templateId && getDistinfo()
})

const handleUploadImage = async (event: any, insertImage: any, files: any) => {
    console.log(files)
    const params = {
        file: files[0],
        data: { upFileType: 'image' }
    }
    const res = await componentPublishApi
        .requestUploadDist(params, () => {})
        .catch(() => {
            message.error('插入失败！')
        })
    if (res.success) {
        insertImage({
            url: getImagePath(res.result.filePath),
            desc: res.result.fileName,
            width: 'auto',
            height: 'auto'
        })
    } else {
        message.error('插入失败！')
    }
}

const getDistinfo = async () => {
    const res = await useCourseApi.requestGetMyCourseTempInfo({ courseTempId: state.templateId })
    if (res.success) {
    //     {
    //     name: data.name,
    //     src: '',
    //     // url: '',
    //     width: null,
    //     height: null,
    //     size: null,
    //     status: 'uploading'
    // }
        state.formData = {
            ...res.result,
            coverUrl: [{ src: res.result.coverUrl, status: 'done' }]
        }
    } else {
        message.error('获取教程信息失败！')
    }
}
const onFinish = async () => {
    if (!state.formData.title) {
        return message.error('模板名称不能为空')
    }
    if (!state.formData.content) {
        return message.error('模板内容不能为空')
    }
    const params = {
        ...state.formData,
        coverUrl: state.formData.coverUrl[0].src
    }
    const res = await useCourseApi.requestSaveCircleTemplate(params)
    if (res.success) {
        message.success('保存成功')
        router.push('/creativeCenter/templateManageList')
    } else {
        message.error('发布失败')
    }
}
</script>
<style lang="scss" scoped>
.imagetext-mdedit-header {
    display: flex;
    height: 70px;
    align-items: center;
    padding: 0 20px;
    .back-title {
        white-space: nowrap;
        font-size: 20px;
        margin-right: 10px;
        span {
            margin-right: 10px;
        }
        cursor: pointer;
    }
    .ant-btn {
        margin-left: 20px;
    }
    .header-avatar {
        margin-left: 20px;
    }
}
</style>
<style lang="scss">
.imagetext-mdedit-modal-title {
    text-align: center;
    font-size: 20px;
    font-weight: bold;
    span {
        display: inline-block;
        cursor: pointer;
        margin: 0 20px;
        padding: 10px 0;

        &.active {
            border-bottom: 2px solid #ff4d4f;
        }
    }
}
.imagetext-mdedit-template-list {
    display: flex;
    flex-wrap: wrap;
    height: 40vh;
    overflow-y: auto;
    overflow-x: hidden;
    &::-webkit-scrollbar {
        width: 3px;
        height: 3px;
    }
    &::-webkit-scrollbar-thumb {
        min-height: 28px;
        border-radius: 4px;
        background-color: #cccccc;
    }
    &::-webkit-scrollbar-track-piece,
    &::-webkit-scrollbar-corner {
        background-color: transparent;
    }
    .template-item {
        position: relative;
        width: calc(50% - 20px);
        border: 1px solid #eee;
        padding: 14px 10px;
        margin: 0 10px;
        margin-bottom: 20px;
        border-radius: 5px;
        cursor: pointer;
        .template-item-tit {
            font-size: 16px;
        }
        img {
            width: 100%;
            height: 190px;
        }
        .template-item-time {
            font-size: 14px;
            color: #999;
        }
        .template-mask {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.3);
            z-index: 1;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }
}
</style>
