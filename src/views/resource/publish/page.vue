<template>
    <div class="cp-upload" style="width:960px">
        <div class="cp-upload-title">
            <ARow>
                <ACol :span="7">
                    <div class="title-left">
                        <div class="name">{{ !state.queryId ? '发布页面' : '编辑页面' }}</div>
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
                            <a-alert v-if="state.noExistsComponentList.length>0" type="warning" show-icon closable :style="{ marginBottom: '20px' }">
                                <template #message>
                                    该页面包内包含了{{ state.componentList.length }}个组件，其中{{ state.noExistsComponentList.length }}个组件不存在 <a href="javascript:;" @click="openDetailModal">查看</a>，但不影响页面的在线预览（缺少的组件建议还是维护上云）
                                </template>
                            </a-alert>
                            <div class="dist-form-title">
                                基本信息
                            </div>
                            <a-form-item name="id" hidden />
                            <a-form-item name="newGuid" hidden />
                            <a-form-item name="status" hidden />
                            <a-form-item name="idmId" hidden />
                            <a-form-item
                                name="title"
                                label="页面名称"
                                extra="请输入1-50个字符的页面中文名，以便更好的理解页面的作用"
                                :rules="[{ required: true, message: '必填!' }, { max: 50, min: 1, message: '请输入1-50个字符' }]"
                            >
                                <a-input v-model:value="formData.title" placeholder="请输入" />
                            </a-form-item>
                            <a-form-item name="idmId" label="页面ID">
                                <span class="ant-form-text">{{ formData.idmId }}</span>
                            </a-form-item>
                            <a-form-item name="currentVersion" label="当前版本">
                                <div>
                                    <span class="ant-form-text">{{ formData.currentVersion }}</span>
                                    <AButton v-show="formData.pageVersionList && formData.pageVersionList.length" type="link" size="small" :style="{marginLeft: '20px'}">已有{{ formData.pageVersionList&&formData.pageVersionList.length }}个版本，点击可查看详情</AButton>
                                </div>
                            </a-form-item>
                            <a-form-item name="coverPath" label="封面">
                                <IImageUpload
                                    v-model:value="formData.coverPath"
                                    :paramsData="{upFileType: 'image'}"
                                    :multiple="false"
                                />
                            </a-form-item>
                            <a-form-item
                                name="type"
                                label="类型"
                                :rules="[{ required: true, message: '必填!' }]"
                            >
                                <a-radio-group v-model:value="formData.type" :options="state.pagetypeList" />
                            </a-form-item>
                            <a-form-item
                                v-show="formData.type==='form'||formData.type==='list'"
                                name="moduleName"
                                label="模块名称"
                            >
                                <a-auto-complete
                                    v-model:value="formData.moduleName"
                                    :options="state.moduleNameOptions"
                                    placeholder="请输入"
                                />
                            </a-form-item>
                            <a-form-item
                                v-show="formData.type==='form'||formData.type==='list'"
                                name="moduleCode"
                                label="模块标识"
                            >
                                <a-auto-complete
                                    v-model:value="formData.moduleCode"
                                    :options="state.moduleCodeOptions"
                                    placeholder="请输入"
                                />
                            </a-form-item>
                            <a-form-item
                                name="ownerType"
                                label="所属"
                                :rules="[{ required: true, message: '必填!' }]"
                            >
                                <a-radio-group v-model:value="formData.ownerType" :options="state.ownertypeList" />
                            </a-form-item>
                            <a-form-item
                                v-show="formData.ownerType&&formData.ownerType!=='platform'"
                                name="productName"
                                :rules="[{ required: formData.ownerType&&formData.ownerType!=='platform', message: '必填!' }]"
                                :label="`${formData.ownerType==='product'?'产品':'项目'}名称`"
                            >
                                <a-auto-complete
                                    v-model:value="formData.productName"
                                    :options="state.productOptions"
                                    placeholder="请输入"
                                />
                            </a-form-item>
                            <a-form-item name="currentRemark" label="页面简介">
                                <a-textarea v-model:value="formData.currentRemark" placeholder="请输入" />
                            </a-form-item>
                            <a-form-item name="tags" label="页面标签">
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
                            <a-form-item name="cooperationUserIds" label="协作人员">
                                <AsyncSelect
                                    v-model:value="formData.cooperationUserIds"
                                    asyncSearch
                                    labelInValue
                                    mode="multiple"
                                    :fieldNames="{label: 'nickname', value: 'id'}"
                                    placeholder="请查询后选择"
                                    :request="getCooperationUserList"
                                />
                            </a-form-item>
                            <template v-if="formData.currentVersionIndex || formData.currentVersionIndex === 0">
                                <div class="dist-form-title" :style="{paddingTop: '20px'}">
                                    当前版本信息（{{ formData.pageVersionList[formData.currentVersionIndex].version }}）
                                </div>
                                <a-form-item :name="['pageVersionList', formData.currentVersionIndex, 'id']" hidden />
                                <a-form-item :name="['pageVersionList', formData.currentVersionIndex, 'version']" hidden />
                                <a-form-item
                                    :name="['pageVersionList', formData.currentVersionIndex, 'zipPath']"
                                    extra="支持文件后缀： .zip"
                                    label="上传页面包"
                                    :rules="[{ required: true, message: '必填!' }]"
                                >
                                    <IFileUpload
                                        v-model:value="formData.pageVersionList[formData.currentVersionIndex].zipPath"
                                        :paramsData="{upFileType: 'page', packageVersionId: formData.pageVersionList[formData.currentVersionIndex].id}"
                                    />
                                </a-form-item>
                                <a-form-item :name="['pageVersionList', formData.currentVersionIndex, 'markdownContent']" extra="文档编辑后会存入表单，随表单一并保存" label="页面详情文档">
                                    <MdEditorButton tip="文档编辑后会存入表单，随表单一并保存" v-model:value="formData.pageVersionList[formData.currentVersionIndex].markdownContent" :path="formData.pageVersionList[formData.currentVersionIndex].markdownPath" />
                                </a-form-item>
                                <a-form-item name="updateTime" label="更新时间">
                                    <span class="ant-form-text">{{ formData.pageVersionList[formData.currentVersionIndex].createTime || formData.pageVersionList[formData.currentVersionIndex].updateTime }}</span>
                                </a-form-item>
                            </template>
                            <div v-show="state.queryId">
                                <div v-if="formData.pageVersionList && formData.pageVersionList.length > 1" class="dist-form-title" :style="{paddingTop: '20px'}">
                                    历史版本信息
                                    <a-button type="link" size="small" @click="handleHistoryHidden(formData)">{{ !formData.historyHidden ? '收起' : '展开' }}</a-button>
                                </div>
                                <template v-for="_, index in formData.pageVersionList" :key="index">
                                    <template v-if="index !== formData.currentVersionIndex">
                                        <div class="dist-form-title-sub" :style="{paddingTop: '20px'}">
                                            {{ formData.pageVersionList[index].version }}版本信息
                                            <a-button type="link" size="small" @click="handleVersionHidden(formData.pageVersionList[index], formData.currentVersionIndex)">{{ !formData.pageVersionList[index].hidden && !formData.historyHidden ? '收起' : '展开' }}</a-button>
                                        </div>
                                        <div v-show="!formData.pageVersionList[index].hidden && !formData.historyHidden">
                                            <a-form-item :name="['pageVersionList', index, 'id']" hidden />
                                            <a-form-item :name="['pageVersionList', index, 'version']" hidden />
                                            <a-form-item
                                                :name="['pageVersionList', index, 'zipPath']"
                                                extra="支持文件后缀：.zip"
                                                label="上传页面包"
                                                :rules="[{ required: true, message: '必填!' }]"
                                            >
                                                <IFileUpload
                                                    v-model:value="formData.pageVersionList[index].zipPath"
                                                    :paramsData="{upFileType: 'page', packageVersionId: formData.pageVersionList[index].id}"
                                                />
                                            </a-form-item>
                                            <a-form-item :name="['pageVersionList', index, 'markdownContent']" extra="文档编辑后会存入表单，随表单一并保存" label="页面详情文档">
                                                <MdEditorButton tip="文档编辑后会存入表单，随表单一并保存" v-model:value="formData.pageVersionList[index].markdownContent" :path="formData.pageVersionList[index].markdownPath" />
                                            </a-form-item>
                                            <a-form-item name="updateTime" label="更新时间">
                                                <span class="ant-form-text">{{ formData.pageVersionList[index].createTime || formData.pageVersionList[index].updateTime }}</span>
                                            </a-form-item>
                                        </div>
                                    </template>
                                </template>
                            </div>
                            <a-form-item :wrapper-col="{ span: 24}" :style="{ padding: '20px 0','text-align': 'center' }">
                                <a-button type="primary" html-type="submit" @click="() => formData.status = 1">保存并发布</a-button>
                                <a-button html-type="submit" :style="{ marginLeft: '20px' }" @click="() => formData.status = undefined">保存页面</a-button>
                                <a-button v-if="formData.status === 1" :style="{ marginLeft: '20px' }" @click="handlePublishCancel()">取消发布</a-button>
                            </a-form-item>
                        </AForm>
                    </ASpin>
                </div>
            </div>
        </div>
        <a-modal
            v-model:visible="state.visible"
            destroyOnClose
            width="1400px"
            centered
            :closable="false"
            :maskClosable="false"
            title="提示"
        >
            <a-alert type="warning" show-icon closable :style="{ marginBottom: '20px' }">
                <template #message>
                    该页面包内包含了{{ state.componentList.length }}个组件，其中{{ state.noExistsComponentList.length }}个组件不存在，但不影响页面的在线预览（缺少的组件建议还是维护上云），如果已经发布了不存在的组件，请再次点击发布按钮。
                </template>
            </a-alert>
            <a-table :dataSource="state.noExistsComponentList" :columns="tableColumns" :pagination="false" size="small" :scroll="{ x: 1100, y: 500 }" />
            <template #footer>
                <a-button key="back" @click="handleCancel">知道了</a-button>
                <a-button type="primary" @click="openPreviewPage">去预览</a-button>
            </template>
        </a-modal>
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
const tableColumns = [
    {
        title: '组件名',
        dataIndex: 'comName',
        key: 'comName'
    },
    {
        title: '别名',
        dataIndex: 'asName',
        key: 'asName'
    },
    {
        title: '类ID',
        dataIndex: 'classId',
        key: 'classId'
    },
    {
        title: '类名',
        dataIndex: 'className',
        key: 'className'
    },
    {
        title: '组件包类名',
        dataIndex: 'packageClassName',
        key: 'packageClassName'
    },
    {
        title: '版本',
        dataIndex: 'packageVersion',
        key: 'packageVersion',
        width: '7%'
    },
    {
        title: '技术栈',
        dataIndex: 'comLangue',
        key: 'comLangue',
        width: '7%'
    },
    {
        title: '组件实例ID',
        dataIndex: 'comId',
        key: 'comId'
    },
    {
        title: '组件类型',
        dataIndex: 'comType',
        key: 'comType',
        width: '7%'
    }
]
const state = reactive<any>({
    selectedKey: '',
    uploadDisabled: false,
    saveAllLoading: false,
    formDataList: [],
    pagetypeList: [],
    ownertypeList: [],
    queryId: route.query?.id,
    componentList: [],
    noExistsComponentList: [],
    productOptions: [],
    moduleNameOptions: [],
    moduleCodeOptions: [],
    visible: false
})
const currentIndex: any = { value: 0 }

