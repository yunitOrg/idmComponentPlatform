<template>
    <IFilterCondition :conditionList="pageData.conditionList" :titleInfo="conditionTitle" @searchChange="searchChange">
    </IFilterCondition>
    <IPagenationContainer :total="pageData.total" :pageSize="pageData.searchParams.pageSize" @searchChange="searchChange">
        <template #list>
            <ARow :gutter="[20, 20]">
                <ACol v-for="(item, index) in pageData.records" :key="index" :span="12">
                    <IPageBox :componentProps="item" :cardList="tipShowList" :on-preview-component-click="() => handlePreviewComponent(item) " :on-download-click="() => handleDownloadClick(item)" :on-open-detail-click="() => handleOpenComponentDetail(item) "/>
                </ACol>
            </ARow>
        </template>
    </IPagenationContainer>
</template>

<script lang="ts" setup>
import { pageImage } from '@/assets/images'
import { useHomePageApi, coreApi, useHomeCoreApi, componentPublishApi } from '@/apis'
import { defaultSettings } from '@/settings/defaultSetting'
import { baseURL } from '@/plugins/axios'
const router = useRouter()
const fileterMap = ['pagetype', 'ownertype']
const tipShowList = [
    ['数据ID', 'id'],
    ['页面ID', 'idmId'],
    ['标签', 'tags'],
    ['产品/项目', 'productName'],
    ['模块名称', 'moduleName'],
    ['模块标识', 'moduleCode'],
    ['体积大小', 'currentZipSize', 'formatSize'],
    ['版本数量', 'versionCount'],
    ['更新时间', 'updateTime']
] as any
const conditionTitle = {
    image: pageImage,
    title: '页面',
    subTitle: '是时候展示精美成品了',
    placeholder: '搜索感兴趣的页面'
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
    useHomePageApi.requestHomeGetPageList(pageData.searchParams).then((res) => {
        if (res.success) {
            pageData.total = res.result.total
            pageData.records = res.result.records
        }
    })
}
const handlePreviewComponent = (data: any) => {
    if (data.id) {
        window.open(baseURL + '/p1000/idm/' + data.id + '.html?timespan=' + new Date().getTime(), '_blank')
    }
}
const handleOpenComponentDetail = (data: any) => {
    router.push({
        name: 'index-page-detail',
        query: {
            id: data.id,
            version: data.currentVersion
        }
    })
}
const handleDownloadClick = (data: any) => {
    if (!data.currentZipPath) {
        return
    }
    componentPublishApi.downloadStaticFile(data.currentZipPath)
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
        conditionName: index === 0 ? '类型' : '所属',
        conditionKey: index === 0 ? 'type' : 'ownerType',
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
