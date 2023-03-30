<template>
    <a-modal
        width="600px"
        centered
        wrapClassName="idm-choose-collection-box"
        :body-style="{ padding: '15px 28px 15px' }"
        :visible="visible"
        :mask-closable="false"
        title=""
        :footer="null"
        @cancel="() => emits('update:visible', false)">
        <div class="text-center box-title">选择收藏夹</div>
        <div class="idm-choose-collection-box-container common-scrollbar_style">
            <a-radio-group v-model:value="pageData.collectionId" style="width: 100%">
                <a-radio
                    v-for="(item, index) in pageData.collectionList"
                    :key="index"
                    class="radio-line flex justify-between align-center flex-direction-row-reverse"
                    :value="item.id">
                    <div class="collection-title">{{ item.title }}</div>
                    <div class="collection-number text-o-e-1">收藏数量：{{ item.contentNumber || '0' }} <span style="display: inline-block;margin: 0 10px;">描述：{{ item.remark }}</span></div>
                </a-radio>
            </a-radio-group>
            <AEmpty v-if="!pageData.isFirst && pageData.collectionList.length === 0" style="margin-top: 10px;" />
        </div>
        <div class="flex justify-between">
            <AButton type="link" style="padding: 0" @click="emits('handleCreateCollection')">+新建收藏集</AButton>
            <AButton type="primary" style="margin: 0" :disabled="!pageData.collectionId" :loading="pageData.btnLoading" @click="handleConfirm">确定</AButton>
        </div>
    </a-modal>
</template>

<script lang="ts" setup>
import { useUserApi } from '@/apis'
import { message } from '@/plugins/globalComponents'
const propData = defineProps({
    visible: {
        type: Boolean,
        default: false
    },
    sourceType: {
        type: String,
        required: true,
        default: ''
    },
    sourceId: {
        type: String,
        required: true,
        default: ''
    }
})
const pageData = reactive<{ [x: string]: any }>({
    btnLoading: false,
    collectionList: [],
    collectionId: '',
    isFirst: true
})
watch(
    () => propData.visible,
    (newV) => {
        if (newV) {
            pageData.collectionId = ''
            handleGetCollection()
        }
    }
)
const emits = defineEmits(['update:visible', 'handleCreateCollection', 'onSuccess'])
const handleConfirm = async () => {
    pageData.btnLoading = true
    try {
        if (!pageData.collectionId) {
            return message.warn('请选择收藏夹')
        }
        const res = await useUserApi.requestUserCollect({
            folderId: pageData.collectionId,
            sourceType: propData.sourceType,
            sourceId: propData.sourceId
        })
        message[res.success ? 'success' : 'error'](res.message)
        if (res.success) {
            emits('update:visible', false)
            emits('onSuccess')
        }
    } finally {
        pageData.btnLoading = false
    }
}
const handleGetCollection = async () => {
    try {
        const res = await useUserApi.requestMyCollectFolderList()
        if (res.success) {
            pageData.collectionList = res.result
            pageData.isFirst = false
        }
    } catch {
        pageData.collectionList = []
        pageData.isFirst = false
    }
}
</script>
<style lang="scss" scoped>
.box-title {
    font-size: 20px;
    font-weight: 600;
    margin: 0 0 20px 0;
}
.idm-choose-collection-box-container {
    min-height: 200px;
    max-height: 300px;
    margin: 0 0 20px 0;
    overflow-y: auto;
    overflow-x: hidden;
}
.radio-line {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: row-reverse;
    padding: 12px 0;
    border-bottom: 1px solid #f1f1f1;
    ::v-deep(span:not(.ant-radio)) {
        flex: 1;
        display: block;
        padding: 0;
    }
    .collection-title {
        font-size: 18px;
    }
    .collection-number {
        font-size: 12px;
        color: #999;
    }
}
</style>
