<template>
    <IFilterCondition :conditionList="pageData.conditionList" :titleInfo="conditionTitle" @searchChange="searchChange">
    </IFilterCondition>
    <IPagenationContainer :total="pageData.total" :pageSize="pageData.searchParams.pageSize" @searchChange="searchChange">
        <template #list>
            <ARow :gutter="[20, 20]">
                <ACol v-for="(item, index) in pageData.records" :key="index" :span="12">
                    <IPageBox :componentProps="item" :bottomShowTime="true" :cardList="tipShowList" :on-preview-component-click="() => handlePreviewComponent(item) " />
                </ACol>
            </ARow>
        </template>
    </IPagenationContainer>
</template>

<script lang="ts" setup>
import { bcomponentImage } from '@/assets/images'
import { useHomePageApi, coreApi, useHomeCoreApi } from '@/apis'
import { defaultSettings } from '@/settings/defaultSetting'
import { baseURL } from '@/plugins/axios'
const fileterMap = ['ownertype']
const tipShowList = [
    ['数据ID', 'id'],
    ['组件ID', 'businessId'],
    ['标签', 'tags'],
    ['产品/项目', 'productName'],
    ['体积大小', 'currentZipSize', 'formatSize'],
    ['更新时间', 'updateTime']
]
const conditionTitle = {
    image: bcomponentImage,
    title: '业务组件',
    subTitle: '组件的终点是业务！',
    placeholder: '搜索感兴趣的业务组件'
}
const pageData = reactive<{ [x: string]: any }>({
    total: 0,
    records: [],
    searchParams: {
        dataType: 1,
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
    useHomePageApi.requestHomeGetCustomComponentList(pageData.searchParams).then((res) => {
        if (res.success) {
            pageData.total = res.result.total
            pageData.records = res.result.records
        }
    })
}
const handlePreviewComponent = (data: any) => {
    if (data.id) {
        window.open(baseURL + '/p1000/idm/custom_' + data.id + '.html', '_blank')
    }
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
        defaultOptionNumber: 18,
        conditionName: '所属',
        conditionKey: 'ownerType',
        showAllOption: true,
        allOptionName: '全部',
        resData: res[index].result.map((el: any) => ({
            text: el.itemValue,
            value: el.itemCd
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
    pageData.conditionList = [...list, item3]
})
</script>
