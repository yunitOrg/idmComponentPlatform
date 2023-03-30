<template>
    <div v-if="comPreviewImgJson && comPreviewImgJson.length > 0" class="idm-component-common-box image-preview-box">
        <IScrollContainer :id="'scroll_' + Date.now()" :moveWidth="1075" :limitLength="3" :listLength="comPreviewImgJson.length">
            <a-image-preview-group>
                <a-image v-for="item in comPreviewImgJson" :key="item.url" class="preview-image" :width="220" :height="120" :src="item.url" style="object-fit: cover"></a-image>
            </a-image-preview-group>
        </IScrollContainer>
    </div>
</template>
<script lang="ts" setup>
defineProps({
    comPreviewImgJson: {
        type: Array<any>,
        default: () => []
    }
})
</script>
<style lang="scss" scoped>
.image-preview-box {
    margin: 20px 0 0 0;
    padding: 0 20px;
    height: 160px;
    ::v-deep(.switch-tab) {
        position: relative;
    }
    ::v-deep(.switch-tab-left) {
        position: absolute;
        left: 0;
        z-index: 1;
    }
    ::v-deep(.switch-tab-right) {
        position: absolute;
        right: 0;
        z-index: 1;
    }
    ::v-deep(.switch-tab-wrap) {
        width: 100%;
    }
    ::v-deep(.ant-image-img) {
        height: 100%;
    }
    ::v-deep(.ant-image) {
        margin: 0 20px 0 0;
    }
    ::v-deep(.ant-image:last-child) {
        margin: 0;
    }
    ::v-deep(.ant-image-mask) {
        background-color: rgba(0, 0, 0, 0.2);
    }
}
</style>
