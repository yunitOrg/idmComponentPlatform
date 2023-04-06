<template>
    <div class="flex message-box-container align-center">
        <div class="message-icon-container flex justify-center align-center" style="background: rgb(64, 169, 255)">
            <svg-icon iconClass="laba"></svg-icon>
        </div>
        <div>
            <div class="message-title">
                {{ messageData.msgTitle || '系统通知' }}<span class="message-time">{{ messageData.msgTime }}</span>
            </div>
            <div class="message-content">{{ messageData.msgContent }}</div>
        </div>
    </div>
    <div>
        {{ messageData['cmtContent'] }}
    </div>
</template>
<script lang="ts" setup>
defineProps<{ messageData: MessageData }>()
</script>

<style lang="scss" scoped>
@import './common.scss';
</style>
