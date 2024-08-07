<template>
    <div class="component-package-manage-list">
        <ManageListHeader title="公告管理" btn-text="发布公告" :on-btn-click="handleHeaderBtnClick" />
        <div class="content">
            <div class="search-bar">
                <ManageListSearch :on-search="handleSearchBarSearch" :on-reset="handleSearchBarReset" />
            </div>
            <a-spin :spinning="state.loading">
                <template v-if="state.list && state.list.length">
                    <div class="list">
                        <template v-for="item, index in state.list" :key="index">
                            <ManageListCard
                                componentName="公告"
                                :showCoverImg="false"
                                :showContent="false"
                                objectIdName="MD5"
                                :image="item.coverPath"
                                :title="item.title"
                                :status="item.status"
                                :objectId="item.fileMd5"
                                :time="item.updateTime || item.createTime"
                                :codeLangue="item.comLangue"
                                :open="item.publishOpen"
                                :range="item.publishRangeName"
                                :readNumber="item.readNumber"
                                :praiseNumber="item.praiseNumber"
                                :commentNumber="item.commentNumber"
                                :collectNumber="item.collectNumber"
                                :type="item.levelType==0?'一般':item.levelType==1?'重要':'紧急'"
                                :type-class="item.levelType==0?'':item.levelType==1?'yellow':'red'"
                                :tags="item.tags"
                                :on-click="() => handleCardClick(item)"
                                :on-edit-click="() => handleEditClick(item)"
                                :on-copy-click="() => handleCopyClick(item)"
                                :on-view-click="() => handleViewClick(item)"
                                :on-delete-click="() => handleDeleteClick(item)"
                            />
                        </template>
                    </div>
                    <div style="text-align: center;margin: 20px 0;">
                        <a-pagination
                            v-model:current="state.pageNo"
                            v-model:page-size="state.pageSize"
                            show-size-changer
                            :total="state.total"
                            @change="handlePageChange"
                        />
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
import { useHomePageApi, componentPublishApi, resourcePublish, coreApi } from '@/apis'
import { message, Modal } from 'ant-design-vue'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import { baseURL } from '@/plugins/axios'
const router = useRouter()
const state = reactive<any>({
    list: [],
    loading: false,
    pageNo: 1,
    pageSize: 10,
    searchParams: {},
    total: 0
})

onMounted(() => {
    getList()
})

const getList = () => {
    state.loading = true
    const params = {
        pageNo: state.pageNo,
        pageSize: state.pageSize,
        ...state.searchParams
    }
    resourcePublish.getMyNoticeList(params).then((res: any) => {
        if (res.success) {
            state.total = res.result.total
            state.list = res.result.records
        } else {
            message.error(res.message || '获取列表失败！')
        }
        state.loading = false
    }).catch(() => {
        message.error('请求失败！')
        state.loading = false
    })
}
const handleHeaderBtnClick = () => {
    window.open('/noticePublish')
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
const handleCardClick = (data: any) => {
    window.open(`/noticeDetail?id=${data.id}`)
}
const handleEditClick = (data: any) => {
    window.open(`/noticePublish?id=${data.id}`)
}
const handleCopyClick = (data: any) => {
    const url = `/noticeDetail?id=${data.id}`
    copyToBoard(url)
    message.success('复制成功！')
}
const handleViewClick = (data: any) => {
    window.open(`/noticeDetail?id=${data.id}`)
}
const handleDeleteClick = async (data: any) => {
    const title = '确定要删除当前公告吗？'
    const content = ''
    const answer = await showConfirm(title, content)
    if (answer) {
        state.loading = true
        resourcePublish.requestDeleteChangeNotice({ ids: data.id }).then((res) => {
            if (res.success) {
                message.success('删除成功！')
                getList()
            } else {
                state.loading = false
                message.error(res.message || '删除失败！')
            }
        }).catch(() => {
            message.error('请求失败！')
            state.loading = false
        })
    }
}
const handlePreviewComponent = (data: any) => {
    window.open(baseURL + data.imgPath, '_blank')
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
</script>

<style lang="scss" scoped>
.component-package-manage-list {
    // margin: 20px auto;
    min-height: 660px;
    background: #FFF;
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
}
</style>
