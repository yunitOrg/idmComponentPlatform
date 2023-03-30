<template>
    <div class="cp-upload" :style="{width: !state.queryId ? '1200px' : '960px'}">
        <a-upload-dragger
            v-if="!state.queryId && (!state.distList || !state.distList.length)"
            class="cp-upload-dragger"
            accept=".zip,.rar"
            multiple
            :disabled="state.uploadDisabled"
            :showUploadList="false"
            :customRequest="handleUpload"
        >
            <p class="ant-upload-drag-icon">
                <inbox-outlined></inbox-outlined>
            </p>
            <p class="ant-upload-text">点击或将文件拖拽到这里上传</p>
            <p class="ant-upload-hint">
                支持单个或批量上传，支持扩展名：.zip, .rar
            </p>
            <div class="ant-upload-notice">
                注意事项：<br>
                1、一个代码包一个压缩包，压缩包不能套一层文件夹，以index.html为准，必须要在根目录，例如解压后应该有四个文件(夹)：index.html、lib、static、favicon.ico<br>
                2、不能更改程序打包后的任何文件，否则将会解析升级失败<br>
                3、代码包名（className）、组件名称（className）都是整个平台唯一的，上传之前请确认名称是否已被使用，避免后续出现组件串台问题<br>
                4、上传后会把已经维护的组件添加一个版本，并且会设置该版本为最新版本<br>
            </div>
        </a-upload-dragger>
        <template v-else>
            <div class="cp-upload-title">
                <ARow>
                    <ACol :span="7">
                        <div class="title-left">
                            <div class="name">{{ !state.queryId ? '发布组件包' : '编辑组件包' }}</div>
                            <AUpload
                                v-if="!state.queryId"
                                accept=".zip,.rar"
                                :disabled="state.uploadDisabled"
                                :showUploadList="false"
                                :customRequest="handleUpload"
                            >
                                <AButton :disabled="state.uploadDisabled">添加组件包</AButton>
                            </AUpload>
                        </div>
                    </ACol>
                    <ACol :span="17">
                        <div class="title-right">
                            <AButton v-if="!state.queryId" type="primary" :disabled="state.saveAllLoading || !state.formDataList || !state.formDataList.length" @click="handleAllSave">保存全部并发布</AButton>
                        </div>
                    </ACol>
                </ARow>
            </div>
            <div class="cp-upload-content">
                <ARow>
                    <ACol :span="!state.queryId ? 7 : 2">
                        <div v-if="!state.queryId" class="cp-dist-list">
                            <div v-for="item,index in state.distList" :key="index" class="item" :class="{selected: item.codePackageId && item.codePackageId === state.selectedKey}" @click="handleDistItemClick(item)">
                                <div class="name">{{ item.name }}</div>
                                <div class="meta">
                                    <div class="info">
                                        <span :class="item.status">{{ item.loadDesc }}</span>
                                        <span v-show="item.status !== 'success'">{{ `${item.progress}%` }}</span>
                                        <span>{{ item.status !== 'success' ? `${item.loaded}/${item.size}` : item.size }}</span>
                                    </div>
                                    <div>
                                        <AButton v-if="item.status !== 'success'" type="link" size="small" block @click.stop="handleDistItemUploadCancel(item)">取消上传</AButton>
                                    </div>
                                </div>
                                <AProgress v-show="item.status !== 'success'" :key="item.codePackageId" size="small" :percent="+item.progress" :show-info="false" :status="item.status" />
                            </div>
                        </div>
                    </ACol>
                    <ACol :span="!state.queryId ? 17 : 20">
                        <div class="cp-dist-info">
                            <div v-for="formData in state.formDataList" v-show="formData.codePackageId === state.selectedKey" :key="formData.codePackageId" class="cp-dist-info-item">
                                <ASpin :spinning="formData.formLoading">
                                    <AForm
                                        v-if="formData.id"
                                        ref="formRef"
                                        class="dist-form"
                                        name="dist_info"
                                        :model="formData"
                                        :label-col="{span: 6}"
                                        :wrapper-col="{span: !state.queryId ? 16 : 18}"
                                        @finish="(data) => onFinish(data)"
                                        @finish-failed="onFinishFailed"
                                    >
                                        <a-alert v-if="!state.queryId" v-show="!formData.isNewVersion" message="该组件包已有历史版本，此次上传将会更新组件包的版本，不会新创建组件包" type="warning" show-icon closable :style="{ marginBottom: '20px' }" />
                                        <div class="dist-form-title">
                                            基本信息
                                        </div>
                                        <a-form-item name="id" hidden />
                                        <a-form-item name="status" hidden />
                                        <a-form-item name="codePackageId" hidden />
                                        <a-form-item
                                            name="title"
                                            label="组件包中文名"
                                            extra="请输入2-12个字符的组件包中文名，以便更好的理解组件包的作用"
                                            :rules="[{ required: true, message: '必填!' }, { max: 12, min: 2, message: '请输入2-12个字符' }]"
                                        >
                                            <a-input v-model:value="formData.title" placeholder="请输入" />
                                        </a-form-item>
                                        <a-form-item name="classname" label="组件包类名">
                                            <span class="ant-form-text">{{ formData.classname }}</span>
                                            <template #extra>
                                                <a-alert v-show="formData.otherUserCodePackageExistsCount !== 0" message="组件包类名已存在，不建议使用已存在的类名，你也可以忽略此建议" show-icon type="error" closable />
                                            </template>
                                        </a-form-item>
                                        <a-form-item name="currentVersion" label="当前组件包版本">
                                            <div>
                                                <span class="ant-form-text">{{ formData.currentVersion }}</span>
                                                <AButton v-show="formData.codePackageVersionList && formData.codePackageVersionList.length" type="link" size="small" :style="{marginLeft: '20px'}" @click="handleAllVersionView(formData)">已有{{ formData.codePackageVersionList.length }}个版本，点击查看</AButton>
                                            </div>
                                        </a-form-item>
                                        <a-form-item
                                            name="codeLangue"
                                            label="组件包技术栈"
                                            :rules="[{ required: true, message: '必填!' }]"
                                        >
                                            <a-radio-group v-model:value="formData.codeLangue" :options="state.codeLangueList" />
                                        </a-form-item>
                                        <a-form-item name="currentRemark" label="组件包简介">
                                            <a-textarea v-model:value="formData.currentRemark" placeholder="请输入" />
                                        </a-form-item>
                                        <a-form-item name="tags" label="组件包标签">
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
                                        <a-form-item
                                            name="githubUrl"
                                            label="github源码地址"
                                            :rules="[{ type: 'url', message: '请输入网址' }]"
                                        >
                                            <a-input v-model:value="formData.githubUrl" placeholder="请输入" />
                                        </a-form-item>
                                        <a-form-item
                                            name="giteeUrl"
                                            label="gitee源码地址"
                                            :rules="[{ type: 'url', message: '请输入网址' }]"
                                        >
                                            <a-input v-model:value="formData.giteeUrl" placeholder="请输入" />
                                        </a-form-item>
                                        <a-form-item
                                            name="otherUrl"
                                            label="其他源码地址"
                                            :rules="[{ type: 'url', message: '请输入网址' }]"
                                        >
                                            <a-input v-model:value="formData.otherUrl" placeholder="请输入" />
                                        </a-form-item>
                                        <template v-if="formData.currentVersionIndex || formData.currentVersionIndex === 0">
                                            <div class="dist-form-title" :style="{paddingTop: '20px'}">
                                                当前版本信息（{{ formData.codePackageVersionList[formData.currentVersionIndex].version }}）
                                            </div>
                                            <a-form-item :name="['codePackageVersionList', formData.currentVersionIndex, 'id']" hidden />
                                            <a-form-item :name="['codePackageVersionList', formData.currentVersionIndex, 'version']" hidden />
                                            <a-form-item
                                                :name="['codePackageVersionList', formData.currentVersionIndex, 'runPath']"
                                                extra="支持文件后缀：.rar .zip"
                                                label="上传生产包"
                                                :hidden="!state.queryId"
                                                :rules="[{ required: true, message: '必填!' }]"
                                            >
                                                <IFileUpload
                                                    v-model:value="formData.codePackageVersionList[formData.currentVersionIndex].runPath"
                                                    :paramsData="{upFileType: 'runCode', packageVersionId: formData.codePackageVersionList[formData.currentVersionIndex].id}"
                                                />
                                            </a-form-item>
                                            <a-form-item :name="['codePackageVersionList', formData.currentVersionIndex, 'zipPath']" extra="支持文件后缀：.rar .zip" label="上传源代码">
                                                <IFileUpload
                                                    v-model:value="formData.codePackageVersionList[formData.currentVersionIndex].zipPath"
                                                    :paramsData="{upFileType: 'soundCode'}"
                                                />
                                            </a-form-item>
                                            <a-form-item :name="['codePackageVersionList', formData.currentVersionIndex, 'markdownContent']" extra="文档编辑后会存入表单，随表单一并保存" label="组件包文档">
                                                <MdEditorButton v-model:value="formData.codePackageVersionList[formData.currentVersionIndex].markdownContent" :path="formData.codePackageVersionList[formData.currentVersionIndex].markdownPath" />
                                            </a-form-item>
                                            <a-form-item name="updateTime" :hidden="!state.queryId" label="更新时间">
                                                <span class="ant-form-text">{{ formData.codePackageVersionList[formData.currentVersionIndex].updateTime }}</span>
                                            </a-form-item>
                                            <a-alert type="warning" show-icon>
                                                <template #message>
                                                    该组件包内包含
                                                    {{ formData.componentCount }}
                                                    个组件，已存在
                                                    {{ (formData.componentCount-formData.noExistsComponentCount).toFixed(0) }}
                                                    个组件(发布后会自动更新组件的版本)，{{ formData.noExistsComponentCount }}
                                                    个组件不存在
                                                    <AButton type="link" size="small" :style="{float: 'right', marginRight: '20px'}" :disabled="formData.noExistsComponentCount === 0" @click="handleAutoCreateCom">自动创建</AButton>
                                                </template>
                                            </a-alert>
                                        </template>
                                        <div v-show="state.queryId">
                                            <div v-if="formData.codePackageVersionList && formData.codePackageVersionList.length > 1" class="dist-form-title" :style="{paddingTop: '20px'}">
                                                历史版本信息
                                                <a-button type="link" size="small" @click="handleHistoryHidden(formData)">{{ !formData.historyHidden ? '收起' : '展开' }}</a-button>
                                            </div>
                                            <template v-for="_, index in formData.codePackageVersionList" :key="index">
                                                <template v-if="index !== formData.currentVersionIndex">
                                                    <div class="dist-form-title-sub" :style="{paddingTop: '20px'}">
                                                        {{ formData.codePackageVersionList[index].version }}版本信息
                                                        <a-button type="link" size="small" @click="handleVersionHidden(formData.codePackageVersionList[index], formData.currentVersionIndex)">{{ !formData.codePackageVersionList[index].hidden && !formData.historyHidden ? '收起' : '展开' }}</a-button>
                                                    </div>
                                                    <div v-show="!formData.codePackageVersionList[index].hidden && !formData.historyHidden">
                                                        <a-form-item :name="['codePackageVersionList', index, 'id']" hidden />
                                                        <a-form-item :name="['codePackageVersionList', index, 'version']" hidden />
                                                        <a-form-item
                                                            :name="['codePackageVersionList', index, 'runPath']"
                                                            extra="支持文件后缀：.rar .zip"
                                                            label="上传生产包"
                                                            :rules="[{ required: true, message: '必填!' }]"
                                                        >
                                                            <IFileUpload
                                                                v-model:value="formData.codePackageVersionList[index].runPath"
                                                                :paramsData="{upFileType: 'runCode', packageVersionId: formData.codePackageVersionList[index].id}"
                                                            />
                                                        </a-form-item>
                                                        <a-form-item :name="['codePackageVersionList', index, 'zipPath']" extra="支持文件后缀：.rar .zip" label="上传源代码">
                                                            <IFileUpload
                                                                v-model:value="formData.codePackageVersionList[index].zipPath"
                                                                :paramsData="{upFileType: 'soundCode'}"
                                                            />
                                                        </a-form-item>
                                                        <a-form-item :name="['codePackageVersionList', index, 'markdownContent']" extra="文档编辑后会存入表单，随表单一并保存" label="组件包文档">
                                                            <MdEditorButton v-model:value="formData.codePackageVersionList[index].markdownContent" :path="formData.codePackageVersionList[index].markdownPath" />
                                                        </a-form-item>
                                                        <a-form-item name="updateTime" label="更新时间">
                                                            <span class="ant-form-text">{{ formData.codePackageVersionList[index].updateTime }}</span>
                                                        </a-form-item>
                                                    </div>
                                                </template>
                                            </template>
                                        </div>
                                        <a-form-item :wrapper-col="{ span: 24, offset: state.queryId ? 8 : 10 }" :style="{ padding: '20px 0' }">
                                            <a-button type="primary" html-type="submit" @click="() => formData.status = 1">保存并发布</a-button>
                                            <a-button html-type="submit" :style="{ marginLeft: '20px' }" @click="() => formData.status = undefined">保存组件</a-button>
                                            <a-button v-if="state.queryId" :style="{ marginLeft: '20px' }" @click="handlePublishCancel()">取消发布</a-button>
                                        </a-form-item>
                                    </AForm>
                                    <AEmpty v-else description="暂无数据" />
                                </ASpin>
                            </div>
                        </div>
                    </ACol>
                </ARow>
            </div>
        </template>
    </div>
