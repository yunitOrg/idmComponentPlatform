<template>
    <div v-for="(item, index) in messageList" :key="index" :class="['message-box-' + size]">
        <!-- <AllMessage v-if="item.type == 0"></AllMessage> -->
        <!-- 提到我的 -->
        <AboutMe v-if="item.type == 0" :messageData="item"></AboutMe>
        <!-- 赞和收藏 -->
        <Praise v-if="[4, 5].includes(item.type)" :messageData="item"></Praise>
        <!-- 评论与回复 -->
        <Comment v-if="[1, 2].includes(item.type)" :messageData="item"></Comment>
        <!-- 粉丝 -->
        <Fans v-if="item.type == 3" :messageData="item"></Fans>
        <!-- 邀请和申请 -->
        <Invitation v-if="[6, 7].includes(item.type)" :messageData="item" :size="size" :showLocation="showLocation" @updateMessage="emitter('updateMessage', index)"></Invitation>
        <!-- 私信 -->
        <Private v-if="item.type == 11" :messageData="item"></Private>
        <!-- 系统消息 -->
        <System v-if="item.type == 10" :messageData="item"></System>
        <!-- 赞赏与付费 -->
        <Appreciate v-if="[8, 9].includes(item.type)" :messageData="item"></Appreciate>
    </div>
</template>
<script lang="ts" setup>
import AboutMe from './AboutMe.vue'
import Praise from './Praise.vue'
import Comment from './Comment.vue'
import Fans from './Fans.vue'
import Invitation from './Invitation.vue'
import Private from './Private.vue'
import System from './System.vue'
import Appreciate from './Appreciate.vue'
defineProps<{ messageList: Array<MessageData>; size: string; showLocation: string }>()
const emitter = defineEmits(['updateMessage'])
</script>

<style lang="scss" scoped></style>
