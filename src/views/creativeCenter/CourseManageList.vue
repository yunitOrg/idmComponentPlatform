<template>
    <div class="course-manage-list">
        <!-- <ManageListHeader title="组件管理" btn-text="" :on-btn-click="handleHeaderBtnClick" /> -->
        <div class="course-manage-list-header">
            <a-tabs v-model:activeKey="state.activeTab" size="large" @change="handleTabChange">
                <a-tab-pane key="0" tab="视频教程"></a-tab-pane>
                <a-tab-pane key="1" tab="图文教程"></a-tab-pane>
                <a-tab-pane key="2" tab="电子书"></a-tab-pane>
                <template #rightExtra>
                    <a-button type="primary" shape="round" @click="onBtnClick">{{ btnText }}</a-button>
                </template>
            </a-tabs>
        </div>
        <div class="content">
            <div class="search-bar">
                <ManageListSearch :on-search="handleSearchBarSearch" :on-reset="handleSearchBarReset" />
            </div>
            <a-spin :spinning="state.loading">
                <template v-if="state.list && state.list.length">
                    <div class="list">
                        <template v-for="(item, index) in state.list" :key="index">
                            <ManageListCard
                                :image="item.coverUrl"
                                :imageName="item.codepackageClassname"
                                :typeText="item.type === 0 ? '视频课' : item.type === 1 ? '图文' : '电子书'"
                                :title="item.title"
                                :open="item.publishOpen"
                                :range="item.publishRangeName"
                                :status="item.status"
                                :content="item.introduction"
                                :time="item.updateTime || item.createTime"
                                :readNumber="item.readNumber"
                                :praiseNumber="item.praiseNumber"
                                :commentNumber="item.commentNumber"
                                :collectNumber="item.collectNumber"
                                :tags="item.tags"
                                :on-click="() => handleCardClick(item)"
                                :on-edit-click="() => handleEditClick(item)"
                                :on-copy-click="() => handleCopyClick(item)"
                                :on-view-click="() => handleViewClick(item)"
                                :on-delete-click="() => handleDeleteClick(item)"
                                :on-upload-video-click="item.type === 0 ? () => handleUploadVideo(item) : undefined"
                                :on-edit-markdown-click="item.type === 1 ? () => handleEditMarkDown(item) : undefined"
                            />
                        </template>
                    </div>
                    <div style="text-align: center; margin: 20px 0">
                        <a-pagination v-model:current="state.pageNo" v-model:page-size="state.pageSize" show-size-changer :total="state.total" @change="handlePageChange" />
                    </div>
                </template>
                <a-empty v-else />
            </a-spin>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { createVNode } from 'vue'
import { copyToBoard } from '@/utils/copy'
import { useCourseApi } from '@/apis'
import { message, Modal } from 'ant-design-vue'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import { useUserStore } from '@/store/modules/user'
const route = useRoute()
const state = reactive<any>({
    activeTab: route.query?.type || '0',
    list: [],
    loading: false,
    pageNo: 1,
    pageSize: 10,
    searchParams: {},
    total: 0
})

const btnText = computed(() => {
    return state.activeTab === '0' ? '上传视频教程' : state.activeTab === '1' ? '发布图文教程' : '发布电子书'
})

onMounted(() => {
    getList()
})

const userStore = useUserStore()
const userInfo = userStore.userInfo || { id: 0 }
const getList = () => {
    state.loading = true
    const params = {
        pageNo: state.pageNo,
        pageSize: state.pageSize,
        userId: userInfo.id,
        type: Number(state.activeTab),
        myData: 1,
        ...state.searchParams
    }
    useCourseApi
        .requestGetCourseList(params)
        .then((res: any) => {
            if (res.success) {
                state.total = res.result.total
                state.list = res.result.records
            } else {
                message.error(res.message || '获取列表失败！')
            }
            state.loading = false
        })
        .catch(() => {
            message.error('请求失败！')
            state.loading = false
        })
}
const handleSearchBarSearch = (params: any) => {
    const month = params.date ? params.date.month() + 1 + '' : ''
    const year = params.date ? params.date.year() : ''
    state.searchParams = {
        year,
        month: month.length === 1 ? '0' + month : month,
        rang: params.range,
        searchTxt: params.keyWord
    }
    getList()
}
const handleSearchBarReset = (params: any) => {
    state.searchParams = params
    getList()
}
const handlePageChange = () => {
    getList()
}
const getTypeText = (type: number) => {
    return type === 0 ? 'video' : type === 1 ? 'imageText' : 'eBook'
}
const handleCardClick = (data: any) => {
    window.open(`/${getTypeText(data.type)}Detail?courseId=${data.id}`)
}
const handleEditClick = (data: any) => {
    window.open(`/${getTypeText(data.type)}CoursePublish?courseId=${data.id}`)
}
const handleCopyClick = (data: any) => {
    const url = `/${getTypeText(data.type)}Detail?courseId=${data.id}`
    copyToBoard(url)
    message.success('复制成功！')
}
const handleViewClick = (data: any) => {
    window.open(`/${getTypeText(data.type)}Detail?courseId=${data.id}`)
}
const handleDeleteClick = async (data: any) => {
    const title = '确定要删除当前教程吗？'
    const content = ''
    const answer = await showConfirm(title, content)
    if (answer) {
        state.loading = true
        useCourseApi
            .requestCourseDeleteBatch({ ids: data.id })
            .then((res) => {
                if (res.success) {
                    message.success('删除成功！')
                    getList()
                } else {
                    state.loading = false
                    message.error(res.message || '删除失败！')
                }
            })
            .catch(() => {
                message.error('请求失败！')
                state.loading = false
            })
    }
}
const showConfirm = (title: string, content: string) => {
    return new Promise((resolve) => {
        Modal.confirm({
            icon: createVNode(ExclamationCircleOutlined),
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
const onBtnClick = () => {
    window.open(`/${state.activeTab === '0' ? 'video' : state.activeTab === '1' ? 'imageText' : 'eBook'}CoursePublish`)
}
const handleUploadVideo = (data: any) => {
    window.open(`/videoCourseEdit?courseId=${data.id}`)
}
const handleEditMarkDown = (data: any) => {
    window.open(`/imageTextMdEdit?courseId=${data.id}`)
}
const handleTabChange = () => {
    getList()
}
</script>

<style lang="scss" scoped>
.course-manage-list {
    // margin: 20px auto;
    min-height: 660px;
    background: #fff;
    border-radius: 5px;
    box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.06);
    .content {
        padding: 20px;
        .list {
            margin: 20px 0;
        }
        :deep(.ant-empty-image) {
            margin-top: 150px;
        }
    }
    .course-manage-list-header {
        :deep(.ant-tabs-nav) {
            padding: 0 20px;
            margin: 0;
        }
    }
}
</style>
