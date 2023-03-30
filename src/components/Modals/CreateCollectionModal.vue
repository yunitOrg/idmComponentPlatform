<template>
    <a-modal
        width="600px"
        centered
        wrapClassName="idm-create-collection-box"
        :body-style="{ padding: '15px 28px 15px' }"
        :visible="visible"
        :mask-closable="false"
        title=""
        :footer="null"
        @cancel="() => {emits('update:visible', false); handleCancel()}">
        <div class="text-center box-title">创建收藏夹</div>
        <AForm ref="formRef" :model="formState" name="createCollection" :label-col="{ span: 4 }" :wrapper-col="{ span: 18, offset: 1 }">
            <AFormItem label="名称" name="title" :rules="[{ required: true, message: '请输入收藏夹名称' }]">
                <AInput v-model:value="formState.title" placeholder="请输入收藏夹名称" @keyup.enter="handleConfirm"> </AInput>
            </AFormItem>
            <AFormItem label="描述" name="remark" :rules="[{ required: false }]">
                <ATextarea
                    v-model:value="formState.remark"
                    :auto-size="{ minRows: 6, maxRows: 6 }"
                    placeholder="请输入收藏夹描述（限100字，选填）"
                    @keyup.enter="handleConfirm">
                </ATextarea>
            </AFormItem>
        </AForm>
        <div class="text-center">
            <AButton type="primary" style="margin: 0 20px 0 0" :loading="pageData.btnLoading" @click="handleConfirm">确定</AButton>
            <AButton type="default" @click="handleCancel">取消</AButton>
        </div>
    </a-modal>
</template>

<script lang="ts" setup>
import type { FormInstance } from 'ant-design-vue'
import { useUserApi } from '@/apis'
import { message } from '@/plugins/globalComponents'
const propData = defineProps({
    visible: {
        type: Boolean,
        default: false
    }
})
const formRef = ref<FormInstance>()
const formState = reactive({
    title: '',
    remark: ''
})
const pageData = reactive<{ [x: string]: any }>({
    btnLoading: false
})
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
const emits = defineEmits(['update:visible', 'onSuccess'])
const handleConfirm = async () => {
    await formRef.value?.validateFields()
    pageData.btnLoading = true
    try {
        const res = await useUserApi.requestCreateCollectFolder(formState)
        message[res.success ? 'success' : 'error'](res.message)
        if (res.success) {
            emits('onSuccess')
        }
    } finally {
        pageData.btnLoading = false
    }
}
const handleCancel = () => {
    emits('onSuccess')
}
</script>
<style lang="scss" scoped>
.box-title {
    font-size: 20px;
    font-weight: 600;
    margin: 0 0 30px 0;
}
</style>
