<template>
    <IFilterCondition :conditionList="pageData.conditionList" :titleInfo="conditionTitle" @searchChange="searchChange"></IFilterCondition>
    <IPagenationContainer :total="pageData.total" :pageSize="pageData.searchParams.pageSize" @searchChange="searchChange">
        <template #list>
            <ARow :gutter="[20, 20]">
                <ACol v-for="item in pageData.records" :key="item" :span="5">
                    <ISchoolBox :componentProps="item" />
                </ACol>
            </ARow>
        </template>
    </IPagenationContainer>
</template>

<script lang="ts" setup>
import { schoolImage } from '@/assets/images'
import { useCourseApi, coreApi, useHomeCoreApi } from '@/apis'
import { defaultSettings } from '@/settings/defaultSetting'
const fileterMap = ['course']

const conditionTitle = {
    image: schoolImage,
    title: 'i学院',
    subTitle: '畅学海量高品质教程',
    placeholder: '搜索感兴趣的教程'
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
const handleSearch = () => {
    useCourseApi.requestGetCourseList(pageData.searchParams).then((res) => {
        if (res.success) {
            pageData.total = res.result.total
            pageData.records = res.result.records
        }
    })
}
handleSearch()
const searchChange = (e: any = {}) => {
    pageData.searchParams = { ...pageData.searchParams, ...e }
    handleSearch()
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
    if (res[1].result && res[1].result.length > 0) {
        item3.resData = [
            ...item3.resData,
            ...res[1].result.map((el: any) => ({
                text: el.orgname,
                value: el.id
            }))
        ]
    }
    pageData.conditionList = [
        {
            defaultOptionNumber: 3,
            conditionName: '类型',
            showAllOption: true,
            allOptionName: '全部',
            conditionKey: 'type',
            resData: [
                {
                    text: '视频',
                    value: '0'
                },
                {
                    text: '图文',
                    value: '1'
                },
                {
                    text: '电子书',
                    value: '2'
                }
            ]
        },
        ...list,
        item3
    ]
})
</script>
<style lang="scss" scoped>
::v-deep(.ant-col-5) {
    display: block;
    flex: 0 0 20%;
    max-width: 20%;
}
</style>
