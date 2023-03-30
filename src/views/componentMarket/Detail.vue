<template>
    <div class="page-max-width package-page flex">
        <div style="padding: 50px 30px 0 0">
            <ButtonList
                :componentProp="pageData.packageDetail.componentInfo"
                :isPraise="pageData.packageDetail.isPraise"
                :isCollect="pageData.packageDetail.isCollect"
                sourceType="2"
                :sourceId="pageData.packageDetail.componentInfo.id"
                @handleClickButtonList="handleClickButtonList"
                @collectSuccess="collectSuccess"
                @cancelCollect="cancelCollect"></ButtonList>
        </div>
        <ARow :gutter="[20, 20]" class="flex-1">
            <!-- left -->
            <ACol :span="17">
                <TitleInfoBox :componentProp="pageData.packageDetail.componentInfo" :codePackageProp="pageData.packageDetail.codepackageInfo"></TitleInfoBox>
                <ImagePreview :comPreviewImgJson="comPreviewImgJson"></ImagePreview>
                <MdContent :contentUrl="pageData.contentUrl"></MdContent>
                <CommentBox title="组件文档" commentTypeId="componentId" articleType="2"></CommentBox>
            </ACol>
            <!-- right -->
            <ACol :span="7">
                <UserInfoBox :userInfoProp="pageData.packageDetail.componentUserInfo" @onDoFollow="onDoFollow"></UserInfoBox>
                <IntroductionBox
                    type="component"
                    title="组件简介"
                    :codePackageVersionInfoProp="pageData.packageDetail.codePackageVersionInfo"
                    :componentProp="pageData.packageDetail.componentInfo"
                    :codePackageProp="pageData.packageDetail.codepackageInfo"></IntroductionBox>
                <VersionList :versionList="pageData.packageDetail.componentVersionList" :codePackageProp="pageData.packageDetail.codepackageInfo"></VersionList>
                <ComponentList
                    title="组件包内其他组件"
                    :componenList="pageData.packageDetail.componentInfoList"
                    :componentProp="pageData.packageDetail.componentInfo"
                    :codePackageProp="pageData.packageDetail.codepackageInfo"></ComponentList>
            </ACol>
        </ARow>
    </div>
</template>
<script lang="ts" setup>
import { useHomePageApi, useUserApi, useHomeActionApi } from '@/apis'
import { message } from '@/plugins/globalComponents'
const route = useRoute()
const pageData = reactive({
    packageDetail: {
        componentVersionList: [],
        codepackageInfo: {},
        componentInfo: { id: '', collectNumber: 0, praiseNumber: 0, comPreviewImgJson: '' },
        componentUserInfo: { focusThis: 0 },
        codePackageVersionInfo: {},
        componentInfoList: [],
        orgInfoList: [],
        isCollect: false, // 是否收藏
        isPraise: false // 是否点赞
    },
    contentUrl: ''
})

const handleFetchPageData = () => {
    useHomePageApi
        .requestHomeGetComponentDetail({
            componentId: route.query.componentId,
            version: route.query.version
        })
        .then((res) => {
            if (res.success) {
                pageData.packageDetail = res.result
                pageData.contentUrl = res.result.codepackageInfo.currentCodePath + `/static/doc/components/${res.result.componentInfo.comClassname}.md`
            } else {
                message.error(res.message)
            }
        })
}
const comPreviewImgJson = computed(() => {
    if (pageData.packageDetail?.componentInfo?.comPreviewImgJson?.length > 0) {
        try {
            console.log(JSON.parse(pageData.packageDetail.componentInfo.comPreviewImgJson))
            return JSON.parse(pageData.packageDetail.componentInfo.comPreviewImgJson)
        } catch (error) {
            return []
        }
    }
    return []
})
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
    useHomeActionApi[pageData.packageDetail.isPraise ? 'requestComponentUnPraise' : 'requestComponentPraise']({
        componentId: pageData.packageDetail.componentInfo.id
    }).then((res) => {
        if (res.success) {
            pageData.packageDetail.isPraise = !pageData.packageDetail.isPraise
            if (pageData.packageDetail.isPraise) pageData.packageDetail.componentInfo.praiseNumber += 1
            else pageData.packageDetail.componentInfo.praiseNumber -= 1
        }
    })
}
// 收藏成功
const collectSuccess = () => {
    pageData.packageDetail.isCollect = true
    pageData.packageDetail.componentInfo.collectNumber += 1
}
// 取消收藏
const cancelCollect = () => {
    useUserApi.requestUserUnCollect({ sourceId: pageData.packageDetail.componentInfo.id, sourceType: '2' }).then((res) => {
        if (res.success) {
            pageData.packageDetail.componentInfo.collectNumber -= 1
        }
    })
    pageData.packageDetail.componentInfo.collectNumber -= 1
}
// 关注/取消关注成功
const onDoFollow = () => {
    if (pageData.packageDetail.componentUserInfo.focusThis === 1) {
        pageData.packageDetail.componentUserInfo.focusThis = 0
    } else {
        pageData.packageDetail.componentUserInfo.focusThis = 1
    }
}
</script>

<style lang="scss" scoped>
.package-page {
    position: relative;
    padding: 0 0 20px;
}
</style>
