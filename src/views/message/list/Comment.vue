<template>
    <div class="flex message-box-container align-center">
        <div class="message-icon-container flex justify-center align-center" style="background: #67bf59">
            <svg-icon iconClass="pinglun2"></svg-icon>
        </div>
        <div>
            <div class="message-title">
                {{ messageData.nickname }} {{ messageActionType[messageData.type] }}了你的{{ messageSourceType[messageData.sourceType]
                }}<span class="message-time">{{ messageData.msgTime }}</span>
            </div>
            <div class="message-content">{{ messageData[messageTitleFields[messageData.sourceType]] }}</div>
        </div>
    </div>
    <div>
        {{ messageData['cmtContent'] }}
    </div>
</template>
<script lang="ts" setup>
import { messageActionType, messageSourceType, messageTitleFields } from '@/enums/messageEnum'
defineProps<{ messageData: MessageData }>()
</script>

<style lang="scss" scoped>
@import './common.scss';
</style>