</template>

<script lang="ts" setup>
import { reactive, createVNode } from 'vue'
import { AxiosProgressEvent } from 'axios'
import { componentPublishApi, coreApi, useHomeCoreApi } from '@/apis'
import { Modal, message } from 'ant-design-vue'
import { ExclamationCircleOutlined, CheckCircleOutlined, InboxOutlined } from '@ant-design/icons-vue'
import type { FormInstance } from 'ant-design-vue'
// const router = useRouter()
const route = useRoute()
const formRef = ref()
const state = reactive<any>({
    distList: [],
    selectedKey: '',
    uploadDisabled: false,
    saveAllLoading: false,
    formDataList: [],
    codeLangueList: [],
    queryId: route.query?.codePackageId
})
const currentIndex: any = computed(() => state.formDataList.findIndex((item: any) => item.codePackageId === state.selectedKey))

onMounted(() => {
    getCodeLangueList()
    if (state.queryId) {
        state.selectedKey = state.queryId
        state.formDataList = [{
            codePackageId: state.queryId,
            formLoading: false
        }]
        getDistinfo()
    }
})

const handleUpload = async (data: any) => {
    if (data.file) {
        state.uploadDisabled = true
        const controller = new AbortController()
        const item = reactive({
            name: data.file.name,
            size: (data.file.size / 1024 / 1024).toFixed(2) + 'MB',
            progress: '0',
            loaded: '0MB',
            status: 'active',
            loadDesc: '正在上传',
            codePackageId: `-${data.file.uid}`,
            isNewVersion: true,
            controller
        })
        state.distList.push(item)
        const params = {
            file: data.file,
            data: {
                upFileType: 'runCode'
            }
        }
        const res = await componentPublishApi.requestUploadDist(params, (e) => onProgress(e, item), controller.signal).catch(() => {
            afterUpload({}, item)
            return false
        })
        if (res.success) {
            afterUpload(res.result, item)
        } else {
            afterUpload({}, item)
        }
    }
}
const afterUpload = async (result: any, item: any) => {
    const codePackageId = result.codePackageId
    if (codePackageId) {
        Modal.destroyAll() // 消除掉取消上传对话框
        item.status = 'success'
        item.loadDesc = '上传成功'
        item.codePackageId = codePackageId
        const distIndex = state.distList.findIndex((dist: any) => dist.codePackageId === codePackageId)
        if (distIndex !== state.distList.length - 1 && distIndex !== -1) {
            const title = '注意：您已重新上传了组件包！'
            const content = '原有组件包将被删除，请重新维护组件包信息。'
            await showWarning(title, content)
            state.distList.splice(distIndex, 1)
            const formIndex = state.formDataList.findIndex((formData: any) => formData.codePackageId === codePackageId)
            state.formDataList.splice(formIndex, 1)
        } else {
            message.success('组件包上传成功！')
        }
        state.formDataList.push({
            codePackageId,
            formLoading: false,
            isNewVersion: result.isNewVersion
        })
        state.selectedKey = codePackageId
        await getDistinfo()
        state.uploadDisabled = false
    } else {
        state.formDataList.push({
            codePackageId: item.codePackageId,
            formLoading: false
        })
        state.selectedKey = item.codePackageId
        item.status = 'exception'
        item.loadDesc = '上传失败'
        // state.distList.pop()
        message.error('组件包上传失败！')
        state.uploadDisabled = false
    }
}
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
        const LastHistory = state.formDataList[index].codePackageVersionList.find((item:any) => item.version !== state.formDataList[index].currentVersion)
        if (LastHistory) { LastHistory.hidden = false }
    } else {
        message.error('获取组件包信息失败！')
    }
}
const handleDistItemClick = (item: any) => {
    if (item.codePackageId) {
        state.selectedKey = item.codePackageId
    }
}
const handleDistItemUploadCancel = async (item: any) => {
    const title = '确定要取消上传当前组件包吗？'
    const content = ''
    const confirmRes = await showConfirm(title, content, ExclamationCircleOutlined)
    if (confirmRes) {
        state.uploadDisabled = false
        await item.controller.abort()
        const distIndex = state.distList.findIndex((dist: any) => dist.codePackageId === item.codePackageId)
        state.distList.splice(distIndex, 1)
    }
}
const handlePublishCancel = async () => {
    const index = currentIndex.value
    const title = '确定要取消发布当前组件包吗？'
    const content = '该组件包下的所有已创建组件也将同时取消发布！'
    const confirmRes = await showConfirm(title, content, ExclamationCircleOutlined)
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
    const index = i || currentIndex.value
    const params = {
        ...data,
        tags: data.tags.join(','),
        cooperationUserIds: data.cooperationUserIds.map((item: any) => item.value).join(','),
        publishRange: data.publishOpen === 0 ? data.publishRange.map((item: any) => item.value).join(',') : undefined,
        publishRangeName: data.publishOpen === 0 ? data.publishRange.map((item: any) => item.label).join(',') : undefined,
        codePackageVersionModel: data.codePackageVersionList.map((item: any) => ({
            ...item,
            runPath: item.runPath[0]?.url || '',
            runFilename: item.runPath[0]?.name || '',
            zipPath: item.zipPath[0]?.url || '',
            zipFilename: item.zipPath[0]?.name || ''
        }))
    }
    state.formDataList[index].formLoading = true
    const res = await componentPublishApi.requestSaveCodepackage(params)
    state.formDataList[index].formLoading = false
    if (data.closeMessage) {
        return res
    }
    if (res.success) {
        if (data.status) {
            const answer = await showConfirm('保存并发布成功！', '是否同时发布该组件包下的所有已创建组件？', CheckCircleOutlined, '#52c41a')
            if (answer) {
                publishAllCom()
            }
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
const publishAllCom = async (id?: any, i?: any) => {
    const index = i || currentIndex.value
    const codepackageId = id || state.formDataList[index].id

    state.formDataList[index].formLoading = true
    const res = await componentPublishApi.requestChangeStatus({ codepackageId, status: 1, comStatus: 1 })
    state.formDataList[index].formLoading = false
    if (res.success) {
        message.success('操作成功！')
    } else {
        message.error('操作失败！')
    }
}
const handleAutoCreateCom = async () => {
    const index = currentIndex.value
    state.formDataList[index].formLoading = true
    const res = await componentPublishApi.requestAutocreate({ codePackageId: state.selectedKey })
    state.formDataList[index].formLoading = false
    if (res.success) {
        const title = `已成功创建 ${state.formDataList[index].noExistsComponentCount} 个组件， 是否继续完善组件信息？`
        const content = ''
        state.formDataList[index].noExistsComponentCount = 0
        const confirmRes = await showConfirm(title, content, CheckCircleOutlined, '#52c41a')
        if (confirmRes && res.result) {
            window.open(`/componentPublish?componentIds=${res.result}`)
        }
    } else {
        message.error('自动创建失败！')
    }
}
const handleAllVersionView = (data: any) => {
    // router.push({
    //     name: 'index-componentPackage-detail',
    //     query: {
    //         codepackageId: data.id,
    //         version: data.currentVersion
    //     }
    // })
    window.open(`/componentPackageDetail?codepackageId=${data.id}&version=${data.currentVersion}`)
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
                    const answer = await showConfirm('全部保存并发布成功！', '是否同时发布全部组件包下的所有已创建组件？', CheckCircleOutlined, '#52c41a')
                    if (answer) {
                        const anPromiseArr:any = []
                        dataList.forEach((data: any, i: any) => {
                            anPromiseArr.push(publishAllCom(data.id, i))
                        })
                        Promise.all(anPromiseArr).then((resArr) => {
                            if (resArr.some((res: any) => !res.success)) {
                                message.error('操作失败！')
                            } else {
                                message.success('操作成功！')
                            }
                        })
                    }
                }
            })
        }
    }).catch((err: any) => {
        state.saveAllLoading = false
        state.selectedKey = err.values.codePackageId
        message.error('表单校验失败，请检查！')
    })
}
const handleVersionHidden = (versionData: any, currentVersionIndex: any) => {
    versionData.hidden = !versionData.hidden
    const index = state.formDataList[currentIndex.value].codePackageVersionList.findIndex((item: any) => !item.hidden)
    if (index !== -1 && index !== currentVersionIndex) {
        state.formDataList[currentIndex.value].historyHidden = false
    } else {
        state.formDataList[currentIndex.value].historyHidden = true
    }
}
const handleHistoryHidden = (formData: any) => {
    formData.historyHidden = !formData.historyHidden
    state.formDataList[currentIndex.value].codePackageVersionList.forEach((item: any) => {
        item.hidden = formData.historyHidden
    })
}
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
    return await coreApi.requestWebInfoListByGroup({ groupCd: 'codepackageTags' })
}
const getCooperationUserList = async (text: string) => {
    return await useHomeCoreApi.requestSearchUser({ searchTxt: text })
}
const getPublishRangeList = async () => {
    return await useHomeCoreApi.requestCoreMyOrgList()
}
const onProgress = (e: AxiosProgressEvent, item: any) => {
    if (e && e.progress) {
        item.progress = (e.progress * 100).toFixed(0)
        item.loaded = (e.loaded / 1024 / 1024).toFixed(2) + 'MB'
    }
}
const showWarning = (title: string, content: string) => {
    return new Promise((resolve) => {
        Modal.warning({
            title,
            content,
            okText: '知道了',
            onOk() {
                resolve(true)
            }
        })
    })
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
