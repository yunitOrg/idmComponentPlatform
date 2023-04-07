<template>
    <div class="flex message-box-container align-center">
        <div class="message-icon-container flex justify-center align-center" style="background-color: rgb(53, 133, 247)">
            <svg-icon iconClass="dianzan"></svg-icon>
        </div>
        <div>
            <div class="message-title">
                <span class="cursor-pointer" @click="jumpIndexPage">{{ messageData.nickname }}</span> {{ messageActionType[messageData.type] }}了你的{{
                    messageSourceType[messageData.sourceType]
                }}
                <span class="message-time">{{ messageData.msgTime }}</span>
            </div>
            <div class="message-content">{{ messageData[messageTitleFields[messageData.sourceType]] }}</div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { messageActionType, messageSourceType, messageTitleFields } from '@/enums/messageEnum'
const propData = defineProps<{ messageData: MessageData }>()
const router = useRouter()
const jumpIndexPage = () => {
    const { href } = router.resolve({ name: 'indexPage', params: { userId: propData.messageData.sendUserId } })
    window.open(href, '_blank')
}
</script>

<style lang="scss" scoped>
@import './common.scss';
</style>
