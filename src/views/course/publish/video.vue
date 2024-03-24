<template>
    <div class="cp-upload" :style="{ width: '960px', 'min-height': '500px' }">
        <div class="cp-upload-title">
            <div class="title-left">
                <div class="name">{{ !state.courseId ? '发布视频教程' : '编辑视频教程' }}</div>
            </div>
        </div>
        <div class="cp-upload-content">
            <div class="cp-dist-info">
                <ASpin :spinning="state.formData.formLoading">
                    <AForm
                        ref="formRef"
                        class="dist-form"
                        name="dist_info"
                        :model="state.formData"
                        :label-col="{ span: 4 }"
                        :wrapper-col="{ span: !state.courseId ? 16 : 18 }"
                        @finish="(data: any) => onFinish(data)"
                        @finish-failed="onFinishFailed">
                        <a-form-item name="id" hidden />
                        <a-form-item name="status" hidden />
                        <a-form-item name="coverUrl" label="封面">
                            <IImageUpload v-model:value="state.formData.coverUrl" :paramsData="{ upFileType: 'image' }" />
                        </a-form-item>
                        <a-form-item
                            name="title"
                            label="教程标题"
                            :rules="[
                                { required: true, message: '必填!' },
                                { max: 20, min: 2, message: '请输入2-20个字符' }
                            ]">
                            <a-input v-model:value="state.formData.title" placeholder="请输入" />
                        </a-form-item>
                        <a-form-item name="personRange" label="教程简介" :wrapper-col="{ span: !state.courseId ? 16 : 18 }" help="适用人群">
                            <a-textarea v-model:value="state.formData.personRange" :rows="2" placeholder="请输入适用人群描述" />
                        </a-form-item>
                        <a-form-item name="reapContent" :wrapper-col="{ span: !state.courseId ? 16 : 18, offset: 4 }" help="你将收获">
                            <a-textarea v-model:value="state.formData.reapContent" :rows="3" placeholder="请输入你将收获描述" />
                        </a-form-item>
                        <a-form-item name="introduction" :wrapper-col="{ span: !state.courseId ? 16 : 18, offset: 4 }" help="教程介绍">
                            <a-textarea v-model:value="state.formData.introduction" :rows="4" placeholder="请输入教程介绍描述" />
                        </a-form-item>
                        <a-form-item name="tags" label="教程标签">
                            <AsyncSelect
                                v-model:value="state.formData.tags"
                                mode="tags"
                                :fieldNames="{ label: 'itemValue', value: 'itemValue' }"
                                :request="getTagsList"
                                placeholder="请选择或输入" />
                        </a-form-item>
                        <a-form-item name="publishOpen" label="发布范围" :rules="[{ required: true, message: '必填!' }]">
                            <a-radio-group v-model:value="state.formData.publishOpen">
                                <a-radio :value="1">公开</a-radio>
                                <a-radio :value="0">指定组织</a-radio>
                            </a-radio-group>
                        </a-form-item>
                        <a-form-item
                            v-show="!state.formData.publishOpen"
                            name="publishRange"
                            label="指定组织"
                            :rules="[{ required: !state.formData.publishOpen, message: '必填!' }]">
                            <AsyncSelect
                                v-model:value="state.formData.publishRange"
                                mode="multiple"
                                labelInValue
                                placeholder="请选择"
                                :fieldNames="{ label: 'orgname', value: 'id' }"
                                :request="getPublishRangeList" />
                        </a-form-item>
                        <a-form-item name="relationComponentIds" label="关联组件" help="选择教程中所提到的相关组件进行关联，方便组件快速查看相关教程">
                            <AsyncSelect
                                v-model:value="state.formData.relationComponentIds"
                                asyncSearch
                                labelInValue
                                mode="multiple"
                                :fieldNames="{ label: 'comTitle', value: 'id' }"
                                placeholder="请查询后选择"
                                :request="getComponentList" />
                        </a-form-item>
                        <a-form-item name="attachment" label="相关附件">
                            <IFileUpload v-model:value="state.formData.attachment" accept="" multiple :paramsData="{ upFileType: 'other' }" />
                        </a-form-item>
                        <a-form-item :wrapper-col="{ span: 24, offset: 8 }" :style="{ padding: '20px 0' }">
                            <a-button type="primary" html-type="submit" shape="round" @click="() => (state.formData.status = 1)">
                                {{ !state.courseId ? '发布教程，去上传视频' : '重新发布教程，去上传视频' }}
                            </a-button>
                            <a-button :style="{ marginLeft: '20px' }" shape="round" @click="handlePublishCancel()">取消</a-button>
                        </a-form-item>
                        <a-alert type="warning" closable :style="{ marginBottom: '20px' }">
                            <template #description> 声明：请确保您上传的内容合法合规，涉及侵权内容将会被移除，详见 <a href="">《云IT资源共享规范》</a> </template>
                        </a-alert>
                    </AForm>
                </ASpin>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { reactive, createVNode } from 'vue'
