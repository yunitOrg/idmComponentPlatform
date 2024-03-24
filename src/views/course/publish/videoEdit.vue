<template>
    <div class="cp-upload" :style="{ width: '960px', 'min-height': '500px' }">
        <div class="cp-upload-title">
            <div class="title-left">
                <div class="name">教程章节维护</div>
            </div>
        </div>
        <div :key="state.pageKey" class="section-container">
            <div class="section-outer">
                <section v-for="(item, index) in state.sectionServiceList" :key="index" class="section-service-item">
                    <div class="section-service-item-content">
                        <a-input v-model:value="item.title" placeholder="请输入章节名称，例如：第一章：30分钟成就配置门户首页高手" />
                        <PlusCircleOutlined @click="addSection(index)" />
                        <MinusCircleOutlined @click="delSection(index)" />
                    </div>
                    <div class="section-service-item-video">
                        <div v-for="(video, i) in item.vedioModelList" :key="i" class="video-section">
                            <span class="video-index">{{ i + 1 }}</span>
                            <a-input v-model:value="video.title" placeholder="请输入视频名称" />
                            <div class="video-upload">
                                <IFileUpload v-model:value="video.filePath" accept=".mp4,.avi,.wmv,.rm,.ram,.mov,.flv" :paramsData="{ upFileType: 'other' }">
                                    <div class="upload-container"><PlusOutlined style="font-size: 20px; margin-right: 20px" /> 点击<a>上传资源</a> 、文件小于1000.00MB</div>
                                </IFileUpload>
                            </div>
                            <PlusCircleOutlined @click="addVideo(index, i)" />
                            <MinusCircleOutlined @click="delVideo(index, i)" />
                        </div>
                    </div>
                </section>
            </div>
            <div class="btn-outer">
                <a-button type="primary" shape="round" @click="publishVideo">发布</a-button>
                <a-button :style="{ marginLeft: '20px' }" shape="round" @click="cancelVideo">取消</a-button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { useCourseApi } from '@/apis'