onMounted(() => {
    getPagetypeList()
    getOwnertypeList()
    getProductList()
    getModuleNameList()
    getModuleCodeList()
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
        getUploadZipInfo(route.query.filePath)
    }
})
const handleCancel = () => {
    state.visible = false
}
const openDetailModal = () => {
    state.visible = true
}
/**
 * 获取上传的zip包内的信息
 */
const getUploadZipInfo = async (zipPath: any) => {
    const index = currentIndex.value
    state.formDataList[index].formLoading = true
    const res = await resourcePublish.requestZipInfo({ zipPath, zipType: 'page' })
    // "resourceSchemaJson:页面结构信息," +
    //         "componentList:页面包内的组件数据，[{classId,className,comLangue,asName,comId,comName,comType,packageClassName,packageVersion},]," +
    //         "businessId:对应的结构的ID," +
    //         "dbId:对应的页面表ID," +
    //         "version:对应的页面版本," +
    //         "noExistsComponentList:不存在的组件数据，[{classId,className,comLangue,asName,comId,comName,comType,packageClassName,packageVersion},}"
    if (res.success) {
        const { newGuid, resourceSchemaJson, resourceInfo, componentList, businessId, dbId, version, noExistsComponentList, markdownPath } = res.result
        // dbId其实这里一直会为空，因为上传的zip包内的信息就决定了是否有dbId的，有则不会走这里逻辑
        state.formDataList[index].id = dbId
        state.formDataList[index].newGuid = newGuid
        state.formDataList[index].idmId = businessId
        state.formDataList[index].publishOpen = 1
        state.formDataList[index].currentVersion = version
        state.formDataList[index].tags = []
        state.formDataList[index].historyHidden = false
        state.formDataList[index].currentVersionIndex = 0
        // 添加默认表单字段
        state.formDataList[index].title = resourceInfo?.title
        state.formDataList[index].currentRemark = resourceInfo?.remark
        state.formDataList[index].type = resourceInfo?.type
        state.componentList = componentList
        state.noExistsComponentList = noExistsComponentList

        state.formDataList[index].pageVersionList = [{
            hidden: false,
            idmId: businessId,
            idmPageId: dbId,
            version,
            zipPath: [{ name: route.query?.fileName, url: zipPath }],
            zipFilename: route.query?.fileName,
            markdownPath
        }]
    } else {
        message.error(res.message)
    }
    state.formDataList[index].formLoading = false
}