import { coreApi, useHomeCoreApi, useCourseApi } from '@/apis'
import { Modal, message } from 'ant-design-vue'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
const route = useRoute()
const router = useRouter()
const formRef = ref()

// 操作数据后更新视图

const state = reactive<any>({
    courseId: route.query?.courseId,
    formData: {
        formLoading: false,
        coverUrl: [], // 封面
        status: '',
        title: '',
        tags: [],
        publishOpen: 1,
        publishRange: [],
        relationComponentIds: [],
        attachment: [],
        reapContent: '',
        personRange: '',
        introduction: ''
    }
})

onMounted(() => {
    if (state.courseId) {
        state.formData.id = state.courseId
        getDistinfo()
    }
})

const getDistinfo = async () => {
    state.formData.formLoading = true
    const res = await useCourseApi.requestGetCourseDetail({ courseId: state.courseId })
    state.formData.formLoading = false
    console.log(res)
    if (res.success) {
        const publishRangeList = res.result.courseInfo.publishRange ? res.result.courseInfo.publishRange.split(',') : []
        const publishRangeNameList = res.result.courseInfo.publishRangeName ? res.result.courseInfo.publishRangeName.split(',') : []
        const publishRange = publishRangeList.map((item: string, index: number) => ({ value: item, label: publishRangeNameList[index] }))
        const relationComponentIds = res.result.componentInfoList.map((item: any) => ({ key: item.id, value: item.id, label: item.comTitle }))
        state.formData = {
            ...state.formData,
            ...res.result,
            ...res.result.courseInfo,
            tags: res.result.courseInfo.tags ? res.result.courseInfo.tags.split(',') : [],
            relationComponentIds,
            publishRange,
            coverUrl: res.result.courseInfo.coverUrl ? [{ src: res.result.courseInfo.coverUrl }] : [],
            attachment: res.result.courseInfo.attachment ? JSON.parse(res.result.courseInfo.attachment) : []
        }
    } else {
        message.error('获取教程信息失败！')
    }
}

const handlePublishCancel = async () => {
    if (state.courseId) {
        const title = '确定要取消发布当前教程吗？'
        const confirmRes = await showConfirm(title, '', ExclamationCircleOutlined)
        if (confirmRes) {
            useCourseApi
                .requestCourseDeleteBatch({ ids: state.courseId })
                .then((res) => {
                    if (res.success) {
                        message.success('取消发布成功')
                        router.push('/')
                    } else {
                        message.success('取消发布失败')
                    }
                })
                .catch(() => {
                    message.error('请求失败！')
                })
        }
    } else {
        router.push('/')
    }
}
const onFinish = async (data: any) => {
    console.log(data)
    const params = {
        ...data,
        type: 0,
        coverUrl: data.coverUrl && data.coverUrl[0] ? data.coverUrl[0].src : '',
        tags: data.tags.join(','),
        relationComponentIds: data.relationComponentIds.map((item: any) => item.key).join(','),
        publishRange: data.publishOpen === 0 ? data.publishRange.map((item: any) => item.value).join(',') : undefined,
        publishRangeName: data.publishOpen === 0 ? data.publishRange.map((item: any) => item.label).join(',') : undefined,
        attachment: JSON.stringify(data.attachment)
    }
    state.formData.formLoading = true
    const res = await useCourseApi.requestCourseSave(params)
    state.formData.formLoading = false
    if (res.success) {
        router.push({ name: 'index-coursePublish-video-edit', query: { courseId: res.result.id } })
        message.success('发布成功，正在打开教程章节维护！')
    } else {
        message.error('发布失败')
    }
}
const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
    message.error('表单校验失败，请检查！')
}
const getTagsList = async () => {
    return await coreApi.requestWebInfoListByGroup({ groupCd: 'course' }) // todo 教程标签id
}
const getComponentList = async (text: string) => {
    return await coreApi.requestSearchComponent({ searchTxt: text })
}
const getPublishRangeList = async () => {
    return await useHomeCoreApi.requestCoreMyOrgList()
}
const showConfirm = (title: string, content: string, icon: any, iconColor?: string) => {
    return new Promise((resolve) => {
        Modal.confirm({
            icon: iconColor ? createVNode(icon, { style: { color: iconColor } }) : createVNode(icon),
            title,
            content,
            cancelText: '取消',
            okText: '确定',
            onOk() {
                resolve(true)
            },
            onCancel() {
                resolve(false)
            }
        })
    })
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
}
</style>
