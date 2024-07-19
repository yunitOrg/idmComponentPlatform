<template>
    <div v-show="pageData.hasPermission && !pageData.isFirst" class="page-max-width package-page flex">
        <div style="padding: 50px 30px 0 0">
            <ButtonList
                :componentProp="pageData.pageDetail.dataInfo"
                :isPraise="pageData.pageDetail.isPraise"
                :isCollect="pageData.pageDetail.isCollect"
                sourceType="8"
                :sourceId="pageData.pageDetail.dataInfo.id"
                @handleClickButtonList="handleClickButtonList"
                @collectSuccess="collectSuccess"
                @cancelCollect="cancelCollect"></ButtonList>
        </div>
        <ARow :gutter="[20, 20]" class="flex-1">
            <!-- left -->
            <ACol :span="17">
                <TitleInfoBox type="page" :componentProp="pageData.pageDetail.dataInfo" :showSplit="false" showIdText="ID" :showComType="false" :codePackageProp="pageData.pageDetail.dataInfo"></TitleInfoBox>
                <CodepackageList title="包含的组件包" type="page" :codepackageList="codepackageList" :componentProp="pageData.pageDetail.dataInfo"></CodepackageList>
                <MdContent title="页面详情文档" :codePackageProp="pageData.pageDetail.dataInfo" :contentUrl="pageData.contentUrl"></MdContent>
                <CommentBox title="页面" commentTypeId="id" articleType="8"></CommentBox>
            </ACol>
            <!-- right -->
            <ACol :span="7">
                <UserInfoBox :userInfoProp="pageData.pageDetail.dataUserInfo" @onDoFollow="onDoFollow"></UserInfoBox>
                <PageIntroductionBox
                    type="component"
                    title="页面简介"
                    :codePackageVersionInfoProp="pageData.pageDetail.dataVersionInfo"
                    :dataInfoProp="pageData.pageDetail.dataInfo"></PageIntroductionBox>
                <orgInfoBox v-if="pageData.pageDetail.orgInfoList.length" :list="pageData.pageDetail.orgInfoList" />
                <VersionList type="page" :versionList="pageData.pageDetail.dataVersionList" :codePackageProp="pageData.pageDetail.dataInfo"></VersionList>
                <ComponentList
                    title="包含的组件"
                    type="page"
                    :componentList="componentInfoList"
                    :componentProp="pageData.pageDetail.dataInfo"
                    :codePackageProp="pageData.pageDetail.dataInfo"></ComponentList>
            </ACol>
        </ARow>
    </div>
    <div v-show="!pageData.hasPermission && !pageData.isFirst">
        <INoPermission :text="pageData.errText"></INoPermission>
    </div>
</template>
<script lang="ts" setup>
import { useHomePageApi, useUserApi, useHomeActionApi } from '@/apis'
import { message } from '@/plugins/globalComponents'
const route = useRoute()
const pageData = reactive({
    pageDetail: {
        dataVersionList: [],
        dataInfo: { id: '', collectNumber: 0, praiseNumber: 0 },
        dataUserInfo: { focusThis: 0 },
        dataVersionInfo: {},
        componentInfoList: [],
        codepackageList: [],
        orgInfoList: [],
        isCollect: false, // 是否收藏
        isPraise: false // 是否点赞
    },
    contentUrl: '',
    hasPermission: true,
    errText: '',
    isFirst: true
})
const componentInfoList = computed(() => {
    return pageData.pageDetail?.componentInfoList
})
const codepackageList = computed(() => {
    return pageData.pageDetail?.codepackageList
})

const handleFetchPageData = () => {
    useHomePageApi
        .requestHomeGetPageDetail({
            id: route.query.id,
            version: route.query.version
        })
        .then((res) => {
            pageData.isFirst = false
            if (res.success) {
                pageData.pageDetail = res.result
                pageData.contentUrl = `/markdown/page/${route.query.id}/${route.query.version || res.result.dataInfo.currentVersion}.md`
                getComponentList()
            } else {
                pageData.hasPermission = false
                pageData.errText = res.message
            }
        })
}
const getComponentList = () => {
    useHomePageApi.requestHomeGetSchemaComponent({
        id: route.query.id,
        type: 'page',
        version: route.query.version
    }).then((res) => {
        if (res.success) {
            pageData.pageDetail.componentInfoList = res.result.componentList
            pageData.pageDetail.codepackageList = res.result.codepackageList
        }
    })
}
onMounted(() => {
    handleFetchPageData()
})

const handleClickButtonList = (type: number) => {
    switch (type) {
        case 1: // 点赞
            handlePraise()
            break
        case 2: // 打赏
            break
        case 3: // 评论
            break
        case 4: // 收藏
            break
        case 5: // 分享
            break
    }
}
// 点赞
const handlePraise = () => {
    useHomeActionApi[pageData.pageDetail.isPraise ? 'requestPageUnPraise' : 'requestPagePraise']({
        id: pageData.pageDetail.dataInfo.id
    }).then((res) => {
        if (res.success) {
            pageData.pageDetail.isPraise = !pageData.pageDetail.isPraise
            if (pageData.pageDetail.isPraise) pageData.pageDetail.dataInfo.praiseNumber += 1
            else pageData.pageDetail.dataInfo.praiseNumber -= 1
        } else {
            message.error(res.message)
        }
    })
}
// 收藏成功
const collectSuccess = () => {
    pageData.pageDetail.isCollect = true
    pageData.pageDetail.dataInfo.collectNumber += 1
}
// 取消收藏
const cancelCollect = () => {
    useUserApi.requestUserUnCollect({ sourceId: pageData.pageDetail.dataInfo.id, sourceType: '8' }).then((res) => {
        if (res.success) {
            pageData.pageDetail.dataInfo.collectNumber -= 1
        }
    })
    pageData.pageDetail.dataInfo.collectNumber -= 1
}
// 关注/取消关注成功
const onDoFollow = () => {
    if (pageData.pageDetail.dataUserInfo.focusThis === 1) {
        pageData.pageDetail.dataUserInfo.focusThis = 0
    } else {
        pageData.pageDetail.dataUserInfo.focusThis = 1
    }
}
</script>

<style lang="scss" scoped>
.package-page {
    position: relative;
    padding: 0 0 20px;
}
</style>
