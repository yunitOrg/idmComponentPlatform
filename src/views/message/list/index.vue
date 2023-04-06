<template>
    <div class="flex justify-between align-center" style="margin: 0 0 15px 0">
        <a-input v-model:value="pageData.searchTxt" style="width: 300px; border-radius: 50px" placeholder="消息关键字搜索">
            <template #suffix>
                <svg-icon iconClass="search" style="color: #aaa8a8; font-size: 20px"></svg-icon>
            </template>
        </a-input>
        <span class="clear-text cursor-pointer" @click="setAllRead">全部已读</span>
    </div>
    <AllMessage size="normal" showLocation="messagePage" :message-list="pageData.result.records" @updateMessage="updateMessage"></AllMessage>
    <a-empty v-if="!pageData.isFirst && pageData.result && pageData.result.records && pageData.result.records.length === 0" description="暂无消息" />
    <div class="text-center" style="margin: 10px 0 0 0">
        <a-pagination v-model:current="pageData.pageConfig.pageNo" :defaultPageSize="pageData.pageConfig.pageSize" :total="pageData.result.total" show-less-items />
    </div>
</template>

<script lang="ts" setup>
import AllMessage from './AllMessage.vue'
import { useUserApi } from '@/apis'
import { useUserStore } from '@/store/modules/user'
const userStore = useUserStore()
interface PageData {
    pageConfig: {
        pageNo: number
        pageSize: number
    }
    result: {
        records: Array<MessageData>
        total: number
    }
    msgTypes: string
    searchTxt: string
    isFirst: boolean
}
const pageData = reactive<PageData>({
    pageConfig: {
        pageSize: 20,
        pageNo: 1
    },
    result: {
        records: [],
        total: 0
    },
    msgTypes: '',
    searchTxt: '',
    isFirst: true
})
const handleFetchMessageList = () => {
    useUserApi
        .requestMyMessageList({
            ...pageData.pageConfig,
            msgTypes: pageData.msgTypes,
            searchTxt: pageData.searchTxt
        })
        .then((res) => {
            if (res.success) {
                pageData.result = res.result
                pageData.isFirst = false
            }
        })
}
const route = useRoute()
const setAllRead = () => {
    useUserApi
        .requestSetMyMessageRead({
            msgIds: ''
        })
        .then((res) => {
            if (res.success) {
                userStore.handleGetUserInfo()
                handleFetchMessageList()
            }
        })
}

watch(
    () => route.query.type,
    (newV) => {
        if (newV !== undefined) pageData.msgTypes = newV as string
        else pageData.msgTypes = ''

        handleFetchMessageList()
    },
    {
        immediate: true
    }
)
const updateMessage = (index: number) => {
    pageData.result.records[index].readStatus = 1
    userStore.handleGetUserInfo()
}
</script>

<style lang="scss" scoped>
.clear-text {
    color: #40a9ff;
}
</style>
