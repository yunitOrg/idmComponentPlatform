<template>
    <div class="cp-upload" style="width:960px">
        <div class="cp-upload-title">
            <ARow>
                <ACol :span="7">
                    <div class="title-left">
                        <div class="name">{{ !state.queryId ? '发布图片' : '编辑图片' }}</div>
                    </div>
                </ACol>
                <ACol :span="17">
                    <div class="title-right">
                        <AButton type="primary" :disabled="state.saveAllLoading" @click="handleAllSave">保存并发布</AButton>
                    </div>
                </ACol>
            </ARow>
        </div>
        <div class="cp-upload-content">
            <div class="cp-dist-info">
                <div v-for="formData in state.formDataList" :key="formData.id" class="cp-dist-info-item">
                    <ASpin :spinning="formData.formLoading">
                        <AForm
                            ref="formRef"
                            class="dist-form"
                            name="dist_info"
                            :model="formData"
                            :label-col="{span: 6}"
                            :wrapper-col="{span: !state.queryId ? 16 : 18}"
                            @finish="(data: any) => onFinish(data)"
                            @finish-failed="onFinishFailed"
                        >
                            <a-form-item name="id" hidden />
                            <a-form-item name="newGuid" hidden />
                            <a-form-item name="status" hidden />
                            <a-form-item name="fileMd5" hidden />
                            <a-form-item
                                name="title"
                                label="图片名称"
                                extra="请输入1-50个字符的图片中文名，以便更好的理解图片的作用"
                                :rules="[{ required: true, message: '必填!' }, { max: 50, min: 1, message: '请输入1-50个字符' }]"
                            >
                                <a-input v-model:value="formData.title" placeholder="请输入" />
                            </a-form-item>
                            <a-form-item name="fileMd5" label="图片MD5">
                                <span class="ant-form-text">{{ formData.fileMd5 }}</span>
                            </a-form-item>
                            <a-form-item name="tags" label="图片标签">
                                <AsyncSelect
                                    v-model:value="formData.tags"
                                    mode="tags"
                                    :fieldNames="{label: 'itemValue', value: 'itemValue'}"
                                    :request="getTagsList"
                                    placeholder="请选择或输入"
                                />
                            </a-form-item>
                            <a-form-item
                                name="publishOpen"
                                label="发布范围"
                                :rules="[{ required: true, message: '必填!' }]"
                            >
                                <a-radio-group v-model:value="formData.publishOpen">
                                    <a-radio :value="1">公开</a-radio>
                                    <a-radio :value="0">指定组织</a-radio>
                                </a-radio-group>
                            </a-form-item>
                            <a-form-item
                                v-show="!formData.publishOpen"
                                name="publishRange"
                                label="指定组织"
                                :rules="[{ required: !formData.publishOpen, message: '必填!' }]"
                            >
                                <AsyncSelect
                                    v-model:value="formData.publishRange"
                                    mode="multiple"
                                    labelInValue
                                    placeholder="请选择"
                                    :fieldNames="{label: 'orgname', value: 'id'}"
                                    :request="getPublishRangeList"
                                />
                            </a-form-item>
                            <a-form-item name="imgPath" label="图片上传">
                                <IImageUpload
                                    v-model:value="formData.imgPath"
                                    :paramsData="{upFileType: 'rimage'}"
                                    :multiple="false"
                                />
                            </a-form-item>
                            <a-form-item :wrapper-col="{ span: 24}" :style="{ padding: '20px 0','text-align': 'center' }">
                                <a-button type="primary" html-type="submit" @click="() => formData.status = 1">保存并发布</a-button>
                                <a-button html-type="submit" :style="{ marginLeft: '20px' }" @click="() => formData.status = undefined">保存图片</a-button>
                                <a-button v-if="formData.status === 1" :style="{ marginLeft: '20px' }" @click="handlePublishCancel()">取消发布</a-button>
                            </a-form-item>
                        </AForm>
                    </ASpin>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { baseURL } from '@/plugins/axios'
