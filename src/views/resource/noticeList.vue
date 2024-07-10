<template>
    <IFilterCondition :conditionList="pageData.conditionList" :titleInfo="conditionTitle" @searchChange="searchChange">
    </IFilterCondition>
    <IPagenationContainer :total="pageData.total" :pageSize="pageData.searchParams.pageSize" @searchChange="searchChange">
        <template #list>
            <ARow :gutter="[20, 20]">
                <ACol v-for="(item, index) in pageData.records" :key="index" :span="12">
                    <INoticeBox :componentProps="item" :bottomShowTime="true" :on-preview-component-click="() => handlePreviewComponent(item) " />
                </ACol>
            </ARow>
        </template>
    </IPagenationContainer>
    <a-modal
        v-model:visible="pageData.visible"
        destroyOnClose
        wrapClassName="notice-modal"
        width="1200px"
        title="公告详情"
        :footer="null">
        <div class="notice-title">
            {{ pageData.showModalItem.title }}
        </div>
        <div class="notice-sub-title flex justify-center" style="gap: 60px;">
            <div>来源：<a-avatar :size="15" :src="getImagePath(pageData.showModalItem.userPhoto) || defaultSettings.userphoto" /> {{pageData.showModalItem.userNickname}}</div>
            <div>组织：{{pageData.showModalItem.publishRangeName || defaultSettings.yunitName}}</div>
            <div>发布时间：{{pageData.showModalItem.createTime}}</div>
            <div v-if="pageData.showModalItem.updateTime">更新时间：{{pageData.showModalItem.updateTime}}</div>
        </div>
        <div class="notice-content" v-html="pageData.showModalItem.content">
        </div>
    </a-modal>
</template>

<script lang="ts" setup>
import { noticeImage } from '@/assets/images'
import { useHomePageApi, coreApi, useHomeCoreApi } from '@/apis'
import { defaultSettings } from '@/settings/defaultSetting'
import { baseURL } from '@/plugins/axios'
import { getImagePath } from '@/utils'
const conditionTitle = {
    image: noticeImage,
    title: '公告',
    subTitle: '想告诉大家的就大胆的发表出来！',
    placeholder: '搜索感兴趣的公告'
}
const pageData = reactive<{ [x: string]: any }>({
    total: 0,
    records: [],
    searchParams: {
        pageNo: 1,
        pageSize: 20,
        sort: 0
    },
    conditionList: [],
    visible: false,
    showModalItem: {}

})
const searchChange = (e: any = {}) => {
    pageData.searchParams = { ...pageData.searchParams, ...e }
    handleSearch()
}
const handleSearch = () => {
    useHomePageApi.requestHomeGetNoticeList(pageData.searchParams).then((res) => {
        if (res.success) {
            pageData.total = res.result.total
            pageData.records = res.result.records
        }
    })
}
const handlePreviewComponent = (data: any) => {
    if (data.id) {
        pageData.visible = true
        pageData.showModalItem = data
    }
}
handleSearch()
Promise.all([
    useHomeCoreApi.requestCoreMyOrgList()
]).then((res) => {
    const item1 = {
        defaultOptionNumber: 11,
        conditionName: '类型',
        showAllOption: true,
        allOptionName: '全部',
        conditionKey: 'type',
        resData: [
            {
                text: '紧急',
                value: '2'
            },
            {
                text: '重要',
                value: '1'
            },
            {
                text: '一般',
                value: '0'
            }
        ]
    }
    const item3 = {
        defaultOptionNumber: 11,
        conditionName: '范围',
        showAllOption: true,
        allOptionName: '全部',
        conditionKey: 'rang',
        resData: [
            {
                text: defaultSettings.yunitName,
                value: '0'
            }
        ]
    }
    if (res[0].result && res[0].result.length > 0) {
        item3.resData = [
            ...item3.resData,
            ...res[0].result.map((el: any) => ({
                text: el.orgname,
                value: el.id
            }))
        ]
    }
    pageData.conditionList = [item1, item3]
})
</script>

<style lang="scss">
.notice-modal{
   .notice-title{
        font-size: 30px;
        color: #333;
        margin-bottom: 20px;
        text-align: center;
        font-weight: 700;
    }
    .notice-sub-title{
        font-size: 14px;
        color: #999;
        margin-bottom: 20px;
        text-align: center;
        border-bottom: 1px solid #eee;
        padding-bottom: 20px;
    }
   .notice-content{
        // font-size: 14px;
        // color: #666;
        // line-height: 24px;
        // margin-bottom: 20px;
        padding: 10px 20px;
    }
}
</style>
