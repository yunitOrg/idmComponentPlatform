<template>
    <AButton type="primary" :disabled="!path" @click="handleButtonClick">打开编辑文档</AButton>
    <a-modal
        v-model:visible="state.visible"
        destroyOnClose
        width="1200px"
        centered
        :closable="false"
        :maskClosable="false"
        class="md-editor-button-wrap"
        title="编辑文档"
    >
        <ASpin :spinning="state.loading">
            <v-md-editor v-model:model-value="state.value" height="700px" left-toolbar="undo redo clear | h bold italic strikethrough quote | ul ol table hr | link image code" />
        </ASpin>
        <template #footer>
            <span style="float: left;color: red">{{ tip }}</span>
            <a-button key="back" @click="handleCancel">取消</a-button>
            <a-button key="submit" type="primary" @click="handleOk">保存</a-button>
        </template>
    </a-modal>
</template>
<script lang="ts" setup>
import { componentPublishApi } from '@/apis'
const props = defineProps({
    value: {
        type: String,
        default: ''
    },
    path: {
        type: String,
        default: ''
    },
    tip: {
        type: String,
        default: '如果上传组件包为同一版本号将以组件包内的文档为准，如需要请及时复制粘贴至源码中进行同步最新'
    }

})
const state = reactive({
    value: '',
    loading: false,
    visible: false
})
const emit = defineEmits(['update:value'])
watch(() => props.value, () => {
    state.value = props.value
}, { deep: true, immediate: true })

const handleButtonClick = () => {
    state.value = props.value
    state.visible = true
}
const handleOk = () => {
    emit('update:value', state.value)
    state.visible = false
}
const handleCancel = () => {
    state.visible = false
}
const getMdContent = (newValue: any, oldValue: any) => {
    if (newValue && newValue !== oldValue) {
        state.loading = true
        componentPublishApi.requestComponentStatic(props.path).then((res) => {
            state.loading = false
            if (res) {
                // state.value = res
                emit('update:value', String(res))
            } else {
                // state.value = ''
                emit('update:value', '')
            }
        }).catch(() => {
            state.loading = false
            // state.value = ''
            emit('update:value', '')
        })
    }
}

watch(() => props.path, getMdContent, { deep: true, immediate: true })
</script>

<style lang="scss">
.md-editor-button-wrap {
    .ant-modal-body {
        padding: 0;
    }
}
</style>
