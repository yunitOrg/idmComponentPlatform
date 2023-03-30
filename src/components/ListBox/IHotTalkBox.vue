<template>
    <div class="idm-hot-talk-box cursor-pointer ant-card ant-card-hoverable" :style="{ backgroundImage: `url(${componentProps.bgImage})` }">
        <div class="hot-talk-title">#{{ componentProps.title }}</div>
        <div class="hot-talk-sub-title">{{ componentProps.subTitle }}</div>
        <div class="hot-talk-join flex align-center"><svg-icon icon-class="right-arrow-circle" class-name="hot-talk-icon"></svg-icon> <span>参入话题</span></div>
    </div>
</template>
<script lang="ts" setup>
import { IHotTalkData } from './mock/mockData'
defineProps({
    componentProps: {
        type: Object,
        default: () => IHotTalkData
    }
})
</script>

<style lang="scss" scoped>
.idm-hot-talk-box {
    color: #fff;
    padding: 7px 10px;
    border-radius: 5px;
    background: #f10215;
    background-size: 100% 100%;
    background-repeat: no-repeat;

    .hot-talk-sub-title {
        margin-top: 3px;
        font-size: 12px;
    }

    .hot-talk-join {
        margin-top: 20px;
        font-size: 12px;
        flex-direction: row-reverse;
    }

    .hot-talk-icon {
        font-size: 21px;
    }
}
</style>
