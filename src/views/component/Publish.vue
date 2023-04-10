<template>
    <div class="cp-upload" :style="{width: state.queryId && state.formDataList && state.formDataList.length > 1 ? '1200px' : '960px'}">
        <div class="cp-upload-title">
            <ARow>
                <ACol :span="7">
                    <div class="title-left">
                        <div class="name">{{ state.queryId ? '编辑组件' : '发布组件' }}</div>
                    </div>
                </ACol>
                <ACol :span="17">
                    <div class="title-right">
                        <AButton v-if="state.queryId && state.formDataList && state.formDataList.length > 1" type="primary" :disabled="state.saveAllLoading || !state.formDataList || !state.formDataList.length" @click="handleAllSave">全部保存并发布</AButton>
                    </div>
                </ACol>
            </ARow>
        </div>
        <div class="cp-upload-content">
            <ARow>
                <ACol :span="state.queryId && state.formDataList && state.formDataList.length > 1 ? 7 : 2">
                    <div v-if="state.queryId && state.formDataList && state.formDataList.length > 1" class="cp-dist-list">
                        <div v-for="item,index in state.formDataList" :key="index" class="item" :class="{selected: item.comId && item.comId === state.selectedKey}" @click="handleDistItemClick(item)">
                            <div class="name">{{ item.comClassname }}</div>
                            <div class="meta">
                                <div class="info">
                                    <span>{{ item.comClassid }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </ACol>
                <ACol :span="state.queryId && state.formDataList && state.formDataList.length > 1 ? 17 : 20">
                    <div class="cp-dist-info">
                        <div v-for="formData in state.formDataList" v-show="formData.comId === state.selectedKey" :key="formData.comId" class="cp-dist-info-item">
                            <ASpin :spinning="formData.formLoading">
                                <AForm
                                    v-if="!state.queryId || formData.id"
                                    ref="formRef"
                                    class="dist-form"
                                    name="dist_info"
                                    :model="formData"
                                    :label-col="{span: 6}"
                                    :wrapper-col="{span: state.queryId && state.formDataList && state.formDataList.length > 1 ? 16 : 18}"
                                    @finish="(data: any) => onFinish(data)"
                                    @finish-failed="onFinishFailed"
                                >
                                    <div class="dist-form-title">
                                        基本信息
                                    </div>
                                    <a-form-item name="id" hidden />
                                    <a-form-item name="status" hidden />
                                    <a-form-item name="comId" hidden />
                                    <a-form-item name="courseId" hidden />
                                    <a-form-item :hidden="!state.queryId" name="codepackageClassname" label="组件代码包">
                                        <span class="ant-form-text">{{ formData.codepackageClassname }}</span>
                                    </a-form-item>
                                    <a-form-item :hidden="!!state.queryId" name="codepackageId" :rules="[{ required: true, message: '必填!' }]" label="组件代码包">
                                        <a-select
                                            v-model:value="formData.codepackageId"
                                            style="width: 100%"
                                            allow-clear
                                            show-arrow
                                            placeholder="请选择"
                                            :options="state.codepackageClassList"
                                        />
                                        <template #extra>
                                            没有可选代码包？<AButton type="link" size="small" @click="handleCodepackageJump('')">去上传</AButton>
                                        </template>
                                    </a-form-item>
                                    <a-form-item name="codepackageVersion" :rules="[{ required: !state.queryId, message: '必填!' }]" label="代码版本">
                                        <span v-if="state.queryId" class="ant-form-text">{{ `${formData.codepackageVersion || ''} (自动更新至最新版)` }}</span>
                                        <a-select
                                            v-else
                                            v-model:value="formData.codepackageVersion"
                                            style="width: 100%"
                                            allow-clear
                                            show-arrow
                                            placeholder="请选择"
                                            :options="formData.currentCodepackageversionList"
                                        />
                                    </a-form-item>
                                    <a-form-item name="comClassname" :rules="[{ required: !state.queryId, message: '必填!' }]" label="类名">
                                        <span v-if="state.queryId" class="ant-form-text">{{ formData.comClassname }}</span>
                                        <a-select
                                            v-else
                                            v-model:value="formData.comClassname"
                                            style="width: 100%"
                                            allow-clear
                                            show-arrow
                                            placeholder="请选择"
                                            :options="formData.currentComClassList"
                                        />
                                    </a-form-item>
                                    <a-form-item name="comClassid" label="类ID">
                                        <span class="ant-form-text">{{ formData.comClassid }}</span>
                                    </a-form-item>
                                    <a-form-item name="coverPath" label="封面">
                                        <IImageUpload
                                            v-model:value="formData.coverPath"
                                            :paramsData="{upFileType: 'image'}"
                                        />
                                    </a-form-item>
                                    <a-form-item
                                        name="comTitle"
                                        label="组件中文名"
                                        extra="请输入2-12个字符的组件中文名，以便更好的理解组件的作用"
                                        :rules="[{ required: true, message: '必填!' }, { max: 12, min: 2, message: '请输入2-12个字符' }]"
                                    >
                                        <a-input v-model:value="formData.comTitle" placeholder="请输入" />
                                    </a-form-item>
                                    <a-form-item name="comType" label="组件类型">
                                        <span class="ant-form-text">{{ formData.comType }}</span>
                                    </a-form-item>
                                    <a-form-item
                                        name="comLangue"
                                        label="组件技术栈"
                                        :rules="[{ required: true, message: '必填!' }]"
                                    >
                                        <a-radio-group v-model:value="formData.comLangue" :options="state.codeLangueList" />
                                    </a-form-item>
                                    <a-form-item name="comIconfont" label="字体图标">
                                        <IIconSelect v-model:value="formData.comIconfont" />
                                    </a-form-item>
                                    <a-form-item name="comRemark" label="组件简介">
                                        <a-textarea v-model:value="formData.comRemark" placeholder="请输入" />
                                    </a-form-item>
                                    <a-form-item name="tags" label="组件标签">
                                        <AsyncSelect
                                            v-model:value="formData.tags"
                                            mode="tags"
                                            :fieldNames="{label: 'itemValue', value: 'itemValue'}"
                                            :request="getTagsList"
                                            placeholder="请选择或输入"
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
                                    <a-form-item name="comDefaultSize" label="组件尺寸">
                                        <a-input v-model:value="formData.comDefaultSize" placeholder="请输入组件初始大小，用于绝对布局，例如：300,400" />
                                    </a-form-item>
                                    <a-form-item name="comPreviewImgJson" label="预览图">
                                        <IImageUpload
                                            v-model:value="formData.comPreviewImgJson"
                                            :multiple="true"
                                            :paramsData="{upFileType: 'image'}"
                                        />
                                    </a-form-item>
                                    <a-form-item v-if="!state.queryId" name="markdownContent" extra="文档编辑后会存入表单，随表单一并保存" label="组件文档">
                                        <MdEditorButton v-model:value="formData.markdownContent" :path="formData.markdownPath" />
                                    </a-form-item>
                                    <template v-if="formData.currentVersionIndex || formData.currentVersionIndex === 0">
                                        <div class="dist-form-title" :style="{paddingTop: '20px'}">
                                            当前版本信息（{{ formData.componentVersionList[formData.currentVersionIndex].codepackageVersion }}）
                                        </div>
                                        <a-form-item :name="['componentVersionList', formData.currentVersionIndex, 'id']" hidden />
                                        <a-form-item :name="['componentVersionList', formData.currentVersionIndex, 'codepackageVersion']" hidden />
                                        <a-form-item :name="['componentVersionList', formData.currentVersionIndex, 'markdownContent']" extra="文档编辑后会存入表单，随表单一并保存" label="组件文档">
                                            <MdEditorButton v-model:value="formData.componentVersionList[formData.currentVersionIndex].markdownContent" :path="formData.componentVersionList[formData.currentVersionIndex].markdownPath" />
                                        </a-form-item>
                                        <a-form-item :name="['componentVersionList', formData.currentVersionIndex, 'updateTime']" label="更新时间">
                                            <span class="ant-form-text">{{ formData.componentVersionList[formData.currentVersionIndex].updateTime }}</span>
                                        </a-form-item>
                                        <a-form-item name="codepackageClassname" label="关联组件包">
                                            <AButton type="link" size="small" @click.stop="handleCodepackageJump(formData.componentVersionList[formData.currentVersionIndex].codepackageId)">{{ formData.componentVersionList[formData.currentVersionIndex].codepackageClassname }}</AButton>
                                        </a-form-item>
                                    </template>
                                    <div v-if="state.queryId">
                                        <div v-if="formData.componentVersionList && formData.componentVersionList.length > 1" class="dist-form-title" :style="{paddingTop: '20px'}">
                                            历史版本信息
                                            <a-button type="link" size="small" @click="handleHistoryHidden(formData)">{{ !formData.historyHidden ? '收起' : '展开' }}</a-button>
                                        </div>
                                        <template v-for="_, index in formData.componentVersionList" :key="index">
                                            <template v-if="index !== formData.currentVersionIndex">
                                                <div class="dist-form-title-sub" :style="{paddingTop: '20px'}">
                                                    {{ formData.componentVersionList[index].codepackageVersion }}版本信息
                                                    <a-button type="link" size="small" @click="handleVersionHidden(formData.componentVersionList[index], formData.currentIndex)">{{ !formData.componentVersionList[index].hidden && !formData.historyHidden ? '收起' : '展开' }}</a-button>
                                                </div>
                                                <div v-show="!formData.componentVersionList[index].hidden && !formData.historyHidden">
                                                    <a-form-item :name="['componentVersionList', index, 'id']" hidden />
                                                    <a-form-item :name="['componentVersionList', index, 'codepackageVersion']" hidden />
                                                    <a-form-item :name="['componentVersionList', index, 'markdownContent']" extra="文档编辑后会存入表单，随表单一并保存" label="组件文档">
                                                        <MdEditorButton v-model:value="formData.componentVersionList[index].markdownContent" :path="formData.componentVersionList[index].markdownPath" />
                                                    </a-form-item>
                                                    <a-form-item :name="['componentVersionList', index, 'updateTime']" label="更新时间">
                                                        <span class="ant-form-text">{{ formData.componentVersionList[index].updateTime }}</span>
                                                    </a-form-item>
                                                    <a-form-item :name="['componentVersionList', index, 'codepackageClassname']" label="关联组件包">
                                                        <AButton type="link" size="small" @click.stop="handleCodepackageJump(formData.componentVersionList[index].codepackageId)">{{ formData.componentVersionList[formData.currentVersionIndex].codepackageClassname }}</AButton>
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
    </div>
</template>

<script lang="ts" setup>
import { reactive, createVNode } from 'vue'
import { componentPublishApi, coreApi, useHomeCoreApi } from '@/apis'
import { Modal, message } from 'ant-design-vue'
import { ExclamationCircleOutlined, CheckCircleOutlined } from '@ant-design/icons-vue'
import type { FormInstance } from 'ant-design-vue'
// const router = useRouter()
const route = useRoute()
const formRef = ref()
const state = reactive<any>({
    selectedKey: '',
    uploadDisabled: false,
    saveAllLoading: false,
    formDataList: [],
    codeLangueList: [],
    codepackageClassList: [],
    queryId: route.query?.componentIds
})
const currentIndex: any = computed(() => state.formDataList.findIndex((item: any) => item.comId === state.selectedKey))

onMounted(() => {
    getCodeLangueList()
    if (state.queryId) {
        const comIds = state.queryId.split(',')
        state.selectedKey = comIds[0]
        state.saveAllLoading = true
        const promiseArr: any = []
        comIds.forEach((comId: string, index: number) => {
            state.formDataList.push({
                comId,
                formLoading: false
            })
            promiseArr.push(getDistinfo(comId, index))
        })
        Promise.all(promiseArr).then(() => {
            state.saveAllLoading = false
        })
    } else {
        state.selectedKey = 'create'
        state.formDataList.push({
            comId: 'create',
            formLoading: false,
            codepackageId: ''
        })
        getAllCodepackageClass()
        watch(() => state.formDataList[currentIndex.value].codepackageId, (newValue, oldValue) => {
            if (newValue && newValue !== oldValue) {
                getCodePackageVersionList()
                setCodepackageClassname()
                state.formDataList[currentIndex.value].codepackageVersion = null
                state.formDataList[currentIndex.value].comClassname = null
            }
        }, { deep: true, immediate: true })
        watch(() => state.formDataList[currentIndex.value].codepackageVersion, (newValue, oldValue) => {
            if (newValue && newValue !== oldValue) {
                getComClassList()
                state.formDataList[currentIndex.value].comClassname = null
            }
        }, { deep: true, immediate: true })
        watch(() => state.formDataList[currentIndex.value].comClassname, (newValue, oldValue) => {
            if (newValue && newValue !== oldValue) {
                setComInfo()
            }
        }, { deep: true, immediate: true })
    }
})

const getDistinfo = async (comId: string, index: number) => {
    state.formDataList[index].formLoading = true
    const res = await componentPublishApi.requestComInfo({ comId })
    state.formDataList[index].formLoading = false
    if (res.success) {
        state.formDataList[index] = {
            ...state.formDataList[index],
            ...res.result,
            ...res.result.component,
            tags: res.result.component.tags ? res.result.component.tags.split(',') : [],
            coverPath: res.result.component.coverPath ? [{ url: import.meta.env.VITE_BASE_URL + componentPublishApi.componentStaticUrl + res.result.component.coverPath, src: res.result.component.coverPath }] : [],
            comPreviewImgJson: res.result.component.comPreviewImgJson ? JSON.parse(res.result.component.comPreviewImgJson) : [],
            cooperationUserIds: res.result.cooperationUserList?.map((item: any) => ({ value: item.id, label: item.nickname })) || [],
            historyHidden: false,
            currentVersionIndex: res.result.componentVersionList?.findIndex((item: any) => item.codepackageVersion === res.result.component.codepackageVersion),
            componentVersionList: res.result.componentVersionList?.map((item: any) => ({
                ...item,
                hidden: true
            }))
        }
        // 展开第一个历史版本
        const LastHistory = state.formDataList[index].componentVersionList.find((item:any) => item.codepackageVersion !== state.formDataList[index].codepackageVersion)
        if (LastHistory) { LastHistory.hidden = false }
    } else {
        message.error('获取组件信息失败！')
    }
}
const handleDistItemClick = (item: any) => {
    if (item.comId) {
        state.selectedKey = item.comId
    }
}
const handlePublishCancel = async () => {
    const index = currentIndex.value
    const title = '确定要取消发布当前组件吗？'
    const content = ''
    const confirmRes = await showConfirm(title, content, ExclamationCircleOutlined)
    if (confirmRes) {
        state.formDataList[index].formLoading = true
        const res = await componentPublishApi.requestChangeComponentStatus({ ids: state.formDataList[index].id, status: 0 })
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
        // id: state.queryId ? data.id : undefined,
        tags: data.tags ? data.tags.join(',') : '',
        cooperationUserIds: data.cooperationUserIds ? data.cooperationUserIds.map((item: any) => item.value).join(',') : '',
        coverPath: data.coverPath && data.coverPath[0] ? data.coverPath[0].src : '',
        comPreviewImgJson: data.comPreviewImgJson ? JSON.stringify(data.comPreviewImgJson) : '',
        componentVersionList: data.componentVersionList?.map((item: any) => ({
            ...item
        }))
    }
    console.log(params)
    state.formDataList[index].formLoading = true
    const res = await componentPublishApi.requestSaveCom(params)
    state.formDataList[index].formLoading = false
    if (data.closeMessage) {
        return res
    }
    if (res.success) {
        if (!state.queryId && res.result) {
            const title = data.status ? '保存并发布成功！' : '保存成功！'
            const answer = await showConfirm(title, '', CheckCircleOutlined, '#52c41a', '预览详情', '继续发布')
            if (answer) {
                window.location.replace(`/componentMarketDetail?componentId=${res.result}`)
            } else {
                window.location.reload()
            }
        } else {
            if (data.status) {
                message.success('保存并发布成功！')
            } else {
                message.success('保存成功！')
            }
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
                // state.selectedKey = data.comId
                finishArr.push(onFinish({ ...data, status: 1, closeMessage: true }, index))
            })
            Promise.all(finishArr).then((resList) => {
                state.saveAllLoading = false
                if (resList.some((res: any) => !res.success)) {
                    message.error('操作失败！')
                } else {
                    message.success('操作成功！')
                }
            })
        }
    }).catch((err: any) => {
        state.saveAllLoading = false
        state.selectedKey = err.values.comId
        message.error('表单校验失败，请检查！')
    })
}
const handleVersionHidden = (versionData: any, currentVersionIndex: any) => {
    versionData.hidden = !versionData.hidden
    const index = state.formDataList[currentIndex.value].componentVersionList.findIndex((item: any) => !item.hidden)
    if (index !== -1 && index !== currentVersionIndex) {
        state.formDataList[currentIndex.value].historyHidden = false
    } else {
        state.formDataList[currentIndex.value].historyHidden = true
    }
}
const handleHistoryHidden = (formData: any) => {
    formData.historyHidden = !formData.historyHidden
    state.formDataList[currentIndex.value].componentVersionList.forEach((item: any) => {
        item.hidden = formData.historyHidden
    })
}
const handleCodepackageJump = (id: any) => {
    if (id) {
        window.open('/componentPackagePublish?codePackageId=' + id)
    } else {
        window.open('/componentPackagePublish')
    }
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
const getAllCodepackageClass = async () => {
    const res = await componentPublishApi.requestMyAllCodePackageList()
    if (res.success) {
        const arr = res.result.map((item: any) => ({
            ...item,
            label: item.classname,
            value: item.id,
            currentConfigText: JSON.parse(item.currentConfigText)
        }))
        state.codepackageClassList = arr
    }
}
const getCodePackageVersionList = async () => {
    const index = currentIndex.value
    const codepackageId = state.formDataList[index].codepackageId
    const res = await componentPublishApi.requestCodePackageVersionList({ codepackageId })
    if (res.success) {
        const arr = res.result.map((item: any) => ({
            ...item,
            label: item.version,
            value: item.version,
            configText: JSON.parse(item.configText)
        }))
        state.formDataList[index].currentCodepackageversionList = arr
    }
}
const getComClassList = async () => {
    const index = currentIndex.value
    const codepackageVersion = state.formDataList[index].codepackageVersion
    const versionItem = state.formDataList[index].currentCodepackageversionList.find((item: any) => item.version === codepackageVersion)
    state.formDataList[index].currentComClassList = versionItem
        ? versionItem.configText.module.map((item: any) => ({
            ...item,
            label: item.className,
            value: item.className
        }))
        : []
}
const setCodepackageClassname = () => {
    const index = currentIndex.value
    const codepackageId = state.formDataList[index].codepackageId
    const codepackageItem = state.codepackageClassList.find((item: any) => item.value === codepackageId)
    state.formDataList[index].codepackageClassname = codepackageItem && codepackageItem.classname
}
const setComInfo = () => {
    const index = currentIndex.value
    const comClassname = state.formDataList[index].comClassname
    const codepackageVersion = state.formDataList[index].codepackageVersion
    const comItem = state.formDataList[index].currentComClassList.find((item: any) => item.value === comClassname)
    const versionItem = state.formDataList[index].currentCodepackageversionList.find((item: any) => item.version === codepackageVersion)
    // /codepackage/1887093/basics/1.0.0/static/doc/components/IIcon.md
    state.formDataList[index].comClassid = comItem && comItem.classId
    state.formDataList[index].comLangue = comItem && comItem.comLangue
    state.formDataList[index].comTitle = comItem && comItem.comName
    state.formDataList[index].comType = comItem && comItem.comType
    state.formDataList[index].markdownPath = versionItem && comItem ? `${versionItem.codePath}static/doc/components/${comItem.className}.md` : ''
}
const getTagsList = async () => {
    return await coreApi.requestWebInfoListByGroup({ groupCd: 'componentTags' })
}
const getCooperationUserList = async (text: string) => {
    return await useHomeCoreApi.requestSearchUser({ searchTxt: text })
}
const showConfirm = (title: string, content: string, icon: any, iconColor?: string, okText?: string, cancelText?: string) => {
    return new Promise((resolve) => {
        Modal.confirm({
            icon: iconColor ? createVNode(icon, { style: { color: iconColor } }) : createVNode(icon),
            title,
            content,
            cancelText: cancelText || '取消',
            okText: okText || '确定',
            onOk() {
                resolve(true)
            },
            onCancel() {
                resolve(false)
            }
        })
    })
}
// const showSuccess = (title: string, content: string) => {
//     return new Promise((resolve) => {
//         Modal.success({
//             title,
//             content,
//             okText: '知道了',
//             onOk() {
//                 resolve(true)
//             }
//         })
//     })
// }
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
