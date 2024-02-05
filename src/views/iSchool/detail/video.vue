<template>
    <div class="video-outer">
        <div class="video-wrapper">
            <div class="page-max-width">
                <IBreadcrumbs :list="pageData.docDetail.breadcrumbList" :column="pageData.docDetail.breadcrumbColumn" style="margin-bottom: 20px"></IBreadcrumbs>
                <div class="flex">
                    <ARow class="flex-1">
                        <ACol :span="24 - leftSpan">
                            <VideoPlayer :videoId="pageData.columnId"></VideoPlayer>
                            <div class="handler" :class="{ expend: pageData.isExpend }" @click="toggleExpend">
                                <svg-icon iconClass="expend"></svg-icon>
                            </div>
                        </ACol>
                        <ACol :span="leftSpan">
                            <VideoColumnBox
                                :introduc="pageData.docDetail.introduc"
                                :course="pageData.docDetail.course"
                                :column="pageData.docDetail.column"
                                @columnChange="columnChange"></VideoColumnBox>
                        </ACol>
                    </ARow>
                </div>
                <ButtonList
                    style="margin: 20px 0 0 0"
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
                    <AttachmentBox :userInfoProp="pageData.docDetail.docUserInfo"></AttachmentBox>
                    <RelatedComponent :userInfoProp="pageData.docDetail.docUserInfo" style="margin-bottom: 20px;"></RelatedComponent>
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
        breadcrumbList: [
            {
                name: '首页',
                url: 'aaa'
            },
            {
                name: '教程',
                url: 'bbb'
            },
            {
                name: '实用数据分析：数据分析师从小白到精通',
                url: 'ccc'
            }
        ], // 视频列表
        breadcrumbColumn: {
            title: '我的学习',
            imgUrl: ''
        },
        isCollect: false, // 是否收藏
        isPraise: false, // 是否点赞
        introduc: [
            // 简介
            {
                title: '适用人群',
                desc: '想要转行做数据分析师的，零基础亦可想要转行做数据分析师的，零基础亦可工作中需要数据分析技能的，例如运营、产品等想要转行做数据分析师的，零基础亦可对数据分析感兴趣，想要更多了解的'
            },
            {
                title: '你将收获',
                desc: '会为你介绍数据分析的基本情况，为你展现数据分析的全貌。让你清楚知道自己该如何在数据分析地图上行走'
            },
            {
                title: '适用人群',
                desc: '会为你介绍数据分析的分析方法和模型。这部分是讲数据分析的道，只有学会底层逻辑，能够在面对问题时有自己的想法，才能够下一步采取行动<br/>会为你介绍数据分析的数据处理和常用分析方法。这篇是讲数据分析的术，先有道，后而用术来实现你的想法，得出最终的结论。<br/>会为你介绍数据分析的应用。学到这里，你对数据分析已经有了初步的认识，并通过一些案例为你展现真实的应用。'
            }
        ],
        course: [
            // 教程
            {
                title: 'Kafka实战讲解课程',
                section: 10,
                view: 20,
                cover: ''
            },
            {
                title: '雪球大数据体系探索',
                section: 10,
                view: 20,
                cover: ''
            },
            {
                title: '第7章 分布式服务治理之Kafka',
                section: 10,
                view: 20,
                cover: ''
            }
        ],
        column: [
            // 目录
            {
                title: '第一章:20分钟看懂大厂如何运用数据分析',
                children: [
                    {
                        id: '101',
                        title: '20分钟看懂大厂如何运用数据分析'
                    },
                    {
                        id: '102',
                        title: '学习资料介绍1'
                    },
                    {
                        id: '103',
                        title: '学习资料介绍2'
                    }
                ]
            },
            {
                title: '第一章:20分钟看懂大厂如何运用数据分析',
                children: [
                    {
                        id: '104',
                        title: '20分钟看懂大厂如何运用数据分析'
                    },
                    {
                        id: '105',
                        title: '学习资料介绍1'
                    },
                    {
                        id: '106',
                        title: '学习资料介绍2'
                    }
                ]
            },
            {
                title: '第一章:20分钟看懂大厂如何运用数据分析',
                children: [
                    {
                        id: '107',
                        title: '20分钟看懂大厂如何运用数据分析'
                    },
                    {
                        id: '108',
                        title: '学习资料介绍1'
                    },
                    {
                        id: '109',
                        title: '学习资料介绍2'
                    }
                ]
            }
        ]
    },
    isExpend: true,
    leftSpan: 7, // 是否展开
    columnId: '' // 视频栏目id
})
const leftSpan = computed(() => {
    return pageData.isExpend ? 7 : 0
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
/**
 * 展开收起
 */
const toggleExpend = () => {
    pageData.isExpend = !pageData.isExpend
}
/**
 * 视频栏目id
 */
const columnChange = (columnId: string) => {
    pageData.columnId = columnId
}
</script>
<style lang="scss">
.video-outer {
    margin-top: -17px;
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
        height: 40px;
        width: 18px;
        color: #fff;
        font-size: 20px;
        line-height: 40px;
        background-color: rgba($color: #fff, $alpha: 0.2);
        z-index: 1;
        cursor: pointer;

        &.expend {
            transform: rotate(180deg);
            right: -18px;
        }
    }
}
</style>
