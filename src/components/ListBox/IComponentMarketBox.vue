<template>
    <a-card :bordered="false" class="idm-component-market-box" @click="handleItemClick">
        <template #cover>
            <div class="idm-component-market-top">
                <div class="idm-component-market-top-preview cursor-pointer" @click.stop="handlePreview">预览</div>
                <img object-fit alt="图片加载失败" class="idm-component-market-top-image" :src="getImagePath(componentProps.coverPath) || IComponentMarketData.componentCover" />
                <div class="idm-component-market-top-package">组件包：{{ componentProps.codepackageClassname }}</div>
            </div>
        </template>
        <div class="flex justify-between align-center p-6">
            <div class="component-market-name">
                {{ componentProps.comTitle }}
            </div>
            <div class="text-blue">{{ componentProps.codepackageVersion }}</div>
        </div>
        <div class="component-market-class-name">
            类名：<span class="text-blue">{{ componentProps.comClassname }}</span>
        </div>
        <div class="flex justify-between align-center component-market-bottom">
            <div class="flex align-center">
                <a-avatar :size="15" :src="getImagePath(componentProps.userPhoto)" />
                <span class="ml-6 nowrap">{{ componentProps.userNickname }}</span>
            </div>
            <div class="text-o-e text-right" style="margin: 0 0 0 10px">
                {{ componentProps.updateTime || componentProps.createTime }}
            </div>
        </div>
    </a-card>
</template>
<script lang="ts" setup>
import { IComponentMarketData } from './mock/mockData'
import { useHomePageApi } from '@/apis'
import { getImagePath } from '@/utils'
const router = useRouter()
const propData = defineProps({
    componentProps: {
        type: Object,
        default: () => IComponentMarketData
    }
})

const handlePreview = () => {
    if (propData.componentProps.codePath) {
        const url = propData.componentProps.codePath + '/index.html?className=' + propData.componentProps.comClassname
        useHomePageApi.handlePreviewComponent(url)
    }
}
const handleItemClick = () => {
    router.push({
        name: 'index-componentMarket-detail',
        query: {
            componentId: propData.componentProps.id,
            version: propData.componentProps.codepackageVersion
        }
    })
}
</script>

<style lang="scss" scoped>
.idm-component-market-box {
    border-radius: 5px;
    overflow: hidden;
    background: rgb(245, 250, 255);
    padding: 10px;
    ::v-deep(.ant-card-body) {
        padding: 0;
    }
    .idm-component-market-top {
        position: relative;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        overflow: hidden;
    }
    .idm-component-market-top-preview {
        position: absolute;
        top: 6px;
        right: 6px;
        border-radius: 10px;
        background: rgba($color: #000000, $alpha: 0.3);
        color: #fff;
        font-size: 12px;
        padding: 2px 10px;
        display: none;
    }
    .idm-component-market-top-package {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        color: #fff;
        font-size: 12px;
        height: 0;
        padding: 0;
        line-height: 25px;
        box-sizing: border-box;
        transition: height 0.2s;
        // background: linear-gradient(180deg,
        //         rgba(255, 255, 255, 0.4),
        //         rgba(150, 150, 150, 0.3));
        background: rgba($color: #000000, $alpha: 0.3);
    }
    .idm-component-market-top-image {
        width: 100%;
        height: 118px;
        object-fit: cover;
        border-radius: 0;
    }
    &:hover {
        .idm-component-market-top-preview {
            display: block;
        }
        .idm-component-market-top-package {
            height: 25px;
            padding: 2px 5px;
        }
    }
    .p-6 {
        padding: 6px 0;
    }
    .ml-6 {
        margin-left: 6px;
    }
    .nowrap{
        white-space: nowrap;
    }
    .text-blue {
        color: rgb(33, 124, 255);
    }
    .component-market-name {
        color: #000;
    }
    .component-market-class-name {
        font-size: 12px;
    }
    .component-market-bottom {
        font-size: 12px;
        margin-top: 5px;
    }
}
</style>
