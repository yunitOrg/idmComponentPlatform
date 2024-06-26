<template>
    <div class="idm-component-common-box video-column-box" :style="`max-height:${maxHeight}`">
        <a-tabs v-model:activeKey="pageData.activeKey">
            <a-tab-pane key="1" tab="目录">
                <a-collapse v-model:activeKey="pageData.collapseActiveKey" expandIconPosition="right">
                    <a-collapse-panel v-for="item in pageData.courseVedioList" :key="item.id" :header="item.title">
                        <div
                            v-for="(child, i) in item.vedioModelList"
                            :key="i"
                            class="colunm-item"
                            :class="{ active: child.id === pageData.playingId }"
                            @click="colunmClick(child)">
                            <div class="colunm-item-icon">
                                <svg-icon v-if="child.id === pageData.playingId" iconClass="playing"></svg-icon>
                                <svg-icon v-else iconClass="play"></svg-icon>
                            </div>
                            <span>{{ child.title }}</span>
                        </div>
                    </a-collapse-panel>
                </a-collapse>
            </a-tab-pane>
            <a-tab-pane key="2" tab="简介">
                <div class="introduc-item">
                    <div class="introduc-item-title">适用人群</div>
                    <div class="introduc-item-desc" v-text="props.courseInfo.personRange"></div>
                </div>
                <div class="introduc-item">
                    <div class="introduc-item-title">你将收获</div>
                    <div class="introduc-item-desc" v-text="props.courseInfo.reapContent"></div>
                </div>
                <div class="introduc-item">
                    <div class="introduc-item-title">教程介绍</div>
                    <div class="introduc-item-desc" v-text="props.courseInfo.introduction"></div>
                </div>
            </a-tab-pane>
            <a-tab-pane key="3" tab="作者教程">
                <div v-for="(item, index) in pageData.courseList" :key="index" class="course-item" @click="hanldeCourseClick(item.id)">
                    <img class="course-item-img" :src="getImagePath(item.coverUrl) || componentMarketDetault" />
                    <div class="course-item-right">
                        <div class="course-item-title">{{ item.title }}</div>
                        <div class="course-item-desc">{{ item.vedioNumber }}节课&nbsp;&nbsp;●&nbsp;&nbsp;{{ item.readNumber }}人学习</div>
                    </div>
                </div>
            </a-tab-pane>
        </a-tabs>
    </div>
</template>

<script lang="ts" setup>
import { getImagePath } from '@/utils'
import { componentMarketDetault } from '@/assets/images'
import { useCourseApi } from '@/apis'
const props = defineProps({
    courseInfo: {
        type: Object,
        default: () => {}
    },
    courseVedioList: {
        type: Array,
        default: () => []
    },
    courseUserInfo: {
        type: Object,
        default: () => {}
    },
    maxHeight: {
        type: String,
        default: ''
    }
})
watch(
    () => props.courseVedioList,
    (newV) => {
        if (newV.length > 0) {
            setUpVideoData(props.courseVedioList)
            pageData.collapseActiveKey = pageData.courseVedioList?.[0]?.id
            pageData.playingId = pageData.courseVedioList?.[0]?.vedioModelList?.[0]?.id
            emit('columnChange', pageData.courseVedioList?.[0]?.vedioModelList?.[0])
        }
    }
)
watch(
    () => props.courseUserInfo,
    (newV) => {
        if (newV.id) {
            handleFetchAuthorData()
        }
    }
)
const pageData = reactive({
    activeKey: '1',
    collapseActiveKey: 0,
    playingId: '',
    courseVedioList: [] as any,
    courseList: [] as any
})
const emit = defineEmits(['columnChange'])
const colunmClick = (videoInfo: any) => {
    pageData.playingId = videoInfo.id
    emit('columnChange', videoInfo)
}
const setUpVideoData = (data: any) => {
    const courseVedioList: any[] = []
    // 先拿出有无fid的，一级章节
    data.forEach((item: any) => {
        if (!item.fid) {
            courseVedioList.push({
                ...item,
                vedioModelList: []
            })
        }
    })
    data.forEach((item: any) => {
        if (item.fid) {
            courseVedioList.forEach((section: any) => {
                if (item.fid === section.id) {
                    section.vedioModelList.push(item)
                }
            })
        }
    })
    pageData.courseVedioList = courseVedioList
}
const handleFetchAuthorData = () => {
    useCourseApi
        .requestGetCourseList({
            pageNo: 1,
            pageSize: 10,
            userId: props.courseUserInfo.id,
            type: 0
        })
        .then((res) => {
            if (res.success) {
                pageData.courseList = res.result.records
            }
        })
}
const hanldeCourseClick = (id:string) => {
    window.open(`/videoDetail?courseId=${id}`, '_blank')
}
onMounted(() => {})
</script>