import { message } from 'ant-design-vue'
import { PlusCircleOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons-vue'
const route = useRoute()
const router = useRouter()

// 操作数据后更新视图

const state = reactive<any>({
    courseId: route.query?.courseId,
    formData: {},
    sectionServiceList: [
        {
            title: '',
            type: 0,
            sort: 0,
            vedioModelList: [
                {
                    title: '',
                    sort: 0,
                    type: 1,
                    filePath: []
                }
            ]
        }
    ]
})

onMounted(() => {
    if (state.courseId) {
        state.formData.id = state.courseId
        getDistinfo()
    }
})

const getDistinfo = async () => {
    const res = await useCourseApi.requestGetCourseDetail({ courseId: state.courseId })
    if (res.success) {
        state.formData = {
            ...state.formData,
            ...res.result,
            ...res.result.courseInfo
        }
        res.result.courseVedioList.length > 0 && setUpVideoData(res.result.courseVedioList)
    } else {
        message.error('获取教程信息失败！')
    }
}

const setUpVideoData = (data: any) => {
    const courseVedioList: any[] = []
    // 先拿出有无fid的，一级章节
    data.forEach((item: any) => {
        item.filePath = item.filePath ? [{ name: item.fileName, url: item.filePath, loading: false, size: item.fileSize }] : []
        if (!item.fid) {
            item.vedioModelList = []
            courseVedioList.push(item)
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
    state.sectionServiceList = courseVedioList
}
const addSection = (index: number) => {
    state.sectionServiceList.splice(index + 1, 0, {
        title: '',
        type: 0,
        sort: 0,
        vedioModelList: [
            {
                title: '',
                sort: 0,
                type: 1,
                filePath: []
            }
        ]
    })
}
const delSection = async (index: number) => {
    if (state.sectionServiceList.length === 1) {
        return message.warning('至少保留一个章节')
    }
    if (state.courseId) {
        const res = await useCourseApi.requestdeleteCourseVedio({
            id: state.sectionServiceList[index].id
        })
        if (res.success) {
            state.sectionServiceList.splice(index, 1)
            message.success('删除成功')
        } else {
            message.error('删除失败')
        }
    } else {
        state.sectionServiceList.splice(index, 1)
    }
}
const addVideo = (index: number, i: number) => {
    state.sectionServiceList[index].vedioModelList.splice(i + 1, 0, {
        title: '',
        sort: 0,
        type: 1,
        filePath: []
    })
}
const delVideo = async (index: number, i: number) => {
    if (state.sectionServiceList[index].vedioModelList.length === 1) {
        return message.warning('每个章节至少保留一个视频')
    }
    if (state.courseId) {
        const res = await useCourseApi.requestdeleteCourseVedio({
            id: state.sectionServiceList[index].vedioModelList[i].id
        })
        if (res.success) {
            state.sectionServiceList[index].vedioModelList.splice(i, 1)
            message.success('删除成功')
        } else {
            message.error('删除失败')
        }
    } else {
        state.sectionServiceList[index].vedioModelList.splice(i, 1)
    }
}
const publishVideo = async () => {
    let flag = true
    state.sectionServiceList.forEach((item: any) => {
        if (!item.title) flag = false
        item.vedioModelList.forEach((child: any) => {
            if (!child.title || child.filePath.length === 0) flag = false
        })
    })
    if (flag) {
        const params = JSON.parse(JSON.stringify(state.sectionServiceList))
        let vedioNumber = 0
        params.forEach((item: any, index: number) => {
            item.sort = index
            item.filePath = ''
            item.courseId = state.formData.id
            item.vedioModelList.forEach((video: any, i: number) => {
                video.sort = i
                video.fileName = video.filePath[0].name
                video.fileSize = video.filePath[0].size
                video.filePath = video.filePath[0].url
                video.courseId = state.formData.id
                vedioNumber++
            })
        })
        const res = await useCourseApi.requestSaveVedioList(params)
        if (res.success) {
            console.log({
                ...state.formData,
                vedioNumber
            }, 11111)
            const saveRes = await useCourseApi.requestCourseSave({
                ...state.formData,
                vedioNumber
            })
            if (saveRes.success) {
                message.success('视频教程发布成功')
                router.push('/creativeCenter/courseManageList?type=0')
            } else {
                message.error('发布失败')
            }
        } else {
            message.error('发布失败')
        }
    } else {
        message.warning('请检查章节名称、视频名称、视频资源是否完整')
    }
}
const cancelVideo = () => {
    router.push('/')
}
</script>

<style lang="scss" scoped>
.cp-upload {
    margin: 20px auto;
    background: #fff;
    border-radius: 5px;
    box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.06);
    padding: 20px 30px;
    display: flex;
    flex-direction: column;
    :deep(.cp-upload-dragger) {
        margin-top: 60px;
        .ant-upload-drag-icon {
            padding-top: 60px;
        }
        .ant-upload-notice {
            text-align: left;
            color: #ff8200;
            padding: 60px 100px;
        }
    }
    // padding: 0 20px;
    .cp-upload-title {
        .title-left {
            display: flex;
            height: 60px;
            justify-content: space-between;
            align-items: center;
            margin-right: 10px;
            .name {
                font-size: 16px;
                line-height: 32px;
                font-weight: bold;
            }
        }
    }

    .section-container {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .section-service-item {
            font-size: 26px;
            color: #797979;
            .section-service-item-content {
                display: flex;
                align-items: center;
            }
            .anticon {
                margin-left: 20px;
            }
            .section-service-item-video {
                width: 100%;
                padding: 20px 70px 20px 20px;
                .video-section {
                    display: flex;
                    align-items: center;

                    .video-index {
                        margin-right: 20px;
                    }

                    .ant-input {
                        height: 32px;
                        flex: 1;
                        margin-right: 20px;
                    }

                    .upload-container {
                        border: 1px dashed #ccc;
                        cursor: pointer;
                        height: 32px;
                        line-height: 32px;
                        padding-right: 30px;
                        display: flex;
                        align-items: center;
                    }
                    .video-upload {
                        height: 32px;
                        line-height: 32px;
                        width: 315px;
                        font-size: 14px;
                        :v-deep & > span {
                            width: 100%;
                        }
                        :deep(.file-item > span) {
                            overflow: hidden;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                        }
                    }
                }
            }
        }

        .btn-outer {
            display: flex;
            justify-content: center;
            margin-bottom: 20px;
        }
    }
}
</style>
