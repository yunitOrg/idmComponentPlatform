<template>
    <div class="idm-component-notice-box cursor-pointer" @click="propData.onPreviewComponentClick">
        <div class="flex justify-between align-center">
            <div class="flex align-center">
                <div class="package-name">{{ componentProps.title }}</div>
                <div class="package-class-name"><a-tag v-if="componentProps.levelType" :color="componentProps.levelType===2?'#f50':'red'" style="margin-left:10px;border-radius: 4px;">{{ componentProps.levelType===2?'紧急':'重要' }}</a-tag></div>
            </div>
            <div class="flex align-center">
                <span class="package-class-origin">{{ componentProps.userNickname }}</span>
                <a-avatar :size="15" :src="getImagePath(componentProps.userPhoto) || defaultSettings.userphoto" />
            </div>
        </div>
        <div class="package-class-describe text-o-e-2" v-html="replaceImgToText(componentProps.content)">
        </div>
        <div class="bottom-line">
            <a-row :gutter="[16, 0]">
                <a-col :span="12">
                    <div class="package-class-time text-o-e">{{ componentProps.updateTime || componentProps.createTime }}</div>
                </a-col>
                <a-col :span="12">
                    <div class="package-class-team text-o-e" :title="componentProps.publishRangeName || defaultSettings.yunitName">
                        <svg-icon iconClass="renqun" class="idm-component-package-icon"></svg-icon>{{ componentProps.publishRangeName || defaultSettings.yunitName }}
                    </div>
                </a-col>
            </a-row>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { IComponentPackageData } from './mock/mockData'
import { defaultSettings } from '@/settings/defaultSetting'
import { getImagePath } from '@/utils'
const router = useRouter()
const propData = defineProps({
    componentProps: {
        type: Object,
        default: () => IComponentPackageData
    },
    onPreviewComponentClick: {
        type: Function,
        default: undefined
    }
})
const handleItemClick = () => {
    router.push({
        name: 'index-componentPackage-detail',
        query: {
            codepackageId: propData.componentProps.id,
            version: propData.componentProps.currentVersion
        }
    })
}
const replaceImgToText = (str: string) => {
    // 创建正则表达式，匹配img标签的src属性等于url的情况
    const regex = /<img\s+[^>]*src="*"[^>]*>/g
    // 使用replace方法替换匹配到的img标签为【图片】
    const replacedString = str.replace(regex, '[图片]')
    return getPlainText(replacedString)
}
const getPlainText = (htmlContent: string) => {
    // 创建一个新的DOM解析器
    const parser = new DOMParser()
    // 使用解析器解析HTML内容，并获取文档对象
    const doc = parser.parseFromString(htmlContent, 'text/html')
    // 创建一个文本节点的范围
    const range = doc.createRange()
    // 选择文档中的所有节点
    range.selectNodeContents(doc.body)
    // 使用范围提取文本内容
    return range.toString()
}
</script>

<style lang="scss" scoped>
.idm-component-notice-box {
    border-radius: 5px;
    background: rgb(249, 250, 250);
    transition: all 0.2s;

    padding: 10px;

    .package-name,
    .package-class-name {
        color: #000;
        font-weight: 600;
        font-size: 16px;
    }

    .package-class-origin {
        color: #666;
        font-size: 12px;
        margin-right: 5px;
    }

    .package-class-describe {
        height: 38px;
        color: #555;
        font-size: 12px;
        margin: 10px 0;
    }

    .bottom-line {
        color: #999;
        font-size: 12px;
    }

    .package-class-language::before {
        display: inline-block;
        margin: 0 5px -2px 0;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: rgb(255, 221, 0);
        content: ' ';
    }
    &:hover{
        background-color: rgb(232, 243, 255);
    }
}

.idm-component-package-icon {
    color: #999;
    margin: 2px 2px 0 0;
}
</style>
