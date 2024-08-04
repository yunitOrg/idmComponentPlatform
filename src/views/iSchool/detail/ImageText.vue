<template>
    <div v-show="pageData.hasPermission && !pageData.isFirst" class="page-max-width flex">
        <div style="padding: 50px 30px 0 0">
            <ButtonList
                :componentProp="pageData.docDetail.courseInfo"
                :isPraise="pageData.docDetail.isPraise"
                :isCollect="pageData.docDetail.isCollect"
                sourceType="3"
                :sourceId="pageData.docDetail.courseInfo.id"
                @handleClickButtonList="handleClickButtonList"
                @collectSuccess="collectSuccess"
                @cancelCollect="cancelCollect"></ButtonList>
        </div>
        <ARow :gutter="[20, 20]" class="flex-1">
            <ACol :span="17">
                <DocTitleInfo type="imageText" :docProp="pageData.docDetail.courseInfo"></DocTitleInfo>
                <div class="detail-md-outer">
                    <v-md-preview v-if="pageData.docDetail.courseInfo.articleContent" ref="preview" :text="pageData.docDetail.courseInfo.articleContent"></v-md-preview>
                </div>
                <CommentBox commentTypeId="courseId" articleType="3" style="margin-bottom: 20px"></CommentBox>
                <!-- <RecommendBox style="margin-bottom: 16px"></RecommendBox> -->
            </ACol>
            <ACol :span="7">
                <UserInfoBox :userInfoProp="pageData.docDetail.courseUserInfo" @onDoFollow="onDoFollow"></UserInfoBox>
                <orgInfoBox v-if="pageData.docDetail.orgInfoList.length" :list="pageData.docDetail.orgInfoList" />
                <AttachmentBox :list="pageData.docDetail.courseInfo.attachment"></AttachmentBox>
                <CatalogueBox :docContentRef="preview"></CatalogueBox>
                <RelatedComponent :list="pageData.docDetail.componentInfoList" style="margin-bottom: 20px"></RelatedComponent>
                <!-- <CourseBox style="margin-bottom: 20px;"></CourseBox> -->
            </ACol>
        </ARow>
    </div>
    <div v-show="!pageData.hasPermission && !pageData.isFirst">
        <INoPermission :text="pageData.errText"></INoPermission>
    </div>
</template>
<script setup lang="ts">
import { useCourseApi } from '@/apis'
import { message } from '@/plugins/globalComponents'
const route = useRoute()
const pageData = reactive({
    docDetail: {
        componentInfoList: [], // 相关组件
        orgInfoList: [],
        courseInfo: {
            // 教程详情
            id: '',
            collectNumber: 0,
            praiseNumber: 0,
            attachment: [],
            articleContent: ''
        },
        courseUserInfo: {
            // 文档用户信息
            focusThis: 0
        },
        isCollect: false, // 是否收藏
        isPraise: false // 是否点赞
    },
    content: '',
    contentUrl: '', // 目录链接
    hasPermission: true,
    errText: '',
    isFirst: true
})
// 文档内容元素
const preview = ref()
const handleFetchPageData = () => {
    useCourseApi
        .requestGetCourseDetail({
            ...route.query
        })
        .then((res) => {
            pageData.isFirst = false
            if (res.success) {
                res.result.courseInfo.attachment = res.result.courseInfo.attachment ? JSON.parse(res.result.courseInfo.attachment) : []
                pageData.docDetail = res.result
            } else {
                pageData.hasPermission = false
                pageData.errText = res.message
            }
        })
}
handleFetchPageData()

/**
 * 文档操作按钮点击回调
 * @param type number
 */
const handleClickButtonList = (type: number) => {
    console.log(type)
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
    useCourseApi[pageData.docDetail.isPraise ? 'requestUnpraiseCourse' : 'requestPraiseCourse']({
        courseId: pageData.docDetail.courseInfo.id
    }).then((res) => {
        if (res.success) {
            pageData.docDetail.isPraise = !pageData.docDetail.isPraise
            if (pageData.docDetail.isPraise) pageData.docDetail.courseInfo.praiseNumber += 1
            else pageData.docDetail.courseInfo.praiseNumber -= 1
        } else {
            message.error(res.message)
        }
    })
}
/**
 * 收藏回调
 */
const collectSuccess = () => {
    pageData.docDetail.isCollect = true
    pageData.docDetail.courseInfo.collectNumber += 1
}
/**
 * 取消收藏成功回调
 */
const cancelCollect = () => {
    pageData.docDetail.isCollect = false
    pageData.docDetail.courseInfo.collectNumber -= 1
}
/**
 * 关注用户回调
 */
const onDoFollow = () => {
    pageData.docDetail.courseUserInfo.focusThis = pageData.docDetail.courseUserInfo.focusThis === 1 ? 0 : 1
}
</script>
<style scoped lang="scss">
.detail-md-outer {
    background-color: #fff;
}
</style>
