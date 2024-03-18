<template>
    <div class="cp-upload" :style="{ width: '960px', 'min-height': '500px' }">
        <div class="cp-upload-title">
            <div class="title-left">
                <div class="name">上传电子书</div>
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
                        <a-form-item name="coverPath" :wrapper-col="{ span: 24, offset: 2 }">
                            <div class="upload-container-outer" :class="{active:state.formData.resource.length>0}">
                                <IFileUpload v-model:value="state.formData.resource" :paramsData="{ upFileType: 'runCode' }">
                                    <div class="upload-container">
                                        <PlusOutlined style="font-size: 20px; margin-right: 20px" /> 点击<a href="">上传资源</a> 、文件小于1000.00MB
                                        <span class="upload-container-tips">温馨提示：请不要上传电子书等存在侵权内容的资源哦！</span>
                                    </div>
                                </IFileUpload>
                            </div>
                        </a-form-item>
                        <a-form-item name="coverPath" label="封面">
                            <IImageUpload v-model:value="state.formData.coverPath" :paramsData="{ upFileType: 'image' }" />
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
                        <a-form-item name="currentRemark" label="教程简介">
                            <a-textarea v-model:value="state.formData.remark" :rows="2" placeholder="请输入适用人群描述" />
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
                        <a-form-item name="relateComponent" label="关联组件" help="选择教程中所提到的相关组件进行关联，方便组件快速查看相关教程">
                            <AsyncSelect
                                v-model:value="state.formData.relateComponent"
                                asyncSearch
                                labelInValue
                                mode="multiple"
                                :fieldNames="{ label: 'nickname', value: 'id' }"
                                placeholder="请查询后选择"
                                :request="getCooperationUserList" />
                        </a-form-item>
                        <a-form-item name="attachment" extra="支持文件后缀：.rar .zip" label="相关附件">
                            <IFileUpload v-model:value="state.formData.attachment" :paramsData="{ upFileType: 'runCode' }" />
                        </a-form-item>
                        <a-form-item :wrapper-col="{ span: 24, offset: 8 }" :style="{ padding: '20px 0' }">
                            <a-button type="primary" html-type="submit" @click="() => (state.formData.status = 1)">发布教程</a-button>
                            <a-button :style="{ marginLeft: '20px' }" @click="handlePublishCancel()">取消</a-button>
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
import { componentPublishApi, coreApi, useHomeCoreApi } from '@/apis'
import { Modal, message } from 'ant-design-vue'
// import { ExclamationCircleOutlined, CheckCircleOutlined } from '@ant-design/icons-vue'
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons-vue'
const route = useRoute()
const formRef = ref()
const state = reactive<any>({
    distList: [],
    selectedKey: '',
    uploadDisabled: false,
    saveAllLoading: false,
    formDataList: [],
    codeLangueList: [],
    queryId: route.query?.codePackageId,
    formData: {
        formLoading: false,
        id: '',
        coverPath: [], // 封面
        status: '',
        title: '',
        tags: [],
        publishOpen: 1,
        publishRange: [],
        relateComponent: [],
        attachment: [],
        remark: '',
        resource: []
    }
})
const currentIndex: any = computed(() => state.formDataList.findIndex((item: any) => item.codePackageId === state.selectedKey))

onMounted(() => {
    getCodeLangueList()
    if (state.queryId) {
        state.selectedKey = state.queryId
        state.formDataList = [
            {
                codePackageId: state.queryId,
                formLoading: false
            }
        ]
        getDistinfo()
    }
})

