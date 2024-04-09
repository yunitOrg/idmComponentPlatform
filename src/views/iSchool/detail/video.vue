<template>
    <div v-show="pageData.hasPermission && !pageData.isFirst" class="video-outer">
        <div class="video-wrapper">
            <div class="page-max-width">
                <IBreadcrumbs :list="pageData.breadcrumbList" style="margin-bottom: 20px"></IBreadcrumbs>
                <div class="flex">
                    <ARow class="flex-1">
                        <ACol :span="24 - leftSpan">
                            <VideoPlayer :videoInfo="pageData.videoInfo"></VideoPlayer>
                            <div class="handler" :class="{ expend: pageData.isExpend }" :title="pageData.isExpend?'折叠':'展开'" @click="toggleExpend">
                                <svg-icon iconClass="expend"></svg-icon>
                            </div>
                        </ACol>
                        <ACol :span="leftSpan">
                            <VideoColumnBox
                                :courseInfo="pageData.docDetail.courseInfo"
                                :courseVedioList="pageData.docDetail.courseVedioList"
                                :courseUserInfo="pageData.docDetail.courseUserInfo"
                                maxHeight="519px"
                                @columnChange="columnChange"></VideoColumnBox>
                        </ACol>
                    </ARow>
                </div>
                <ButtonList
                    style="margin: 40px 0 20px 0"
                    alignType="horizontal"
                    :componentProp="pageData.docDetail.courseInfo"
                    :isPraise="pageData.docDetail.isPraise"
                    :isCollect="pageData.docDetail.isCollect"
                    sourceType="3"
                    themeType="black"
                    :showLabel="true"
                    :sourceId="pageData.docDetail.courseInfo.id"
                    @handleClickButtonList="handleClickButtonList"
                    @collectSuccess="collectSuccess"
                    @cancelCollect="cancelCollect"></ButtonList>
            </div>
        </div>
        <div class="page-max-width flex">
            <ARow :gutter="[20, 20]" class="flex-1">
                <ACol :span="17">
                    <CommentBox commentTypeId="courseId" articleType="3" style="margin-bottom: 20px"></CommentBox>
                </ACol>
                <ACol :span="7">
                    <UserInfoBox style="margin-top: 16px" :userInfoProp="pageData.docDetail.courseUserInfo" @onDoFollow="onDoFollow"></UserInfoBox>
                    <AttachmentBox :list="pageData.docDetail.courseInfo.attachment"></AttachmentBox>
                    <RelatedComponent :list="pageData.docDetail.componentInfoList" style="margin-bottom: 20px"></RelatedComponent>
                </ACol>
            </ARow>
        </div>
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
        courseVedioList: [],
        isCollect: false, // 是否收藏
        isPraise: false // 是否点赞
    },
    breadcrumbList: [
        {
            name: '首页',
            url: '/'
        },
        {
            name: '教程',
            url: '/iSchool'
        },
        {
            name: '实用数据分析：数据分析师从小白到精通',
            url: ''
        }
    ],
    isExpend: true,
    leftSpan: 6, // 是否展开
    videoInfo: {}, // 视频栏目信息
    hasPermission: true,
    errText: '',
    isFirst: true
})
const leftSpan = computed(() => {
    return pageData.isExpend ? 6 : 0
})

const handleFetchPageData = () => {
    useCourseApi
        .requestGetCourseDetail({
            ...route.query
        })
        .then((res) => {
            pageData.isFirst = false
            if (res.success) {
                res.result.courseInfo.attachment = res.result.courseInfo.attachment ? JSON.parse(res.result.courseInfo.attachment) : []
                pageData.breadcrumbList[2].name = res.result.courseInfo.title
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
/**
 * 展开收起
 */
const toggleExpend = () => {
    pageData.isExpend = !pageData.isExpend
}
/**
 * 视频栏目id
 */
const columnChange = (videoInfo: any) => {
    pageData.videoInfo = videoInfo
}
</script>
<style lang="scss">
.video-outer {
    margin-top: -20px;
    .video-wrapper {
        padding: 20px 0;
        background-color: rgb(34, 34, 34);
        .video-header {
            color: #fff;
        }
    }
    .handler {
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto 0;
        height: 28px;
        width: 10px;
        color: #fff;
        font-size: 10px;
        line-height: 28px;
        background-color: rgba($color: #fff, $alpha: 0.2);
        z-index: 1;
        cursor: pointer;
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;

        &.expend {
            transform: rotate(180deg);
            right: -10px;
        }
    }
}
</style>
