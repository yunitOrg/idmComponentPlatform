<template>
    <div class="cp-upload" :style="{ width: '960px', 'min-height': '500px' }">
        <div class="cp-upload-title">
            <div class="title-left">
                <div class="name">{{ !state.courseId ? '上传电子书' : '编辑电子书' }}</div>
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
                        :wrapper-col="{ span: !state.queryId ? 16 : 18 }"
                        @finish="(data: any) => onFinish(data)"
                        @finish-failed="onFinishFailed">
                        <a-form-item name="id" hidden />
                        <a-form-item name="status" hidden />
                        <a-form-item name="ebook" :wrapper-col="{ span: 24, offset: 2 }">
                            <div class="upload-container-outer" :class="{ active: state.formData.ebook.length > 0 }">
                                <IFileUpload v-model:value="state.formData.ebook" accept=".txt,.pdf" :paramsData="{ upFileType: 'other' }">
                                    <div class="upload-container">
                                        <PlusOutlined style="font-size: 20px; margin-right: 20px" /> 点击<a>上传资源</a> 、文件小于1000.00MB
                                        <span class="upload-container-tips">温馨提示：请不要上传电子书等存在侵权内容的资源哦！</span>
                                    </div>
                                </IFileUpload>
                            </div>
                        </a-form-item>
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
                        <a-form-item name="introduction" label="教程简介">
                            <a-textarea v-model:value="state.formData.introduction" :rows="2" placeholder="请输入适用人群描述" />
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
                            <a-button type="primary" html-type="submit" shape="round" @click="() => (state.formData.status = 1)">发布教程</a-button>
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
// import { ExclamationCircleOutlined, CheckCircleOutlined } from '@ant-design/icons-vue'
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons-vue'
const route = useRoute()
const router = useRouter()
const formRef = ref()
const state = reactive<any>({
    distList: [],
    selectedKey: '',
    uploadDisabled: false,
    saveAllLoading: false,
    formDataList: [],
    codeLangueList: [],
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
        introduction: '',
        ebook: []
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
            attachment: res.result.courseInfo.attachment ? JSON.parse(res.result.courseInfo.attachment) : [],
            ebook: res.result.courseInfo.ebookPath ? [{ name: res.result.courseInfo.ebookName, url: res.result.courseInfo.ebookPath, loading: false, size: 0 }] : []
        }
        console.log(state.formData, 11111)
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
        type: 2,
        coverUrl: data.coverUrl && data.coverUrl[0] ? data.coverUrl[0].src : '',
        tags: data.tags.join(','),
        relationComponentIds: data.relationComponentIds.map((item: any) => item.key).join(','),
        publishRange: data.publishOpen === 0 ? data.publishRange.map((item: any) => item.value).join(',') : undefined,
        publishRangeName: data.publishOpen === 0 ? data.publishRange.map((item: any) => item.label).join(',') : undefined,
        attachment: JSON.stringify(data.attachment),
        ebookName: data.ebook[0].name,
        ebookPath: data.ebook[0].url
    }
    state.formData.formLoading = true
    const res = await useCourseApi.requestCourseSave(params)
    state.formData.formLoading = false
    if (res.success) {
        message.success('电子书教程发布成功！')
        router.push('/creativeCenter/courseManageList?type=2')
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
    .cp-upload-content {
        :deep(.upload-container-outer) {
            border: 1px dashed #ccc;
            height: 56px;
            .upload-container {
                cursor: pointer;
                padding: 0 30px;
                height: 56px;
                line-height: 56px;
                .upload-container-tips {
                    color: rgb(241, 158, 151);
                    margin-left: 14px;
                }
            }
            & > div {
                height: 100%;
                .file-item {
                    height: 100%;
                    font-size: 18px;
                }
            }
        }
    }
}
</style>