const judgeShowNoExistsComponentTip = async (zipPath: any) => {
    const index = currentIndex.value
    state.formDataList[index].formLoading = true
    const res = await resourcePublish.requestZipInfo({ zipPath, zipType: 'page' })
    if (res.success) {
        const { newGuid, resourceSchemaJson, resourceInfo, componentList, businessId, dbId, version, noExistsComponentList, markdownPath } = res.result
        state.componentList = componentList
        state.noExistsComponentList = noExistsComponentList
        if (state.noExistsComponentList.length > 0) {
            openDetailModal()
        } else {
            Modal.success({
                title: '页面已生成静态化了，可以预览了！',
                cancelText: '知道了',
                okText: '去预览',
                onOk() {
                    openPreviewPage()
                }
            })
        }
    } else {
        message.error(res.message)
    }
    state.formDataList[index].formLoading = false
}
const openPreviewPage = () => {
    window.open(baseURL + '/p1000/idm/' + state.queryId + '.html?timespan=' + new Date().getTime())
}
const getDistinfo = async () => {
    const index = currentIndex.value
    state.formDataList[index].formLoading = true
    const res = await resourcePublish.requestDistInfo({ id: state.formDataList[index].id })
    state.formDataList[index].formLoading = false
    const publishRangeList = res.result.pageInfo.publishRange ? res.result.pageInfo.publishRange.split(',') : []
    const publishRangeNameList = res.result.pageInfo.publishRangeName ? res.result.pageInfo.publishRangeName.split(',') : []
    const publishRange = publishRangeList.map((item: string, index: number) => ({ value: item, label: publishRangeNameList[index] }))
    if (res.success) {
        state.formDataList[index] = {
            ...state.formDataList[index],
            ...res.result,
            ...res.result.pageInfo,
            tags: res.result.pageInfo.tags ? res.result.pageInfo.tags.split(',') : [],
            publishRange,
            coverPath: res.result.pageInfo.coverPath ? [{ src: res.result.pageInfo.coverPath }] : [],
            cooperationUserIds: res.result.cooperationUserList?.map((item: any) => ({ value: item.id, label: item.nickname })) || [],
            historyHidden: false,
            currentVersionIndex: res.result.pageVersionList?.findIndex((item: any) => item.version === res.result.pageInfo.currentVersion),
            pageVersionList: res.result.pageVersionList?.map((item: any) => ({
                ...item,
                zipPath: item.zipPath ? [{ name: item.zipFilename, url: item.zipPath }] : [],
                hidden: true
            }))
        }
        // 展开第一个历史版本
        const LastHistory = state.formDataList[index].pageVersionList.find((item:any) => item.version !== state.formDataList[index].currentVersion)
        if (LastHistory) { LastHistory.hidden = false }
    } else {
        message.error('获取页面信息失败！')
    }
}
const handlePublishCancel = async () => {
    const index = currentIndex.value
    const title = '确定要取消发布当前页面吗？'
    // const content = '该页面下的所有已创建组件也将同时取消发布！'
    const confirmRes = await showConfirm(title, '', ExclamationCircleOutlined)
    if (confirmRes) {
        state.formDataList[index].formLoading = true
        const res = await resourcePublish.requestChangeStatus({ id: state.formDataList[index].id, status: 0, type: 'page' })
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
        cooperationUserIds: data.cooperationUserIds?.map((item: any) => item.value).join(','),
        publishRange: data.publishOpen === 0 ? data.publishRange?.map((item: any) => item.value).join(',') : undefined,
        coverPath: data.coverPath && data.coverPath[0] ? data.coverPath[0].src : '',
        publishRangeName: data.publishOpen === 0 ? data.publishRange?.map((item: any) => item.label).join(',') : undefined,
        idmPageVersionModel: data.pageVersionList.map((item: any) => ({
            ...item,
            zipPath: item.zipPath[0]?.url || '',
            zipFilename: item.zipPath[0]?.name || ''
        }))
    }
    state.formDataList[index].formLoading = true
    const res = await resourcePublish.requestSavePage(params)
    state.formDataList[index].formLoading = false
    state.formDataList[index].id = state.formDataList[index].id || state.formDataList[index].newGuid
    if (data.closeMessage) {
        return res
    }
    if (res.success) {
        if (data.status) {
            message.success('保存并发布成功！')
        } else {
            message.success('保存成功！')
        }
        // 判断当前版本的压缩包是否需要提示组件缺少
        let zipPath = ''
        params.idmPageVersionModel.forEach((item: any) => {
            if (item.version === data.currentVersion) {
                zipPath = item.zipPath
            }
        })
        judgeShowNoExistsComponentTip(zipPath)
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
const handleVersionHidden = (versionData: any, currentVersionIndex: any) => {
    versionData.hidden = !versionData.hidden
    const index = state.formDataList[currentIndex.value].pageVersionList.findIndex((item: any) => !item.hidden)
    if (index !== -1 && index !== currentVersionIndex) {
        state.formDataList[currentIndex.value].historyHidden = false
    } else {
        state.formDataList[currentIndex.value].historyHidden = true
    }
}
const handleHistoryHidden = (formData: any) => {
    formData.historyHidden = !formData.historyHidden
    state.formDataList[currentIndex.value].pageVersionList.forEach((item: any) => {
        item.hidden = formData.historyHidden
    })
}
const getPagetypeList = async () => {
    const res = await coreApi.requestWebInfoListByGroup({ groupCd: 'pagetype' })
    if (res.success) {
        state.pagetypeList = res.result.map((item: any) => ({
            ...item,
            label: item.itemValue,
            value: item.itemCd
        }))
    }
}
const getOwnertypeList = async () => {
    const res = await coreApi.requestWebInfoListByGroup({ groupCd: 'ownertype' })
    if (res.success) {
        state.ownertypeList = res.result.map((item: any) => ({
            ...item,
            label: item.itemValue,
            value: item.itemCd
        }))
    }
}
const getProductList = async () => {
    const res = await coreApi.requestWebInfoListByGroup({ groupCd: 'product' })
    if (res.success) {
        state.productOptions = res.result.map((item: any) => ({
            value: item.itemValue
        }))
    }
}
const getModuleNameList = async () => {
    const res = await coreApi.requestWebInfoListByGroup({ groupCd: 'modulename' })
    if (res.success) {
        state.moduleNameOptions = res.result.map((item: any) => ({
            value: item.itemValue
        }))
    }
}
const getModuleCodeList = async () => {
    const res = await coreApi.requestWebInfoListByGroup({ groupCd: 'modulecode' })
    if (res.success) {
        state.moduleCodeOptions = res.result.map((item: any) => ({
            value: item.itemValue
        }))
    }
}
const getTagsList = async () => {
    return await coreApi.requestWebInfoListByGroup({ groupCd: 'pageTags' })
}
const getCooperationUserList = async (text: string) => {
    return await useHomeCoreApi.requestSearchUser({ searchTxt: text })
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
