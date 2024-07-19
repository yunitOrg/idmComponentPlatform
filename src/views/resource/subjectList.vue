<template>
    <div class="idm-subject-list">
        <ARow :gutter="[20, 20]">
            <ACol :span="18">
                <div class="subject-content-list">
                    <div class="flex justify-between align-center" style="margin-bottom:10px">
                        <div class="title">专题广场</div>
                        <div class="search">
                            <AInputSearch v-model:value="pageData.searchParams.searchText" size="large" class="meddile-search" placeholder="搜索感兴趣的专题" @search="searchChange">
                                <template #enterButton>
                                    <AButton type="primary">
                                        <template #icon><SearchOutlined /></template>
                                    </AButton>
                                </template>
                            </AInputSearch>
                        </div>
                    </div>
                    <IPagenationContainer :total="pageData.total" :pageSize="pageData.searchParams.pageSize" @searchChange="searchChange">
                        <template #list>
                            <div v-for="(item, index) in pageData.records" v-bind:key="index" class="list-item">
                                <ISubjectBox :componentProps="item" :on-preview-component-click="() => handlePreviewComponent(item) " />
                            </div>
                        </template>
                    </IPagenationContainer>
                </div>
            </ACol>
            <ACol :span="6">
                <RecommendSubjectBox />
            </ACol>
        </ARow>
    </div>
</template>

<script lang="ts" setup>
import { noticeImage } from '@/assets/images'
import { useHomePageApi, resourcePublish, useHomeCoreApi } from '@/apis'
import { defaultSettings } from '@/settings/defaultSetting'
import { baseURL } from '@/plugins/axios'
import { getImagePath } from '@/utils'
import { SearchOutlined } from '@ant-design/icons-vue'
const router = useRouter()
const pageData = reactive<{ [x: string]: any }>({
    total: 0,
    records: [],
    searchParams: {
        pageNo: 1,
        pageSize: 20,
        sort: 0,
        searchText: ''
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
    useHomePageApi.requestHomeResourceSubjectList(pageData.searchParams).then((res) => {
        if (res.success) {
            pageData.total = res.result.total
            pageData.records = res.result.records
        }
    })
}
const handlePreviewComponent = (data: any) => {
    if (data.id) {
        router.push({
            name: 'index-resourcesubjectdetail',
            query: {
                id: data.id
            }
        })
    }
}
handleSearch()
</script>

<style lang="scss" scoped>
.idm-subject-list{
    width: 1230px;
    margin: 0 auto;
    .subject-content-list{
        padding: 20px 30px;
        background: #fff;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.05);
        ::v-deep(.page-max-width){
            max-width: 100%
        }
        .title{
            font-size: 20px;
            color: #333;
            font-weight: 800;
        }
        .list-item:not(:last-child){
            border-bottom: 1px solid #f0f0f0;
        }
    }
}
</style>
