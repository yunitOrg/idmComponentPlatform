<template>
    <div v-show="pageData.hasPermission && !pageData.isFirst"  class="idm-subject-detail">
        <ARow :gutter="[20, 20]">
            <ACol :span="18">
                <div class="subject-content-header">
                    <div class="flex justify-start">
                        <div>
                            <a-avatar :size="80" shape="square" :src="getImagePath(pageData.subjectObject.coverPath) || defaultSettings.userphoto" />
                        </div>
                        <div>
                            <div class="title">{{ pageData.subjectObject.type=='platform'?'平台': ((pageData.subjectObject.type=='product'?'产品':'项目')+' / '+pageData.subjectObject.title) }}</div>
                            <div class="attr">
                                <EyeOutlined />&nbsp;&nbsp;{{ pageData.subjectObject.readNumber }} 阅读
                            </div>
                        </div>
                    </div>
                    <div class="lead-text">
                        <label>导语：</label>{{ pageData.subjectObject.remark || '暂无导语' }}
                    </div>
                    <div v-if="userStore.userInfo&&userStore.userInfo.id==pageData.subjectObject.userId" @click="pageData.editVisible = true" class="btnbox">
                        <EditOutlined /> 修改
                    </div>
                </div>
                <div class="subject-content-box">
                    <a-tabs :tabBarStyle="{ padding: '0 20px' }" size="large" v-model:activeKey="pageData.activeKey">
                        <a-tab-pane key="1">
                            <template #tab>
                                页面 <span style="color:#ccc">{{ pageData.pageTotal }}</span>
                            </template>
                            <div style="padding:0 20px">
                                <IPagenationContainer :total="pageData.pageTotal" :pageSize="pageData.pageSearchParams.pageSize" @searchChange="searchChangePage">
                                    <template #list>
                                        <ARow :gutter="[20, 20]">
                                            <ACol v-for="(item, index) in pageData.pageRecords" :key="index" :span="24">
                                                <IPageBox :componentProps="item" :cardList="pageTipShowList" :on-preview-component-click="() => handlePreviewComponent(item,'') " :on-download-click="() => handleDownloadClick(item)" :on-open-detail-click="() => handleOpenComponentDetail(item,'page') "/>
                                            </ACol>
                                        </ARow>
                                    </template>
                                </IPagenationContainer>
                            </div>
                        </a-tab-pane>
                        <a-tab-pane key="2">
                            <template #tab>
                                模板 <span style="color:#ccc">{{ pageData.templateTotal }}</span>
                            </template>
                            <div style="padding:0 20px">
                                <IPagenationContainer :total="pageData.templateTotal" :pageSize="pageData.templateSearchParams.pageSize" @searchChange="searchChangeTemplate">
                                    <template #list>
                                        <ARow :gutter="[20, 20]">
                                            <ACol v-for="(item, index) in pageData.templateRecords" :key="index" :span="24">
                                                <IPageBox :componentProps="item" :bottomShowTime="true" :cardList="templateTipShowList" :on-preview-component-click="() => handlePreviewComponent(item,'custom_') " :on-download-click="() => handleDownloadClick(item)" :on-open-detail-click="() => handleOpenComponentDetail(item,'template') "/>
                                            </ACol>
                                        </ARow>
                                    </template>
                                </IPagenationContainer>
                            </div>
                        </a-tab-pane>
                        <a-tab-pane key="3">
                            <template #tab>
                                业务组件 <span style="color:#ccc">{{ pageData.bcomponentTotal }}</span>
                            </template>
                            <div style="padding:0 20px">
                                <IPagenationContainer :total="pageData.bcomponentTotal" :pageSize="pageData.bcomponentSearchParams.pageSize" @searchChange="searchChangeBcomponent">
                                    <template #list>
                                        <ARow :gutter="[20, 20]">
                                            <ACol v-for="(item, index) in pageData.bcomponentRecords" :key="index" :span="24">
                                                <IPageBox :componentProps="item" :bottomShowTime="true" :cardList="bcomponentTipShowList" :on-preview-component-click="() => handlePreviewComponent(item,'custom_') " :on-download-click="() => handleDownloadClick(item)" :on-open-detail-click="() => handleOpenComponentDetail(item,'bcomponent') "/>
                                            </ACol>
                                        </ARow>
                                    </template>
                                </IPagenationContainer>
                            </div>
                        </a-tab-pane>
                        <template #rightExtra>
                            <AInputSearch v-model:value="pageData.searchText" size="large" class="meddile-search" placeholder="搜索感兴趣的内容" @search="searchChangeAll">
                                <template #enterButton>
                                    <AButton type="primary">
                                        <template #icon><SearchOutlined /></template>
                                    </AButton>
                                </template>
                            </AInputSearch>
                        </template>
                    </a-tabs>
                </div>
            </ACol>
            <ACol :span="6">
                <RecommendSubjectBox :clickOpenNewWin="true" />
            </ACol>
        </ARow>
    </div>
    <div v-show="!pageData.hasPermission && !pageData.isFirst">
        <INoPermission :text="pageData.errText"></INoPermission>
    </div>
    <a-modal v-model:visible="pageData.editVisible" destroyOnClose :confirmLoading="pageData.confirmLoading" :keyboard="false" :maskClosable="false" wrapClassName="idmcore-modal" width="1000px" ok-text="保存" title="专题维护" @ok="onOk">
        <a-form ref="formRef" :model="formState" layout="vertical" name="form_in_modal">
            <a-form-item name="id" hidden />
            <a-form-item name="remark" label="导语">
                <a-textarea v-model:value="formState.remark" :autosize="{ minRows: 2, maxRows: 6 }" :maxlength="500" />
            </a-form-item>
            <a-form-item name="coverPath" label="封面">
                <IImageUpload
                    v-model:value="formState.coverPath"
                    :paramsData="{upFileType: 'image'}"
                    :multiple="false"
                />
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script lang="ts" setup>
import { noticeImage } from '@/assets/images'
import { useHomePageApi, resourcePublish, useHomeCoreApi, componentPublishApi } from '@/apis'
import { defaultSettings } from '@/settings/defaultSetting'
import { Modal, message } from 'ant-design-vue'
import { baseURL } from '@/plugins/axios'
import { getImagePath } from '@/utils'
import { EyeOutlined, SearchOutlined, EditOutlined } from '@ant-design/icons-vue'
import { useUserStore } from '@/store/modules/user'
const userStore = useUserStore()
const route = useRoute()
const router = useRouter()
const formRef = ref()
const pageTipShowList = [
    ['数据ID', 'id'],
    ['页面ID', 'idmId'],
    ['标签', 'tags'],
    ['产品/项目', 'productName'],
    ['模块名称', 'moduleName'],
    ['模块标识', 'moduleCode'],
    ['体积大小', 'currentZipSize', 'formatSize'],
    ['版本数量', 'versionCount'],
    ['更新时间', 'updateTime']
]
const bcomponentTipShowList = [
    ['数据ID', 'id'],
    ['组件ID', 'businessId'],
    ['标签', 'tags'],
    ['产品/项目', 'productName'],
    ['体积大小', 'currentZipSize', 'formatSize'],
    ['更新时间', 'updateTime']
]
const templateTipShowList = [
    ['数据ID', 'id'],
    ['模板ID', 'businessId'],
    ['标签', 'tags'],
    ['产品/项目', 'productName'],
    ['类型', 'contentType', 'format01'],
    ['体积大小', 'currentZipSize', 'formatSize'],
    ['更新时间', 'updateTime']
]
const pageData = reactive<{ [x: string]: any }>({
    queryId: route.query?.id,
    subjectObject: {},
    activeKey: '1',
    pageTotal: 0,
    pageRecords: [],
    templateTotal: 0,
    templateRecords: [],
    bcomponentTotal: 0,
    bcomponentRecords: [],
    pageSearchParams: {
        pageNo: 1,
        pageSize: 20,
        sort: 0
    },
    templateSearchParams: {
        dataType: 0,
        pageNo: 1,
        pageSize: 20,
        sort: 0
    },
    bcomponentSearchParams: {
        dataType: 1,
        pageNo: 1,
        pageSize: 20,
        sort: 0
    },
    searchText: '',
    hasPermission: true,
    errText: '',
    isFirst: true,
    editVisible: false,
    confirmLoading: false
})
const formState = reactive({
    id: route.query?.id,
    remark: '',
    coverPath: []
})