<style lang="scss" scoped>
.video-column-box {
    position: relative;
    background-color: rgb(44, 44, 44);
    height: 100%;
    ::v-deep .ant-tabs {
        color: #605f5f;
        height: 100%;
        .ant-tabs-nav-list {
            padding: 0 14px;
        }
        .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
            color: #FC5531;
        }
        .ant-tabs-ink-bar {
            background-color: #FC5531;
            bottom: 5px;
        }
        &.ant-tabs-top > .ant-tabs-nav::before {
            border-bottom: 1px solid rgb(34, 34, 34);
        }
        .ant-tabs-content-holder {
            height: calc(100% - 62px);
            padding: 0 15px 15px 15px;
            .ant-tabs-content {
                height: 100%;
                overflow: auto;
                &::-webkit-scrollbar {
                    width: 3px;
                    height: 3px;
                }
                &::-webkit-scrollbar-thumb {
                    min-height: 28px;
                    border-radius: 4px;
                    background-color: #cccccc;
                }
                &::-webkit-scrollbar-track-piece,
                &::-webkit-scrollbar-corner {
                    background-color: transparent;
                }
            }
        }
        .ant-tabs-tab {
            font-size: 16px;
        }
        .ant-tabs-tab:hover {
            color: #FC5531;
        }
    }

    .introduc-item {
        color: #ccc;
        padding-bottom: 10px;
        &:last-child {
            padding-bottom: 0;
        }
        .introduc-item-title {
            position: relative;
            font-size: 16px;
            padding-left: 12px;
            margin-bottom: 10px;

            &::before {
                content: '';
                display: block;
                position: absolute;
                width: 2px;
                height: 20px;
                background-color: #797979;
                left: 0;
                top: 0;
                bottom: 0;
                margin: auto 0;
            }
        }
        .introduc-item-desc{
            padding: 0 10px;
            font-size: 12px;
        }
    }
    .course-item {
        color: #ccc;
        padding-bottom: 10px;
        display: flex;
        cursor: pointer;

        .course-item-img {
            width: 100px;
            height: 60px;
            border-radius: 4px;
        }
        .course-item-right {
            width: calc(100% - 100px);
            padding: 6px 14px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .course-item-title {
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                width: 100%;
            }
            .course-item-desc {
                font-size: 12px;
                color: #8a8989;
            }
        }
    }

    ::v-deep .ant-collapse {
        background: transparent;
        border: none;
        .ant-collapse-header {
            background-color: rgb(55 55 55);
            color: #fff;
        }
        .ant-collapse-content {
            background: transparent;
            border: none;
        }
        & > .ant-collapse-item {
            border: none;
            margin-bottom: 10px;
            &:last-child {
                margin-bottom: 0;
            }
        }
        .ant-collapse-content-box {
            padding: 10px 0 0;
            border: none;
            border-top: none;
        }
    }
    .colunm-item {
        display: flex;
        color: #b9b8b8;
        margin-bottom: 6px;
        padding: 2px 6px;
        cursor: pointer;
        font-size: 12px;
        &:last-child {
            margin-bottom: 0;
        }
        .colunm-item-icon {
            font-size: 12px;
            margin: 0 6px;
        }
        &.active {
            color: #FC5531;
        }
    }
}
</style>
