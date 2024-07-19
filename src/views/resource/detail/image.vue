<template>
    <div v-show="pageData.hasPermission && !pageData.isFirst" class="page-max-width package-page flex">
        <div style="padding: 50px 30px 0 0">
            <ButtonList
                :componentProp="pageData.packageDetail.detailInfo"
                :isPraise="pageData.packageDetail.isPraise"
                :isCollect="pageData.packageDetail.isCollect"
                sourceType="11"
                :sourceId="pageData.packageDetail.detailInfo.id"
                @handleClickButtonList="handleClickButtonList"
                @collectSuccess="collectSuccess"
                @cancelCollect="cancelCollect"></ButtonList>
        </div>
        <ARow :gutter="[20, 20]" class="flex-1">
            <!-- left -->
            <ACol :span="17">
                <TitleInfoBox type="codePackage" :showImage="true" :showSplit="false" :showClassname="false" :showcomLangue="false" :showVersion="false" showIdText="MD5" :codePackageProp="pageData.packageDetail.detailInfo"></TitleInfoBox>
                <CommentBox commentTypeId="id" articleType="11"></CommentBox>
            </ACol>
            <!-- right -->
            <ACol :span="7">
                <UserInfoBox :userInfoProp="pageData.packageDetail.dataUserInfo" @onDoFollow="onDoFollow"></UserInfoBox>
                <ImageIntroductionBox :item="pageData.packageDetail.detailInfo" />
                <orgInfoBox v-if="pageData.packageDetail.orgInfoList.length" :list="pageData.packageDetail.orgInfoList" />
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
        detailInfo: { id: '', collectNumber: 0, praiseNumber: 0 },
        dataUserInfo: { focusThis: 0 },
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
        .requestHomeGetImageDetail({
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
    useHomeActionApi[pageData.packageDetail.isPraise ? 'requestImageUnPraise' : 'requestImagePraise']({
        id: pageData.packageDetail.detailInfo.id
    }).then((res) => {
        if (res.success) {
            pageData.packageDetail.isPraise = !pageData.packageDetail.isPraise
            if (pageData.packageDetail.isPraise) pageData.packageDetail.detailInfo.praiseNumber += 1
            else pageData.packageDetail.detailInfo.praiseNumber -= 1
        } else {
            message.error(res.message)
        }
    })
}
// 收藏成功
const collectSuccess = () => {
    pageData.packageDetail.isCollect = true
    pageData.packageDetail.detailInfo.collectNumber += 1
}
// 取消收藏
const cancelCollect = () => {
    useUserApi.requestUserUnCollect({ sourceId: pageData.packageDetail.detailInfo.id, sourceType: '11' }).then((res) => {
        if (res.success) {
            pageData.packageDetail.detailInfo.collectNumber -= 1
        }
    })
}
// 关注/取消关注成功
const onDoFollow = () => {
    if (pageData.packageDetail.dataUserInfo.focusThis === 1) {
        pageData.packageDetail.dataUserInfo.focusThis = 0
    } else {
        pageData.packageDetail.dataUserInfo.focusThis = 1
    }
}
</script>

<style lang="scss" scoped>
.package-page {
    position: relative;
    padding: 0 0 20px;
}
</style>