const onOk = async () => {
    pageData.confirmLoading = true
    formRef.value.validateFields().then(async (values: any) => {
        const res = await resourcePublish.requestSaveSubject({
            ...formState,
            coverPath: formState.coverPath && formState.coverPath[0] ? formState.coverPath[0].src : ''
        })

        if (res.success) {
            message.success('保存成功！')
            formRef.value.resetFields()
            pageData.editVisible = false
        } else {
            message.error('保存失败！' + res.message)
        }
        pageData.confirmLoading = false
        handleFetchPageData()
    }).catch((info: any) => {
        console.log('Failed:', info)
        message.error('表单校验失败，请检查！')
        pageData.confirmLoading = false
    })
}

const handleFetchPageData = () => {
    useHomePageApi
        .requestHomeGetSubjectDetail({
            id: pageData.queryId
        })
        .then((res) => {
            pageData.isFirst = false
            if (res.success) {
                pageData.subjectObject = res.result.subjectInfo

                formState.remark = res.result.subjectInfo.remark
                if (res.result.subjectInfo.coverPath) {
                    formState.coverPath = [
                        {
                            src: res.result.subjectInfo.coverPath
                        }
                    ]
                }
            } else {
                pageData.hasPermission = false
                pageData.errText = res.message
            }
        })
}
handleFetchPageData()

