<template>
    <div class="preview-header head-bar-container-shadow">
        <a-row>
            <a-col :span="8">
                <div class="header-left flex align-center">
                    <img style="width: 100px" :src="yunitLogo" />
                    <span class="intr-text">{{ pageData.componentName }}</span>
                </div>
            </a-col>
            <a-col :span="8">
                <div class="header-center flex justify-center align-center">
                    <div class="center-icon cursor-pointer flex justify-center align-center" :class="[pageData.currentValue >= 992 && 'icon-active']" @click="setMaxSize">
                        <svg-icon iconClass="pc"></svg-icon>
                    </div>
                    <div
                        class="center-icon cursor-pointer flex justify-center align-center"
                        style="transform: rotate(270deg); padding: 0; width: 34px"
                        :class="[pageData.currentValue === 768 && 'icon-active']"
                        @click="pageData.currentValue = 768">
                        <svg-icon iconClass="pingban"></svg-icon>
                    </div>
                    <div
                        class="center-icon cursor-pointer flex justify-center align-center"
                        :class="[pageData.currentValue === 375 && 'icon-active']"
                        @click="pageData.currentValue = 375">
                        <svg-icon iconClass="tablet"></svg-icon>
                    </div>
                    <a-input-number v-model:value="pageData.currentValue" style="width: 120px; margin: 0 0 0 60px" :precision="0" :min="375" :max="pageData.maxWidth">
                        <template #addonAfter>px</template>
                    </a-input-number>
                </div>
            </a-col>
            <a-col :span="8">
                <div class="header-right flex align-center flex-direction-row-reverse">
                    <a-button class="header-button" type="primary" size="small" @click="handleClose">关闭</a-button>
                    <a-button class="header-button" type="default" size="small" @click="router.replace({ name: 'index' })">回到首页</a-button>
                </div>
            </a-col>
        </a-row>
    </div>
    <div v-show="pageData.subPageIsLoaded" class="flex justify-center iframe-container">
        <iframe
            id="previewIframe"
            :src="pageData.previewSrc"
            frameborder="0"
            :style="{ width: pageData.currentValue + 'px' }"
            class="preview-iframe common-scrollbar_style"></iframe>
    </div>
    <div v-show="!pageData.subPageIsLoaded" class="flex justify-center iframe-container align-center">
        <a-spin size="large" tip="正在加载..."></a-spin>
    </div>
</template>

<script lang="ts" setup>
import { yunitLogo } from '@/assets/images'
const router = useRouter()
const route = useRoute()
const pageData = reactive({
    currentValue: 375,
    maxWidth: 400000,
    previewSrc: '',
    subPageIsLoaded: false,
    componentName: '预览组件'
})
const handleClose = () => {
    window.location.href = 'about:blank'
    window.close()
}
const setMaxSize = () => {
    pageData.currentValue = window.innerWidth - 40
}
const setDefaultSize = (size: string) => {
    switch (size) {
        case '2':
            pageData.currentValue = 375
            break
        case '1':
            setMaxSize()
            break
        case '0':
        default:
            pageData.currentValue = 768
    }
}
const iframeLoaded = () => {
    pageData.subPageIsLoaded = true
}
onMounted(() => {
    pageData.maxWidth = window.innerWidth - 40
    // 监听iframe中的内容加载完成
    const previewIframe: any = document.getElementById('previewIframe')
    if (!previewIframe.addEventListener) {
        previewIframe.attachEvent('onload', iframeLoaded)
    } else {
        previewIframe.addEventListener('load', iframeLoaded, true)
    }
})
// 监听路由对象
watch(
    () => route,
    (newV) => {
        if (newV.query.previewSrc) {
            pageData.previewSrc = decodeURIComponent(newV.query.previewSrc as string)
        }
        setDefaultSize(newV.query.adaptiveType as string)
        if (newV.query.componentName) {
            pageData.componentName = newV.query.componentName as string
        }
    },
    {
        deep: true,
        immediate: true
    }
)
</script>

<style lang="scss" scoped>
.preview-header {
    padding: 10px 20px;
    background-color: #fff;
    .header-left {
        .intr-text {
            margin-left: 10px;
            margin-right: 5px;
            font-size: 16px;
        }
    }
    .header-center {
        height: 100%;
        .center-icon {
            width: 32px;
            height: 32px;
            padding: 0 5px;
            font-size: 24px;
            color: rgba(0, 0, 0, 0.6);
            margin: 0 10px;
        }
        .icon-active {
            background-color: #eee;
            border-radius: 3px;
        }
    }
    .header-right {
        height: 100%;
        .header-button {
            height: 30px;
            padding: 3px 8px;
            margin-right: 15px;
            &:first-child {
                margin-right: 0;
            }
        }
    }
}
.iframe-container {
    padding: 20px;
    height: calc(100vh - 55px);
    .preview-iframe {
        height: 100%;
        transition: width 0.3s;
        box-shadow: 0 2px 6px 0 rgba($color: #000000, $alpha: 0.06);
    }
}
.head-bar-container-shadow {
    box-shadow: 0 0 6px 0 rgba($color: #000000, $alpha: 0.06);
}
</style>
