<template>
    <div class="video-outer">
        <div class="video-wrapper">
            <div class="page-max-width">
                <div class="flex">
                    <ARow :gutter="[20, 20]" class="flex-1">
                        <ACol :span="17">
                            <VideoPlayer></VideoPlayer>
                        </ACol>
                        <ACol :span="7"> </ACol>
                    </ARow>
                </div>
                <ButtonList
                    style="margin:20px 0 0 0"
                    alignType="horizontal"
                    :componentProp="pageData.docDetail.docInfo"
                    :isPraise="pageData.docDetail.isPraise"
                    :isCollect="pageData.docDetail.isCollect"
                    sourceType="1"
                    :sourceId="pageData.docDetail.docInfo.id"
                    @handleClickButtonList="handleClickButtonList"
                    @collectSuccess="collectSuccess"
                    @cancelCollect="cancelCollect"></ButtonList>
            </div>
        </div>
        <div class="page-max-width flex">
            <ARow :gutter="[20, 20]" class="flex-1">
                <ACol :span="17">
                    <CommentBox commentTypeId="docId" articleType="3"></CommentBox>
                    <RecommendBox style="margin-bottom: 16px"></RecommendBox>
                </ACol>
                <ACol :span="7">
                    <UserInfoBox style="margin-top: 16px" :userInfoProp="pageData.docDetail.docUserInfo" @onDoFollow="onDoFollow"></UserInfoBox>
                    <CourseBox></CourseBox>
                </ACol>
            </ARow>
        </div>
    </div>
</template>
<script setup lang="ts">
const pageData = reactive({
    docDetail: {
        docInfo: { id: '', collectNumber: 0, praiseNumber: 0 }, // 文档信息
        docUserInfo: { focusThis: 0 }, // 文档用户信息
        isCollect: false, // 是否收藏
        isPraise: false // 是否点赞
    }
})
/**
 * 文档操作按钮点击回调
 * @param type number
 */
const handleClickButtonList = (type: number) => {
    console.log(type)
    switch (type) {
        case 1: // 点赞
            // handlePraise()
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
/**
 * 收藏回调
 */
const collectSuccess = () => {
    pageData.docDetail.isCollect = true
    pageData.docDetail.docInfo.collectNumber += 1
}
/**
 * 取消收藏成功回调
 */
const cancelCollect = () => {
    pageData.docDetail.isCollect = false
    pageData.docDetail.docInfo.collectNumber -= 1
}
/**
 * 关注用户回调
 */
const onDoFollow = () => {
    pageData.docDetail.docUserInfo.focusThis = pageData.docDetail.docUserInfo.focusThis === 1 ? 0 : 1
}
</script>
<style lang="scss">
.video-outer {
    margin-top: -17px;
    .video-wrapper {
        padding: 20px 0;
        background-color: rgb(34, 34, 34);
    }
}
</style>