import { reactive, createVNode } from 'vue'
import { AxiosProgressEvent } from 'axios'
import { componentPublishApi, resourcePublish, coreApi, useHomeCoreApi } from '@/apis'
import { Modal, message } from 'ant-design-vue'
import { ExclamationCircleOutlined, CheckCircleOutlined, InboxOutlined } from '@ant-design/icons-vue'
import type { FormInstance } from 'ant-design-vue'
// const router = useRouter()
const route = useRoute()
const formRef = ref()
const state = reactive<any>({
    selectedKey: '',
    uploadDisabled: false,
    saveAllLoading: false,
    formDataList: [],
    queryId: route.query?.id
})
const currentIndex: any = { value: 0 }

onMounted(() => {
    if (state.queryId) {
        state.selectedKey = state.queryId
        state.formDataList = [{
            id: state.queryId,
            formLoading: false
        }]
        getDistinfo()
    } else if (route.query?.filePath) {
        state.formDataList = [{
            id: '',
            formLoading: false
        }]
        getUploadImageInfo(route.query.filePath)
    }
})
/**
 * 获取上传的图片内的信息
 */
const getUploadImageInfo = async (imgPath: any) => {
    const index = currentIndex.value
    state.formDataList[index].formLoading = true
    const res = await resourcePublish.requestImageInfo({ imgPath })
    // fileMD5:md5信息," +
    // "dbId:对应的页面表ID," +
    // "newGuid:新的guid
    if (res.success) {
        const { newGuid, fileMD5, dbId } = res.result
        // dbId第一次可能没有数据，当保存后再次刷新就会有，如果有数据需要调用getDistinfo
        if (dbId) {
            state.formDataList[index].id = dbId
            getDistinfo()
            return
        }

        state.formDataList[index].id = dbId
        state.formDataList[index].newGuid = newGuid
        state.formDataList[index].fileMd5 = fileMD5
        state.formDataList[index].publishOpen = 1
        state.formDataList[index].tags = []
        state.formDataList[index].title = route.query?.fileName
        state.formDataList[index].imgPath = [{ src: imgPath, name: route.query?.fileName }]
    } else {
        message.error(res.message)
    }
    state.formDataList[index].formLoading = false
}
const getDistinfo = async () => {
    const index = currentIndex.value
    state.formDataList[index].formLoading = true
    const res = await resourcePublish.requestImageDistInfo({ id: state.formDataList[index].id })
    state.formDataList[index].formLoading = false
    const publishRangeList = res.result.imageInfo.publishRange ? res.result.imageInfo.publishRange.split(',') : []
    const publishRangeNameList = res.result.imageInfo.publishRangeName ? res.result.imageInfo.publishRangeName.split(',') : []
    const publishRange = publishRangeList.map((item: string, index: number) => ({ value: item, label: publishRangeNameList[index] }))
    if (res.success) {
        state.formDataList[index] = {
            ...state.formDataList[index],
            ...res.result,
            ...res.result.imageInfo,
            tags: res.result.imageInfo.tags ? res.result.imageInfo.tags.split(',') : [],
            publishRange,
            imgPath: res.result.imageInfo.imgPath ? [{ src: res.result.imageInfo.imgPath }] : []
        }
    } else {
        message.error('获取图片信息失败！')
    }
}
const handlePublishCancel = async () => {
    const index = currentIndex.value
    const title = '确定要取消发布当前图片吗？'
    // const content = '该页面下的所有已创建组件也将同时取消发布！'
    const confirmRes = await showConfirm(title, '', ExclamationCircleOutlined)
    if (confirmRes) {
        state.formDataList[index].formLoading = true
        const res = await resourcePublish.requestChangeStatus({ id: state.formDataList[index].id, status: 0, type: 'image' })
        state.formDataList[index].formLoading = false
        if (res.success) {
            message.success('取消发布成功！')
        } else {
            message.error('取消发布失败！')
        }
    }
}
const onFinish = async (data: any, i?: any) => {
    const index = i || currentIndex.value
    const params = {
        ...data,
        tags: data.tags.join(','),
        publishRange: data.publishOpen === 0 ? data.publishRange?.map((item: any) => item.value).join(',') : undefined,
        imgPath: data.imgPath && data.imgPath[0] ? data.imgPath[0].src : '',
        imgFileName: data.imgPath && data.imgPath[0] ? data.imgPath[0].name : '',
        publishRangeName: data.publishOpen === 0 ? data.publishRange?.map((item: any) => item.label).join(',') : undefined
    }
    state.formDataList[index].formLoading = true
    const res = await resourcePublish.requestSaveImage(params)
    state.formDataList[index].id = state.formDataList[index].id || state.formDataList[index].newGuid
    state.formDataList[index].formLoading = false
    if (data.closeMessage) {
        return res
    }
    if (res.success) {
        if (data.status) {
            message.success('保存并发布成功！')
        } else {
            message.success('保存成功！')
        }
    } else {
        if (data.status) {
            message.error('保存并发布失败！')
        } else {
            message.error('保存失败！')
        }
    }
}
const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
    message.error('表单校验失败，请检查！')
}
const handleAllSave = () => {
    state.saveAllLoading = true
    const promiseArr = formRef.value?.map((ref: FormInstance) => ref.validate())
    Promise.all(promiseArr).then((dataList: any) => {
        if (dataList && dataList.length) {
            const finishArr: any[] = []
            dataList.forEach((data: any, index: any) => {
                // state.selectedKey = data.codePackageId
                finishArr.push(onFinish({ ...data, status: 1, closeMessage: true }, index))
            })
            Promise.all(finishArr).then(async (resList) => {
                state.saveAllLoading = false
                if (resList.some((res: any) => !res.success)) {
                    message.error('操作失败！')
                } else {
                    message.success('保存并发布成功！')
                }
            })
        }
    }).catch((err: any) => {
        state.saveAllLoading = false
        state.selectedKey = err.values.id
        message.error('表单校验失败，请检查！')
    })
}
const getTagsList = async () => {
    return await coreApi.requestWebInfoListByGroup({ groupCd: 'imageTags' })
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
    background: #FFF;
    border-radius: 5px;
    box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.06);
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
        border-bottom: 1px solid rgba(230, 230, 230, 1);
        padding: 0 20px;
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
        .title-right {
            display: flex;
            height: 60px;
            flex-direction: row-reverse;
            align-items: center;
        }
    }
    .cp-upload-content {
        .cp-dist-list {
            height: 100%;
            overflow: auto;
            border-right: 1px solid rgba(230, 230, 230, 1);
            .item {
                padding: 20px;
                cursor: pointer;
                &.selected {
                    transition: background-color .3s;
                    background-color: #f3f3f3;
                    .name {
                        transition: color .3s;
                        color: #1890ff;
                    }
                }
                &:hover {
                    .name {
                        transition: color .3s;
                        color: #1890ff;
                    }
                }
                .name {
                    font-size: 16px;
                    font-weight: 600;
                    margin-bottom: 15px;
                }
                .meta {
                    display: flex;
                    justify-content: space-between;
                    font-size: 14px;
                    color: #666;
                    .info {
                        flex: 1;
                        span {
                            margin-right: 10px;
                            &:last-child {
                                margin-left: 10px;
                            }
                        }
                        .success {
                            color: #52c41a;
                        }
                        .error {
                            color: #ff4d4f;
                        }
                    }
                }
            }
        }
        .cp-dist-info {
            min-height: 660px;
            .cp-dist-info-item {
                height: 100%;
                .dist-form {
                    margin: 20px 40px;
                    .dist-form-title {
                        font-size: 16px;
                        font-weight: 600;
                        margin-bottom: 20px;
                    }
                    .dist-form-title-sub {
                        font-size: 14px;
                        font-weight: 600;
                        margin-bottom: 20px;
                    }
                    :deep(.ant-form-item-extra) {
                        min-height: unset;
                    }
                }
                :deep(.ant-empty-image) {
                    margin-top: 200px;
                }
            }
        }
    }
}
</style>
