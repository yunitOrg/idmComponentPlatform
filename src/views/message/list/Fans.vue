<template>
    <div class="flex message-box-container align-center">
        <div class="message-icon-container flex justify-center align-center" style="background: rgb(118, 143, 199)">
            <svg-icon iconClass="yanjing"></svg-icon>
        </div>
        <div>
            <div class="message-title">{{ messageActionType[messageData.type] }} <span class="message-time">{{ messageData.msgTime }}</span></div>
            <div>
                <span class="message-content">{{ messageData.nickname }}</span>
                关注了你
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { messageActionType } from '@/enums/messageEnum'
defineProps<{ messageData: MessageData }>()
</script>

<style lang="scss" scoped>
@import './common.scss';
</style>
