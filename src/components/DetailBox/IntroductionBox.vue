<template>
    <div class="idm-component-common-box instroduction-box">
        <div class="instroduction-box-title">{{ title }}</div>
        <div class="instroduction-box-content">
            <div class="remark">{{ (type === 'codePackage' ? codePackageProp.currentRemark : componentProp.comRemark) || defaultSettings.introduction }}</div>
            <div v-if="type === 'component'" class="preview-component cursor-pointer" @click="handlePreviewComponent">预览组件</div>
            <div class="flex justify-between">
                <div class="download-box text-center cursor-pointer" :class="isDownloadDisabled(1) && 'disabled'" @click="handleDownLoad(1)">
                    <div>下载生产包</div>
                    <div class="package-size">
                        {{ propData.type === 'codePackage' ? transformSize(codePackageProp.currentRunSize) : transformSize(codePackageVersionInfoProp && codePackageVersionInfoProp.runSize) }}
                    </div>
                </div>
                <div class="download-box text-center cursor-pointer" :class="isDownloadDisabled(2) && 'disabled'" @click="handleDownLoad(2)">
                    <div>下载源码包</div>
                    <div class="package-size">
                        {{ propData.type === 'codePackage' ? transformSize(codePackageProp.currentZipSize) : transformSize(codePackageVersionInfoProp && codePackageVersionInfoProp.zipSize) }}
                    </div>
                </div>
            </div>
            <div v-if="codePackageProp.githubUrl" class="avatar-line"><AAvatar :size="20" :src="githubImage"></AAvatar>github:</div>
            <div class="repository-url cursor-pointer" @click="openUrl(codePackageProp.githubUrl)">{{ codePackageProp.githubUrl }}</div>
            <div v-if="codePackageProp.giteeUrl" class="avatar-line"><AAvatar :size="18" :src="giteeImage"></AAvatar>gitee:</div>
            <div class="repository-url cursor-pointer" @click="openUrl(codePackageProp.giteeUrl)">{{ codePackageProp.giteeUrl }}</div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { githubImage, giteeImage } from '@/assets/images'
import { defaultSettings } from '@/settings/defaultSetting'
import { transformSize } from '@/utils'
import { componentPublishApi, useHomePageApi } from '@/apis'
const propData = defineProps({
    title: {
        type: String,
        default: '组件包简介'
    },
    type: {
        type: String,
        default: 'codePackage'
    },
    codePackageVersionInfoProp: {
        type: Object,
        default: () => {}
    },
    codePackageVersionListProp: {
        type: Array,
        default: () => []
    },
    codePackageProp: {
        type: Object,
        default: () => {}
    },
    componentProp: {
        type: Object,
        default: () => {}
    }
})
const route = useRoute()
const currentLookVersion = computed(() => {
    if (route.query.version) return route.query.version
    return propData.codePackageProp.currentVersion
})
const handlePreviewComponent = () => {
    if (propData.codePackageVersionInfoProp?.codePath) {
        const url = propData.codePackageVersionInfoProp.codePath + '/index.html?className=' + propData.componentProp.comClassname
        useHomePageApi.handlePreviewComponent(url)
    }
}
const handleDownLoad = async (type: number) => {
    let url = null
    let currentVersionObj: any = null
    if (propData.type === 'codePackage') {
        currentVersionObj = propData?.codePackageVersionListProp?.find((el: any) => el.version === currentLookVersion.value)
    }

    switch (type) {
        case 1: // 生产
            if (propData.type === 'codePackage') url = currentVersionObj?.runPath
            else url = propData.codePackageVersionInfoProp?.runPath
            break
        case 2: // 源码
            if (propData.type === 'codePackage') url = currentVersionObj?.zipPath
            else url = propData.codePackageVersionInfoProp?.zipPath
            break
    }
    if (url) {
        componentPublishApi.downloadStaticFile(url)
    }
}
const isDownloadDisabled = (type: number) => {
    let currentVersionObj: any = null
    if (propData.type === 'codePackage') {
        currentVersionObj = propData?.codePackageVersionListProp?.find((el: any) => el.version === currentLookVersion.value)
    }
    if (type === 1) {
        if (propData.type === 'codePackage') {
            if (currentVersionObj?.runPath && 1) return false
        } else {
            if (propData.codePackageVersionInfoProp?.runPath && propData.codePackageVersionInfoProp?.runSize) return false
        }
        return true
    }
    if (type === 2) {
        if (propData.type === 'codePackage') {
            if (currentVersionObj?.zipPath && 1) return false
        } else {
            if (propData.codePackageVersionInfoProp?.zipPath && propData.codePackageVersionInfoProp?.zipSize) return false
        }
        return true
    }
}
const openUrl = (url: string) => {
    if (url.indexOf('http://') === -1 && url.indexOf('https://') === -1) {
        url = '//' + url
    }
    window.open(url, '_blank')
}
</script>

<style lang="scss" scoped>
.instroduction-box {
    margin: 16px 0 0 0;
    .instroduction-box-title {
        padding: 10px 15px;
        border-bottom: 1px solid #f1f1f1;
        font-size: 16px;
    }
    .instroduction-box-content {
        padding: 0 15px 10px;
    }
    .remark {
        font-size: 12px;
        color: #666666;
        margin: 20px 0;
    }
    .preview-component {
        color: #40a9ff;
        border-radius: 3px;
        border: 1px solid #40a9ff;
        text-align: center;
        padding: 7px 0;
        margin: 0 0 15px 0;
    }
    .download-box {
        width: 46%;
        border: 1px solid #ddd;
        padding: 2px 0;
        border-radius: 5px;
        &:hover {
            border-color: #40a9ff;
            color: #40a9ff;
        }
        &.disabled {
            color: #999;
            cursor: no-drop;
            &:hover {
                border-color: #ddd;
            }
        }
        .package-size {
            font-size: 12px;
            color: #999;
        }
    }
    .avatar-line {
        font-weight: 600;
        margin: 20px 0 15px;
        ::v-deep(.ant-avatar) {
            margin: 0 10px 0 0;
        }
    }
    .repository-url {
        color: #40a9ff;
    }
}
</style>
