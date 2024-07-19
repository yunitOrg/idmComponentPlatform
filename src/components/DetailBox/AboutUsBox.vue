<template>
    <div class="idm-component-common-box about-us-box-container">
        <div class="flex justify-between about-us-box-top">
            <div v-for="item in textList" :key="item.text" class="cursor-pointer">{{ item.text }}</div>
        </div>
        <div class="text-999">{{ settings.product }}</div>
        <div class="text-999">{{ settings.recordNo }}</div>
        <div class="text-999">{{ settings.filingIntr }}</div>
        <div class="intr-title text-center">云IT <span style="margin: 0 6px 0 2px">·</span>IDM框架</div>
        <div class="text-999" style="color: #666666;">
            {{ settings.subIntr }}
        </div>
        <div class="text-center" style="margin: 10px 0;">
            <AButton type="primary" @click="handleJump({ url: settings.url })">立即免费使用</AButton>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { settings } from '@/settings/idmSettings'
import { isUrl } from '@/utils/is'
const textList = [{ text: '关于我们' }, { text: '联系我们' }, { text: '加入我们' }, { text: '意见反馈' }]
const handleJump = (item: { url: string }) => {
    if (!item.url) return
    if (isUrl(item.url)) {
        return window.open(item.url, '_blank')
    }
}
</script>
<style lang="scss" scoped>
.about-us-box-container {
    margin: 16px 0 0 0;
    padding: 10px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.05);
    .about-us-box-top {
        font-size: 12px;
        border-bottom: 1px solid #eee;
        padding: 0 0 8px 0;
    }
    .intr-title {
        color: #333;
        font-size: 16px;
        margin: 10px 0;
        font-weight: 600;
    }
    .text-999 {
        margin: 7px 0 0 0;
        font-size: 12px;
        color: #999;
    }
}
</style>
