<template>
    <a-modal
        width="800px"
        centered
        wrapClassName="idm-reg-org-box"
        :body-style="{ padding: '15px 28px 15px' }"
        :visible="visible"
        :mask-closable="false"
        :update:visible="($e: boolean) => emits('update:visible', $e)"
        title=""
        :footer="null"
        @cancel="() => emits('update:visible', false)">
        <div class="text-center box-title">创建新组织</div>
        <AForm ref="formRef" :model="formState" name="regOrg" :label-col="{ span: 4 }" :wrapper-col="{ span: 18, offset: 1 }">
            <AFormItem label="组织头像" name="orgphoto" :rules="[{ required: true, message: '请上传组织logo' }]">
                <AUpload
                    v-model:file-list="formState.orgphoto"
                    :showUploadList="{ showPreviewIcon: false }"
                    accept=".png,.jpg,.jpeg,.gif"
                    list-type="picture-card"
                    :before-upload="beforeUpload"
                    @remove="handleRemove">
                    <div v-if="formState.orgphoto.length == 0">
                        <plus-outlined></plus-outlined>
                        <div class="ant-upload-text">Upload</div>
                    </div>
                </AUpload>
            </AFormItem>
            <AFormItem label="组织名称" name="orgname" :rules="[{ required: true, message: '请输入组织名称' }]">
                <AInput v-model:value="formState.orgname" placeholder="请输入组织名称" />
            </AFormItem>
            <AFormItem label="组织简介" name="introduce" :rules="[{ required: true, message: '请输入组织简介' }]">
                <a-textarea v-model:value="formState.introduce" :autoSize="{ minRows: 4, maxRows: 6 }" placeholder="请输入组织简介" allow-clear />
            </AFormItem>
            <AFormItem label="企业名称" name="companyName">
                <AInput v-model:value="formState.companyName" placeholder="请输入企业名称" />
            </AFormItem>
            <AFormItem label="公开可见" name="rolePublic" :rules="[{ required: true, message: '' }]">
                <a-radio-group v-model:value="formState.rolePublic">
                    <a-radio value="1" name="rolePublic">公开</a-radio>
                    <a-radio value="0" name="rolePublic">不公开</a-radio>
                </a-radio-group>
            </AFormItem>
        </AForm>
        <div class="text-center">
            <AButton type="primary" style="margin: 0 20px 0 0" :loading="pageData.btnLoading" @click="handleConfirm">创建</AButton>
            <AButton type="default" @click="emits('update:visible', false)">取消</AButton>
        </div>
    </a-modal>
</template>

<script lang="ts" setup>
import type { FormInstance, UploadProps } from 'ant-design-vue'
import { useHomeCoreApi, componentPublishApi } from '@/apis'
import { message } from '@/plugins/globalComponents'
import { PlusOutlined } from '@ant-design/icons-vue'
const propData = defineProps({
    visible: {
        type: Boolean,
        default: false
    }
})
const formState = reactive<{ [x: string]: any }>({
    orgphoto: [],
    orgname: '',
    introduce: '',
    companyName: '',
    rolePublic: '1'
})
const pageData = reactive<{ [x: string]: any }>({
    btnLoading: false,
    uploadDisabled: false,
    orgLogo: []
})
const formRef = ref<FormInstance>()
watch(
    () => propData.visible,
    (newV) => {
        if (newV) {
            nextTick(() => {
                formRef.value?.resetFields()
            })
        }
    }
)
const emits = defineEmits(['update:visible', 'onClose'])
const handleConfirm = async () => {
    await formRef.value?.validateFields()
    try {
        pageData.btnLoading = true
        const res = await useHomeCoreApi.requestCoreRegisterOrg({
            ...formState,
            orgphoto: formState.orgphoto[0].vurl
        })
        message[res.success ? 'success' : 'error'](res.message)
        if (res.success) {
            emits('update:visible', false)
            emits('onClose')
        }
    } finally {
        pageData.btnLoading = false
    }
}
const beforeUpload: UploadProps['beforeUpload'] = async (file: any) => {
    const url = await handleUpload(file)
    file.vurl = url
    formState.orgphoto = [...formState.orgphoto, file]
    return false
}
const handleRemove: UploadProps['onRemove'] = (file) => {
    const index = formState.orgphoto.indexOf(file)
    const newFileList = formState.orgphoto.slice()
    newFileList.splice(index, 1)
    formState.orgphoto = newFileList
}
const handleUpload = (file: any = {}) =>
    new Promise(async (resolve) => {
        if (file) {
            pageData.uploadDisabled = true
            formState.orgphoto = []
            const params = {
                file,
                data: {
                    upFileType: 'image'
                }
            }
            const res = await componentPublishApi.requestUploadDist(params).catch(() => {
                formState.orgphoto = []
            })
            if (res.result?.filePath) {
                resolve(res.result.filePath)
            }
        }
    })
</script>
<style lang="scss" scoped>
.box-title {
    font-size: 20px;
    font-weight: 600;
    margin: 0 0 30px 0;
}
::v-deep(.ant-form-item) {
    margin-bottom: 40px;
}
::v-deep(.ant-form-item:first-child) {
    .ant-form-item-label > label {
        padding: 55px 0 0 0;
    }
}
</style>
