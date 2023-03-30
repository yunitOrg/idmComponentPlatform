<template>
    <IFilterCondition :conditionList="pageData.conditionList" :titleInfo="conditionTitle" @searchChange="searchChange"></IFilterCondition>
    <IPagenationContainer :total="pageData.total" :pageSize="pageData.searchParams.pageSize" @searchChange="searchChange">
        <template #list>
            <ARow :gutter="[20, 20]">
                <ACol v-for="(item, index) in pageData.records" :key="index" :span="12">
                    <IComponentPackageBox :componentProps="item" />
                </ACol>
            </ARow>
        </template>
    </IPagenationContainer>
</template>

<script lang="ts" setup>
import { codeImage } from '@/assets/images'
import { useHomePageApi, coreApi, useHomeCoreApi } from '@/apis'
import { defaultSettings } from '@/settings/defaultSetting'
const fileterMap = ['langue', 'codepackageTags']
const conditionTitle = {
    image: codeImage,
    title: '全部组件包',
    subTitle: '海量组件包拿走不谢',
    placeholder: '搜索感兴趣的组件代码包'
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
    useHomePageApi.requestHomeGetCodePackageList(pageData.searchParams).then((res) => {
        if (res.success) {
            pageData.total = res.result.total
            pageData.records = res.result.records
        }
    })
}
handleSearch()
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
                text: defaultSettings.yunitName,
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
</script>