const searchChangePage = (e: any = {}) => {
    pageData.pageSearchParams = { ...pageData.pageSearchParams, ...e, searchTxt: pageData.searchText, subjectId: pageData.queryId }
    handleSearchPage()
}
const searchChangeTemplate = (e: any = {}) => {
    pageData.templateSearchParams = { ...pageData.templateSearchParams, ...e, searchTxt: pageData.searchText, subjectId: pageData.queryId }
    handleSearchTemplate()
}
const searchChangeBcomponent = (e: any = {}) => {
    pageData.bcomponentSearchParams = { ...pageData.bcomponentSearchParams, ...e, searchTxt: pageData.searchText, subjectId: pageData.queryId }
    handleSearchBcomponent()
}
const handleSearchPage = () => {
    useHomePageApi.requestHomeGetPageList(pageData.pageSearchParams).then((res) => {
        if (res.success) {
            pageData.pageTotal = res.result.total
            pageData.pageRecords = res.result.records
        }
    })
}
const handleSearchTemplate = () => {
    useHomePageApi.requestHomeGetCustomComponentList(pageData.templateSearchParams).then((res) => {
        if (res.success) {
            pageData.templateTotal = res.result.total
            pageData.templateRecords = res.result.records
        }
    })
}
const handleSearchBcomponent = () => {
    useHomePageApi.requestHomeGetCustomComponentList(pageData.bcomponentSearchParams).then((res) => {
        if (res.success) {
            pageData.bcomponentTotal = res.result.total
            pageData.bcomponentRecords = res.result.records
        }
    })
}
const searchChangeAll = () => {
    searchChangePage({})
    searchChangeTemplate({})
    searchChangeBcomponent({})
}
const handlePreviewComponent = (data: any, type: any) => {
    if (data.id) {
        window.open(baseURL + '/p1000/idm/' + type + data.id + '.html?timespan=' + new Date().getTime(), '_blank')
    }
}
const handleOpenComponentDetail = (data: any, type: any) => {
    const { href } = router.resolve({
        name: 'index-' + type + '-detail',
        query: {
            id: data.id,
            version: data.currentVersion
        }
    })
    window.open(href, '_blank')
}
const handleDownloadClick = (data: any) => {
    if (!data.currentZipPath) {
        return
    }
    componentPublishApi.downloadStaticFile(data.currentZipPath)
}

searchChangeAll()
</script>

<style lang="scss">
.idm-subject-detail{
    width: 1230px;
    margin: 0 auto;
    .subject-content-box{
        background: #fff;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.05);
        margin-bottom: 50px;
        .page-max-width{
            max-width: 100%
        }
    }
    .subject-content-header{
        .btnbox{
            position: absolute;
            right: 20px;
            top: 20px;
            color: #666;
            font-size: 14px;
            cursor: pointer;
            &:hover{
                color: #333;
            }
        }
        position: relative;
        background: #fff;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.05);
        padding: 50px;
        margin-bottom: 20px;
        .title{
            font-size: 24px;
            font-weight: bold;
            margin-left: 20px;
        }
        .attr{
            margin-left: 20px;
            font-size: 14px;
            color: #999;
            margin-top: 10px;
        }
        .lead-text{
            margin-top: 20px;
            font-size: 16px;
            label{
                font-weight: bold;
            }
        }
    }

}
</style>
