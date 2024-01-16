<template>
    <a-modal
        destroy-on-close
        width="1000px"
        centered
        :visible="visible"
        :mask-closable="false"
        :body-style="{padding: '14px'}"
        title="成员管理"
        @cancel="handleClose"
    >
        <template #default>
            <div class="flex" style="margin-bottom: 10px;">
                <div class="flex-1" style="padding: 0 10px;">
                    <a-select
                        v-model:value="state.userType"
                        placeholder="请选择成员类型"
                        :options="orgMemberTypeSelectData"
                        style="width: 100%"
                    />
                </div>
                <div class="flex-1" style="padding: 0 10px;">
                    <a-select
                        v-model:value="state.checkStatus"
                        placeholder="请选择成员状态"
                        :options="orgMemberStatusSelectData"
                        style="width: 100%"
                    />
                </div>
                <div class="flex-1" style="padding: 0 10px;">
                    <a-input v-model:value="state.searchTxt" placeholder="请输入关键词" />
                </div>
                <div class="flex-1" style="padding: 0 10px;">
                    <a-button style="margin-right: 10px;" @click="handleReset">重置</a-button>
                    <a-button type="primary" @click="handleSearch">搜索</a-button>
                </div>
            </div>
            <a-spin :spinning="state.loading">
                <template v-if="state.list && state.list.length">
                    <div class="list">
                        <template v-for="item, index in state.list" :key="index">
                            <IOrgMemberBox
                                :data="item"
                                :jobs="state.jobInfo"
                                :userType="!!isAdmin ? isAdmin.userType : 0"
                                @handle-delete="handleDelete"
                                @handle-check="handleCheck"
                                @handle-change-type="handleChangeType"
                            />
                        </template>
                    </div>
                    <div style="text-align: center;margin-top: 10px;">
                        <a-pagination
                            v-model:current="state.pageNo"
                            v-model:page-size="state.pageSize"
                            size="small"
                            show-size-changer
                            :total="state.total"
                            @change="handlePageChange"
                        />
                    </div>
                </template>
                <a-empty v-else />
            </a-spin>
        </template>
        <template #footer>
            <div style="float: left;line-height: 32px;">共 <span style="font-size: 18px;">{{ state.total }}</span> 个成员</div>
            <a-button key="back" @click="handleClose">关闭</a-button>
        </template>
    </a-modal>
</template>

<script lang="ts" setup>
import { message } from 'ant-design-vue'
import { coreApi, useOrgAboutApi } from '@/apis'
import { orgMemberTypeSelectData, orgMemberStatusSelectData } from './mock/mockData'
import { useUserStore } from '@/store/modules/user'
const userStore = useUserStore()
const props = defineProps({
    visible: {
        type: Boolean,
        default: false
    },
    itemData: {
        type: Object,
        default: () => ({})
    }
})
const state = reactive<{ [x: string]: any }>({
    list: [],
    loading: false,
    pageNo: 1,
    pageSize: 5,
    total: 0,
    searchTxt: '',
    userType: null,
    checkStatus: null,
    jobInfo: []
})
const isAdmin = computed(() => props.itemData.userInfoModels?.find((item: any) => item.id === userStore.userInfo?.id))
const emits = defineEmits(['update:visible'])

const handleClose = () => {
    emits('update:visible', false)
}
const getList = () => {
    state.loading = true
    const params = {
        orgId: props.itemData.id,
        pageNo: state.pageNo,
        pageSize: state.pageSize,
        searchTxt: state.searchTxt,
        userType: state.userType,
        checkStatus: state.checkStatus
    }
    useOrgAboutApi.requestGetOrgUserList(params).then((res: any) => {
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
const handlePageChange = () => {
    getList()
}
const handleSearch = () => {
    getList()
}
const handleReset = () => {
    state.pageNo = 1
    state.userType = null
    state.checkStatus = null
    state.searchTxt = ''
    getList()
}
const getJobInfo = () => {
    coreApi.requestWebInfoListByGroup({ groupCd: 'job' }).then((res: any) => {
        if (res.success) {
            state.jobInfo = res.result
        }
    })
}
const handleDelete = async (data: any) => {
    state.loading = true
    const res = await useOrgAboutApi.requestRemoveOrgUser({ orgUserId: data.id })
    if (res.success) {
        message.success('移除成功！')
        getList()
    } else {
        state.loading = false
        message.error(res.message || '移除失败！')
    }
}
const handleCheck = async (data: any, check: number) => {
    state.loading = true
    const res = await useOrgAboutApi.requestApproveJoinOrgAdminList({ checkStatus: check, orgUserId: data.id })
    if (res.success) {
        message.success(check === 1 ? '已通过！' : '已拒绝！')
        getList()
    } else {
        state.loading = false
        message.error(res.message || '操作失败！')
    }
}
const handleChangeType = async (data: any, type: number) => {
    state.loading = true
    const res = await useOrgAboutApi.requestChangeOrgUserType({ orgUserId: data.id, type })
    if (res.success) {
        message.success('设置成功！')
        getList()
    } else {
        state.loading = false
        message.error(res.message || '操作失败！')
    }
}

watch(() => props.visible, () => {
    if (props.visible) {
        getList()
        getJobInfo()
    }
}, { immediate: true, deep: true })
</script>
<style lang="scss" scoped>
.list {
    max-height: 510px;
    overflow: auto;
}
</style>
