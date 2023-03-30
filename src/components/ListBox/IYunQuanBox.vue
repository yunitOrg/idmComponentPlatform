<template>
    <div class="idm-yuanquan-box">
        <div class="yuanquan-title">
            <span class="text-o-e-2 cursor-pointer">
                <span class="talk-hash">#{{ componentProps.hash }}#</span>
                {{ componentProps.title }}
            </span>
        </div>
        <a-row v-if="componentProps.images && componentProps.images.length > 0" :gutter="[20, 20]">
            <a-col v-for="(item, index) in componentProps.images" :key="index" :span="12">
                <img :src="item" alt="图片加载失败" class="yunquan-image" />
            </a-col>
        </a-row>
        <view class="yuanquan-tag"> {{ componentProps.tag }} </view>
        <div class="flex justify-between align-center yuanquan-bottom">
            <div>{{ componentProps.user }}</div>
            <div class="flex align-center">
                <svg-icon icon-class="aixin" class-name="yuanquan-aixin"></svg-icon>
                <span>{{ componentProps.like }}</span>
                <svg-icon icon-class="pinglun" class-name="yuanquan-pinglun"></svg-icon>
                <span>{{ componentProps.comment }}</span>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { IYunQuanData } from './mock/mockData'
defineProps({
    componentProps: {
        type: Object,
        default: () => IYunQuanData
    }
})
</script>

<style lang="scss" scoped>
.idm-yuanquan-box {
    margin: 0 0 20px 0;
    font-size: 12px;

    .yuanquan-title {
        color: #000;
        margin: 0 0 5px 0;
    }

    .talk-hash {
        color: rgb(53, 199, 94);
        margin: 0 5px 0 0;
    }

    .yuanquan-tag {
        background: #eee;
        border-radius: 15px;
        overflow: hidden;
        color: #000;
        padding: 0px 8px;
    }

    .yunquan-image {
        width: 100%;
    }

    .yuanquan-bottom {
        margin: 5px 0 0 0;
    }

    .yuanquan-aixin {
        margin: 0 5px 0 0;
    }

    .yuanquan-pinglun {
        margin: 0 5px 0 10px;
    }
}
</style>
