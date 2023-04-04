<template>
    <div class="flex justify-between align-center" style="margin: 0 0 15px 0">
        <a-input v-model:value="pageData.searchTxt" style="width: 300px; border-radius: 50px" placeholder="消息关键字搜索">
            <template #suffix>
                <svg-icon iconClass="search" style="color: #aaa8a8; font-size: 20px"></svg-icon>
            </template>
        </a-input>
        <span class="clear-text cursor-pointer">清空所有消息</span>
    </div>
    <div>
        <AboutMe v-if="false"></AboutMe>
        <AllMessage v-if="false"></AllMessage>
        <Praise v-if="false"></Praise>
        <Comment v-if="false"></Comment>
        <Fans v-if="false"></Fans>
        <Invitation v-if="false"></Invitation>
        <Private v-if="false"></Private>
        <System v-if="false"></System>
        <Appreciate v-if="false"></Appreciate>
    </div>

    <div class="text-center" style="margin: 10px 0 0 0">
        <a-pagination v-model:current="pageData.pageConfig.pageNo" :defaultPageSize="pageData.pageConfig.pageSize" :total="pageData.result.total" show-less-items />
    </div>
</template>

<script lang="ts" setup>
import AboutMe from './AboutMe.vue'
import AllMessage from './AllMessage.vue'
import Praise from './Praise.vue'
import Comment from './Comment.vue'
import Fans from './Fans.vue'
import Invitation from './Invitation.vue'
import Private from './Private.vue'
import System from './System.vue'
import Appreciate from './Appreciate.vue'
import { useUserApi } from '@/apis'
const pageData = reactive({
    pageConfig: {
        pageSize: 20,
        pageNo: 1
    },
    result: {
        records: [],
        total: 0
    },
    msgTypes: '',
    searchTxt: ''
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
            }
        })
}
const route = useRoute()

watch(
    () => route.query.type,
    (newV) => {
        if (newV !== undefined) pageData.msgTypes = newV as string

        handleFetchMessageList()
    },
    {
        immediate: true
    }
)
</script>

<style lang="scss" scoped>
.clear-text {
    color: #40a9ff;
}
</style>
