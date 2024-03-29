<template>
    <div class="imagetext-mdedit-header">
        <div class="back-title" @click="() => router.push(`/creativeCenter/courseManageList?type=1`)">
            <LeftOutlined />
            <span>教程管理</span>
        </div>
        <a-input v-model:value="state.formData.title" size="large" show-count :maxlength="100" />
        <a-button key="back" size="large" @click="onFinish(0)">保存草稿</a-button>
        <a-button key="submit" size="large" type="primary" @click="onFinish(1)">发布教程</a-button>
        <a-avatar :size="40" class="cursor-pointer header-avatar" :src="getImagePath(userStore.userInfo && userStore.userInfo.userphoto) || defaultSettings.userphoto" />
    </div>
    <v-md-editor
        v-model:model-value="state.formData.articleContent"
        height="calc(100vh - 70px)"
        toc-nav-position-right
        :toolbar="customToolbarConfig"
        left-toolbar="undo redo clear | h bold italic strikethrough quote | ul ol table hr | link image code | import export | template"
        :disabled-menus="[]"
        @upload-image="handleUploadImage" />
    <input id="openFile" type="file" accept=".md" style="display: none" />
    <a-modal
        v-model:visible="modal.visiable"
        width="800px"
        cancelText="取消"
        okText="添加到正文"
        :okButtonProps="{
            danger: true,
            disabled: !modal.activeId
        }"
        @ok="modalHandleOk">
        <template #title>
            <div class="imagetext-mdedit-modal-title">
                <span :class="{ active: modal.activeTab === 0 }" @click="hanldeModalHeaderClick(0)">模板库</span>
                <span :class="{ active: modal.activeTab === 1 }" @click="hanldeModalHeaderClick(1)">我的模板</span>
            </div>
        </template>
        <a-list class="imagetext-mdedit-template-list" :loading="modal.loading" :data-source="modal.templateList" item-layout="horizontal">
            <template #loadMore>
                <div v-if="!modal.loading && !modal.loadFinish" :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }">
                    <a-button @click="getTemplateList">加载更多</a-button>
                </div>
            </template>
            <template #renderItem="{ item }">
                <div class="template-item" @click="() => (modal.activeId = item.id)">
                    <div class="template-item-tit">{{ item.title }}</div>
                    <img :src="getImagePath(item.coverUrl) || defaultCatalog" />
                    <div class="template-item-time">更新于 {{ item.createTime }}</div>
                    <div v-show="modal.activeId === item.id" class="template-mask"><CheckOutlined style="font-size: 80px; color: #fff" /></div>
                </div>
            </template>
        </a-list>
    </a-modal>
</template>
<script lang="ts" setup>
import { getImagePath, downloadFile } from '@/utils'
import { LeftOutlined, CheckOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { useUserStore } from '@/store/modules/user'
import { defaultSettings } from '@/settings/defaultSetting'
import { defaultCatalog } from '@/assets/images'
import { useCourseApi, componentPublishApi } from '@/apis'
const route = useRoute()
const router = useRouter()
const modal = reactive({
    visiable: false,
    activeTab: 0,
    activeId: '',
    initLoading: true,
    loading: false,
    loadFinish: false,
    templateList: [] as any,
    templateEditer: null as any,
    pageSize: 10,
    pageIndex: 1
})
const customToolbarConfig = {
    template: {
        title: '模板',
        icon: 'iconfont icon-moban',
        action: (editer: any) => {
            modal.visiable = true
            modal.templateEditer = editer
            modal.pageIndex = 1
            modal.templateList = []
            modal.loadFinish = false
            getTemplateList()
        }
    },
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

const getTemplateList = async () => {
    modal.loading = true
    const res = await useCourseApi
        .requestGetCourseTemplateList({
            mydata: modal.activeTab,
            pageNo: modal.pageIndex,
            pageSize: modal.pageSize
        })
        .catch(() => {
            message.error('获取失败！')
        })
    modal.loading = false
    if (res.success) {
        modal.pageIndex++
        if (res.result.records.length < modal.pageSize) {
            modal.loadFinish = true
        }

        modal.templateList = [
            ...modal.templateList,
            ...res.result.records
        ]
        modal.activeId = modal.templateList?.[0]?.id
    } else {
        message.error('插入失败！')
    }
}
const hanldeModalHeaderClick = (active: any) => {
    modal.activeTab = active
    modal.activeId = ''
    modal.pageIndex = 1
    modal.templateList = []
    modal.loadFinish = false
    getTemplateList()
}

const state = reactive({
    courseId: route.query?.courseId,
    modalVisible: false,
    formData: {
        articleContent: '',
        title: ''
    }
})

onMounted(() => {
    state.courseId && getDistinfo()
})

const userStore = useUserStore()

function modalHandleOk() {
    let template = ''
    modal.templateList.forEach((item: any) => {
        if (item.id === modal.activeId) template = item.content
    })
    modal.templateEditer?.insert((selected: any) => {
        return {
            // 要插入的文本
            text: template,
            // 插入后要选中的文本
            selected
        }
    })
    modal.visiable = false
}

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
    const res = await useCourseApi.requestGetCourseDetail({ courseId: state.courseId })
    if (res.success) {
        state.formData = {
            ...state.formData,
            ...res.result,
            ...res.result.courseInfo,
            articleContent: res.result.courseInfo.articleContent || ''
        }
    } else {
        message.error('获取教程信息失败！')
    }
}
const onFinish = async (status: number) => {
    const params = {
        ...state.formData,
        status
    }
    console.log(params)
    const res = await useCourseApi.requestCourseSave(params)
    if (res.success) {
        message.success(status ? '发布成功' : '保存草稿成功')
        router.push('/creativeCenter/courseManageList?type=1')
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
    min-height: 40vh;
    max-height: 60vh;
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
    .ant-list-items {
        display: flex;
        flex-wrap: wrap;
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
        height: 280px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
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
