<template>
    <div class="bg-white idm-components-plateform-footer">
        <div class="page-max-width">
            <a-row>
                <a-col :span="7">
                    <div class="intr-title">关于</div>
                    <div v-for="(item, index) in settings.aboutUsList" :key="index" class="cursor-pointer about-link" @click="handleJump(item)">{{ item.title }}</div>
                </a-col>
                <a-col :span="8">
                    <div class="intr-title">相关产品</div>
                    <AImage class="cursor-pointer" :src="productImage" :preview="false"></AImage>
                </a-col>
                <a-col :span="9" class="text-center">
                    <div class="intr-title">云IT <span style="margin: 0 6px 0 2px">·</span>IDM框架</div>
                    <div class="subintr-title">{{ settings.subIntr }}</div>
                    <AButton type="primary" @click="handleJump({ url: settings.url })">立即免费使用</AButton>
                </a-col>
            </a-row>
        </div>
    </div>
    <div class="page-max-width flex justify-between idm-components-plateform-footer-bottom">
        <div class="cursor-pointer">{{ settings.product }}</div>
        <div class="cursor-pointer">{{ settings.filingIntr }} <span> {{ settings.recordNo }}</span></div>
    </div>
</template>
<script lang="ts" setup>
import { productImage } from '@/assets/images'
import { settings } from '@/settings/idmSettings'
import { isUrl } from '@/utils/is'
const router = useRouter()
const handleJump = (item: { url: string }) => {
    if (!item.url) return
    if (isUrl(item.url)) {
        return window.open(item.url, '_blank')
    }
    router.push({
        name: item.url
    })
}
</script>
<style lang="scss" scoped>
.idm-components-plateform-footer {
    box-shadow: 0 -3px 3px #f1f1f1;
    padding: 30px 0 20px;
    .intr-title {
        color: #333;
        font-size: 16px;
        margin: 0 0 10px 0;
        font-weight: 600;
    }
    .about-link {
        color: #999;
        font-size: 13px;
        margin: 0 0 10px 0;
    }
    .subintr-title {
        color: #999;
        margin: 10px 0 20px 0;
    }
}
.idm-components-plateform-footer-bottom {
    color: #999;
    font-size: 12px;
    padding: 5px 0;
}
</style>
