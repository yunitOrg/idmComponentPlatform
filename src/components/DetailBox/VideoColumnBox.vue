<template>
    <div class="idm-component-common-box video-column-box">
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
                    <div class="introduc-item-title">适合人群</div>
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
                        <div class="course-item-desc">{{ item.vedioNumber }}节课 · {{ item.readNumber }}人学习</div>
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
    height: 490px;
    ::v-deep .ant-tabs {
        color: #605f5f;
        height: 100%;
        .ant-tabs-nav-list {
            padding: 0 14px;
        }
        .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
            color: #d60303;
        }
        .ant-tabs-ink-bar {
            background-color: #d60303;
        }
        &.ant-tabs-top > .ant-tabs-nav::before {
            border-bottom: 1px solid #444;
        }
        .ant-tabs-content-holder {
            height: calc(100% - 62px);
            padding: 0 20px 20px 30px;
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
        .ant-tabs-tab:hover {
            color: #d60303;
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
            background-color: rgb(77, 77, 77);
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
            padding: 10px 0;
            border: 1px solid rgb(77, 77, 77);
            border-top: none;
        }
    }
    .colunm-item {
        display: flex;
        color: #b9b8b8;
        line-height: 24px;
        margin-bottom: 6px;
        padding: 4px 6px;
        cursor: pointer;
        &:last-child {
            margin-bottom: 0;
        }
        .colunm-item-icon {
            font-size: 24px;
            margin: 0 6px;
        }
        &.active {
            background-color: rgb(77, 77, 77);
            color: #fff;
        }
    }
}
</style>
