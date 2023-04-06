<template>
    <div class="flex message-box-container align-center">
        <div class="message-icon-container flex justify-center align-center" style="background: rgb(241, 154, 57)">
            <svg-icon iconClass="renqun"></svg-icon>
        </div>
        <div>
            <div class="message-title">
                {{ messageData.nickname }}{{ messageActionType[messageData.type] }}{{ messageData.type == 6 ? '您加入他的组织' : '加入您的组织' }}
                <span class="message-time">{{ messageData.msgTime }}</span>
            </div>
            <div class="message-content">
                {{ messageData['orgName'] }}
            </div>
        </div>
        <div class="flex-1 text-right">
            <a-button v-if="messageData.type === 6 && messageData.readStatus != 1" :size="size === 'mini' ? 'small' : undefined" type="primary" @click="showConfirm">
                同意加入
            </a-button>
            <a-button
                v-if="messageData.type === 6 && messageData.readStatus != 1"
                :size="size === 'mini' ? 'small' : undefined"
                style="margin: 0 0 0 20px"
                @click="handleClickBtn('requestAgreeJoinOrg')">
                拒绝加入
            </a-button>
            <a-button
                v-if="messageData.type === 7 && messageData.readStatus != 1"
                :size="size === 'mini' ? 'small' : undefined"
                type="primary"
                @click="handleClickBtn('requestApproveJoinOrgAdmin', { checkStatus: 1 })">
                接受加入
            </a-button>
            <a-button
                v-if="messageData.type === 7 && messageData.readStatus != 1"
                style="margin: 0 0 0 20px"
                :size="size === 'mini' ? 'small' : undefined"
                @click="handleClickBtn('requestApproveJoinOrgAdmin', { checkStatus: 0 })">
                拒绝加入
            </a-button>
            <span v-if="messageData.readStatus == 1">已处理</span>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { messageActionType } from '@/enums/messageEnum'
import { useOrgAboutApi } from '@/apis'
import { Modal } from 'ant-design-vue'
import { message } from '@/plugins/globalComponents'
import { createVNode } from 'vue'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
const propData = defineProps<{ messageData: MessageData; size: string, showLocation: string }>()
type RequestType = 'requestAgreeJoinOrg' | 'requestRejectJoinOrg' | 'requestApproveJoinOrgAdmin'
const emitter = defineEmits(['updateMessage'])
const handleClickBtn = (type: RequestType, params: Object = {}) => {
    useOrgAboutApi[type]({
        msgId: propData.messageData.id,
        ...params
    }).then((res) => {
        message[res.success ? 'success' : 'error'](res.message)
        if (res.success) {
            // dorefresh
            emitter('updateMessage')
        }
    })
}
const showConfirm = () => {
    Modal.confirm({
        title: '提示',
        icon: createVNode(ExclamationCircleOutlined),
        content: '是否授权手机号给该组织管理员查看',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
            handleClickBtn('requestAgreeJoinOrg', { shareMobile: 1 })
        }
    })
}
</script>

<style lang="scss" scoped>
@import './common.scss';
</style>
