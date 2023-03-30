<template>
    <IFilterCondition :conditionList="pageData.conditionList" :titleInfo="conditionTitle" @searchChange="searchChange"></IFilterCondition>
    <IPagenationContainer :total="pageData.total" :pageSize="pageData.searchParams.pageSize" @searchChange="searchChange">
        <template #list>
            <ARow :gutter="[20, 20]">
                <ACol v-for="(item, index) in pageData.records" :key="index" :span="5">
                    <IComponentMarketBox :componentProps="item" />
                </ACol>
            </ARow>
        </template>
    </IPagenationContainer>
</template>

<script lang="ts" setup>
import { componentImage } from '@/assets/images'
import { useHomePageApi, coreApi, useHomeCoreApi } from '@/apis'
const fileterMap = ['langue', 'componentTags']

const conditionTitle = {
    image: componentImage,
    title: '组件市场',
    subTitle: '分享组件是一种美德',
    placeholder: '搜索感兴趣的组件'
}
const pageData = reactive<{ [x: string]: any }>({
    total: 0,
    records: [],
    searchParams: {
        pageNo: 1,
        pageSize: 20,
        sort: 0
    },
    conditionList: []
})
const searchChange = (e: any = {}) => {
    pageData.searchParams = { ...pageData.searchParams, ...e }
    handleSearch()
}
const handleSearch = () => {
    useHomePageApi.requestHomeGetComponentList(pageData.searchParams).then((res) => {
        if (res.success) {
            pageData.total = res.result.total
            pageData.records = res.result.records
        }
    })
}
Promise.all([
    ...fileterMap.map((el) =>
        coreApi.requestWebInfoListByGroup({
            groupCd: el
        })
    ),
    useHomeCoreApi.requestCoreMyOrgList()
]).then((res) => {
    const list = fileterMap.map((el, index) => ({
        defaultOptionNumber: index === 0 ? 15 : 18,
        conditionName: index === 0 ? '语言' : '标签',
        conditionKey: index === 0 ? 'language' : 'tag',
        showAllOption: true,
        allOptionName: '全部',
        resData: res[index].result.map((el: any) => ({
            text: el.itemCd,
            value: el.itemValue
        }))
    }))
    const item3 = {
        defaultOptionNumber: 10,
        conditionName: '范围',
        showAllOption: true,
        allOptionName: '全部',
        conditionKey: 'rang',
        resData: [
            {
                text: '云IT·社区',
                value: '0'
            }
        ]
    }
    if (res[2].result && res[2].result.length > 0) {
        item3.resData = [
            ...item3.resData,
            ...res[2].result.map((el: any) => ({
                text: el.orgname,
                value: el.id
            }))
        ]
    }
    pageData.conditionList = [...list, item3]
})

handleSearch()
</script>

<style lang="scss" scoped>
::v-deep(.ant-col-5) {
    display: block;
    flex: 0 0 20%;
    max-width: 20%;
}
</style>
