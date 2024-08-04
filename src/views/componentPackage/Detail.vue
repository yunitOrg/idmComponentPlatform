<template>
    <div v-show="pageData.hasPermission && !pageData.isFirst" class="page-max-width package-page flex">
        <div style="padding: 50px 30px 0 0">
            <ButtonList
                :componentProp="pageData.packageDetail.codepackageInfo"
                :isPraise="pageData.packageDetail.isPraise"
                :isCollect="pageData.packageDetail.isCollect"
                sourceType="1"
                :sourceId="pageData.packageDetail.codepackageInfo.id"
                @handleClickButtonList="handleClickButtonList"
                @collectSuccess="collectSuccess"
                @cancelCollect="cancelCollect"></ButtonList>
        </div>
        <ARow :gutter="[20, 20]" class="flex-1">
            <!-- left -->
            <ACol :span="17">
                <TitleInfoBox type="codePackage" :codePackageProp="pageData.packageDetail.codepackageInfo"></TitleInfoBox>
                <MdContent :codePackageProp="pageData.packageDetail.codepackageInfo" :contentUrl="pageData.contentUrl"></MdContent>
                <CommentBox commentTypeId="codepackageId" articleType="1"></CommentBox>
            </ACol>
            <!-- right -->
            <ACol :span="7">
                <UserInfoBox :userInfoProp="pageData.packageDetail.codepackageUserInfo" @onDoFollow="onDoFollow"></UserInfoBox>
                <IntroductionBox
                    :codePackageVersionListProp="pageData.packageDetail.codePackageVersionList"
                    :codePackageProp="pageData.packageDetail.codepackageInfo"></IntroductionBox>
                <orgInfoBox v-if="pageData.packageDetail.orgInfoList.length" :list="pageData.packageDetail.orgInfoList" />
                <VersionList
                    type="codePackage"
                    :versionList="pageData.packageDetail.codePackageVersionList"
                    :codePackageProp="pageData.packageDetail.codepackageInfo"></VersionList>
                <ComponentList :componentList="pageData.packageDetail.componentInfoList" :codePackageProp="pageData.packageDetail.codepackageInfo"></ComponentList>
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
    packageDetail: {
        codePackageVersionList: [],
        codepackageInfo: { id: '', collectNumber: 0, praiseNumber: 0 },
        codepackageUserInfo: { focusThis: 0 },
        componentInfoList: [],
        orgInfoList: [],
        isCollect: false, // 是否收藏
        isPraise: false // 是否点赞
    },
    contentUrl: '',
    hasPermission: true,
    errText: '',
    isFirst: true
})
const handleFetchPageData = () => {
    useHomePageApi
        .requestHomeGetCodepackageDetail({
            ...route.query
        })
        .then((res) => {
            pageData.isFirst = false
            if (res.success) {
                pageData.packageDetail = res.result
                pageData.contentUrl = res.result.codepackageInfo.currentCodePath + '/static/doc/index.md'
            } else {
                pageData.hasPermission = false
                pageData.errText = res.message
            }
        })
}
handleFetchPageData()
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
    useHomeActionApi[pageData.packageDetail.isPraise ? 'requestCodepackageUnPraise' : 'requestCodepackagePraise']({
        codepackageId: pageData.packageDetail.codepackageInfo.id
    }).then((res) => {
        if (res.success) {
            pageData.packageDetail.isPraise = !pageData.packageDetail.isPraise
            if (pageData.packageDetail.isPraise) pageData.packageDetail.codepackageInfo.praiseNumber += 1
            else pageData.packageDetail.codepackageInfo.praiseNumber -= 1
        } else {
            message.error(res.message)
        }
    })
}
// 收藏成功
const collectSuccess = () => {
    pageData.packageDetail.isCollect = true
    pageData.packageDetail.codepackageInfo.collectNumber += 1
}
// 取消收藏
const cancelCollect = () => {
    useUserApi.requestUserUnCollect({ sourceId: pageData.packageDetail.codepackageInfo.id, sourceType: '1' }).then((res) => {
        if (res.success) {
            pageData.packageDetail.codepackageInfo.collectNumber -= 1
        }
    })
}
// 关注/取消关注成功
const onDoFollow = () => {
    if (pageData.packageDetail.codepackageUserInfo.focusThis === 1) {
        pageData.packageDetail.codepackageUserInfo.focusThis = 0
    } else {
        pageData.packageDetail.codepackageUserInfo.focusThis = 1
    }
}
</script>

<style lang="scss" scoped>
.package-page {
    position: relative;
    padding: 0 0 20px;
}
</style>