const getDistinfo = async () => {
    const index = currentIndex.value
    state.formDataList[index].formLoading = true
    const res = await componentPublishApi.requestDistInfo({ codePackageId: state.formDataList[index].codePackageId })
    state.formDataList[index].formLoading = false
    const publishRangeList = res.result.codePackage.publishRange ? res.result.codePackage.publishRange.split(',') : []
    const publishRangeNameList = res.result.codePackage.publishRangeName ? res.result.codePackage.publishRangeName.split(',') : []
    const publishRange = publishRangeList.map((item: string, index: number) => ({ value: item, label: publishRangeNameList[index] }))
    if (res.success) {
        state.formDataList[index] = {
            ...state.formDataList[index],
            ...res.result,
            ...res.result.codePackage,
            tags: res.result.codePackage.tags ? res.result.codePackage.tags.split(',') : [],
            publishRange,
            cooperationUserIds: res.result.cooperationUserList?.map((item: any) => ({ value: item.id, label: item.nickname })) || [],
            historyHidden: false,
            currentVersionIndex: res.result.codePackageVersionList?.findIndex((item: any) => item.version === res.result.codePackage.currentVersion),
            codePackageVersionList: res.result.codePackageVersionList?.map((item: any) => ({
                ...item,
                runPath: item.runPath ? [{ name: item.runFilename, url: item.runPath }] : [],
                zipPath: item.zipPath ? [{ name: item.zipFilename, url: item.zipPath }] : [],
                hidden: true
            }))
        }
        // 展开第一个历史版本
        const LastHistory = state.formDataList[index].codePackageVersionList.find((item: any) => item.version !== state.formDataList[index].currentVersion)
        if (LastHistory) {
            LastHistory.hidden = false
        }
    } else {
        message.error('获取组件包信息失败！')
    }
}
const handlePublishCancel = async () => {
    const index = currentIndex.value
    const title = '确定要取消发布当前教程吗？'
    // const content = '该组件包下的所有已创建组件也将同时取消发布！'
    const confirmRes = await showConfirm(title, '', ExclamationCircleOutlined)
    if (confirmRes) {
        state.formDataList[index].formLoading = true
        const res = await componentPublishApi.requestChangeStatus({ codepackageId: state.formDataList[index].id, status: 0, comStatus: 1 })
        state.formDataList[index].formLoading = false
        if (res.success) {
            message.success('取消发布成功！')
        } else {
            message.error('取消发布失败！')
        }
    }
}
const onFinish = async (data: any, i?: any) => {
    console.log(data, i)
    message.success('发布成功，正在打开教程章节维护！')

    // const index = i || currentIndex.value
    // const params = {
    //     ...data,
    //     tags: data.tags.join(','),
    //     cooperationUserIds: data.cooperationUserIds.map((item: any) => item.value).join(','),
    //     publishRange: data.publishOpen === 0 ? data.publishRange.map((item: any) => item.value).join(',') : undefined,
    //     publishRangeName: data.publishOpen === 0 ? data.publishRange.map((item: any) => item.label).join(',') : undefined,
    //     codePackageVersionModel: data.codePackageVersionList.map((item: any) => ({
    //         ...item,
    //         runPath: item.runPath[0]?.url || '',
    //         runFilename: item.runPath[0]?.name || '',
    //         zipPath: item.zipPath[0]?.url || '',
    //         zipFilename: item.zipPath[0]?.name || ''
    //     }))
    // }
    // state.formDataList[index].formLoading = true
    // const res = await componentPublishApi.requestSaveCodepackage(params)
    // state.formDataList[index].formLoading = false
    // if (data.closeMessage) {
    //     return res
    // }
    // if (res.success) {
    //     if (data.status) {
    //         const answer = await showConfirm('保存并发布成功！', '是否同时发布该组件包下的所有已创建组件？', CheckCircleOutlined, '#52c41a')
    //         if (answer) {
    //             publishAllCom()
    //         }
    //     } else {
    //         message.success('保存成功！')
    //     }
    // } else {
    //     if (data.status) {
    //         message.error('保存并发布失败！')
    //     } else {
    //         message.error('保存失败！')
    //     }
    // }
}
const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
    message.error('表单校验失败，请检查！')
}
// const publishAllCom = async (id?: any, i?: any) => {
//     const index = i || currentIndex.value
//     const codepackageId = id || state.formDataList[index].id

//     state.formDataList[index].formLoading = true
//     const res = await componentPublishApi.requestChangeStatus({ codepackageId, status: 1, comStatus: 1 })
//     state.formDataList[index].formLoading = false
//     if (res.success) {
//         message.success('操作成功！')
//     } else {
//         message.error('操作失败！')
//     }
// }
// const handleAutoCreateCom = async () => {
//     const index = currentIndex.value
//     state.formDataList[index].formLoading = true
//     const res = await componentPublishApi.requestAutocreate({ codePackageId: state.selectedKey })
//     state.formDataList[index].formLoading = false
//     if (res.success) {
//         const title = `已成功创建 ${state.formDataList[index].noExistsComponentCount} 个组件， 是否继续完善组件信息？`
//         const content = ''
//         state.formDataList[index].noExistsComponentCount = 0
//         const confirmRes = await showConfirm(title, content, CheckCircleOutlined, '#52c41a')
//         if (confirmRes && res.result) {
//             window.open(`/componentPublish?componentIds=${res.result}`)
//         }
//     } else {
//         message.error('自动创建失败！')
//     }
// }
// const handleAllVersionView = (data: any) => {
//     // router.push({
//     //     name: 'index-componentPackage-detail',
//     //     query: {
//     //         codepackageId: data.id,
//     //         version: data.currentVersion
//     //     }
//     // })
//     window.open(`/componentPackageDetail?codepackageId=${data.id}&version=${data.currentVersion}`)
// }
// const handleVersionHidden = (versionData: any, currentVersionIndex: any) => {
//     versionData.hidden = !versionData.hidden
//     const index = state.formDataList[currentIndex.value].codePackageVersionList.findIndex((item: any) => !item.hidden)
//     if (index !== -1 && index !== currentVersionIndex) {
//         state.formDataList[currentIndex.value].historyHidden = false
//     } else {
//         state.formDataList[currentIndex.value].historyHidden = true
//     }
// }
// const handleHistoryHidden = (formData: any) => {
//     formData.historyHidden = !formData.historyHidden
//     state.formDataList[currentIndex.value].codePackageVersionList.forEach((item: any) => {
//         item.hidden = formData.historyHidden
//     })
// }
const getCodeLangueList = async () => {
    const res = await coreApi.requestWebInfoListByGroup({ groupCd: 'langue' })
    if (res.success) {
        state.codeLangueList = res.result.map((item: any) => ({
            ...item,
            label: item.itemValue,
            value: item.itemValue
        }))
    }
}
const getTagsList = async () => {
    return await coreApi.requestWebInfoListByGroup({ groupCd: 'codepackageTags' }) // todo 教程标签id
}
const getCooperationUserList = async (text: string) => {
    return await useHomeCoreApi.requestSearchUser({ searchTxt: text }) // todo 协作组件接口
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
