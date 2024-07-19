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
            <div class="message-content" @click="gotoDetail">{{ messageData[messageTitleFields[ messageData.sourceType == 9 || messageData.sourceType == 10?9:messageData.sourceType]] }}</div>
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
const gotoDetail = () => {
    let url = null
    switch (propData.messageData.sourceType) {
        case 1:
            url = { name: 'index-componentPackage-detail', query: { codepackageId: propData.messageData.sourceId } }
            break
        case 2:
            url = { name: 'index-componentMarket-detail', query: { componentId: propData.messageData.sourceId } }
            break
        case 3:
            url = { name: 'index-iSchool-videoDetail', query: { courseId: propData.messageData.sourceId } }
            break
        case 8:
            url = { name: 'index-page-detail', query: { id: propData.messageData.sourceId } }
            break
        case 9:
            url = { name: 'index-template-detail', query: { id: propData.messageData.sourceId } }
            break
        case 10:
            url = { name: 'index-bcomponent-detail', query: { id: propData.messageData.sourceId } }
            break
        case 11:
            url = { name: 'index-image-detail', query: { id: propData.messageData.sourceId } }
            break
    }
    if (!url) {
        return
    }
    const { href } = router.resolve(url)
    window.open(href, '_blank')
}
</script>

<style lang="scss" scoped>
@import './common.scss';
</style>
