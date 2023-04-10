<template>
    <div class="md-content-container idm-component-common-box">
        <div class="md-content-container-title cursor-pointer flex align-center">
            <a-popover placement="bottomLeft" overlayClassName="md-tip-pop">
                <template #title>
                    <div style="margin: 10px 0; font-size: 16px; font-weight: 600">目录</div>
                </template>
                <template #content>
                    <div class="anchor-container common-scrollbar_style">
                        <div
                            v-for="(anchor, index) in pageData.titles"
                            :key="index"
                            class="anchor-line cursor-pointer"
                            :style="{ paddingLeft: `${anchor.indent * 20 + 16}px`, paddingRight: '16px' }"
                            @click="handleAnchorClick(anchor)">
                            {{ anchor.title }}
                        </div>
                    </div>
                </template>
                <svg-icon iconClass="menu" class="md-menu-icon"></svg-icon> <span class="title-text">{{ title }}</span>
            </a-popover>
        </div>

        <v-md-preview ref="preview" :text="pageData.content"></v-md-preview>
    </div>
</template>

<script lang="ts" setup>
import { componentPublishApi } from '@/apis'
const propData = defineProps({
    title: {
        type: String,
        default: '组件包文档'
    },
    contentUrl: {
        type: String,
        default: ''
    },
    codePackageProp: {
        type: Object,
        default: () => {}
    }
})
const preview = ref()
const pageData = reactive<{ content: string; titles: Array<any> }>({
    content: '',
    titles: []
})
watch(
    () => propData.contentUrl,
    (newV) => {
        if (newV) {
            handleRequestContent()
        }
    }
)
const replaceUrl = (str: string): string => {
    const reg = /\!\[.*\]\(.*\)/gi
    str = str.replace(reg, (str: string) => {
        str = str.replace(/\(.*\)/gi, (str1: string) => {
            let url = str1.replace('(', '').replace(')', '')
            const prefix = componentPublishApi.componentStaticUrl + propData.codePackageProp.currentCodePath
            if (url.startsWith('./idm_modules')) {
                url = '(' + prefix + url.replace('./idm_modules', '') + ')'
            }
            return url
        })
        return str
    })
    return str
}
const handleRequestContent = async () => {
    try {
        const res = await componentPublishApi.requestComponentStatic(propData.contentUrl)
        if (typeof res === 'string') {
            pageData.content = replaceUrl(res)
            handleGetTitle()
        }
    } catch (error) {}
}
const handleGetTitle = () => {
    nextTick(() => {
        const anchors = preview.value?.$el?.querySelectorAll('h1,h2,h3,h4,h5,h6')
        const titles = Array.from(anchors).filter((title: any) => !!title.innerText.trim())
        if (!titles.length) {
            pageData.titles = []
            return
        }
        const hTags = Array.from(new Set(titles.map((title: any) => title.tagName))).sort()
        pageData.titles = titles.map((el: any) => ({
            title: el.innerText,
            lineIndex: el.getAttribute('data-v-md-line'),
            indent: hTags.indexOf(el.tagName)
        }))
    })
}
const handleAnchorClick = (anchor: any) => {
    const { lineIndex } = anchor
    const heading = preview.value?.$el.querySelector(`[data-v-md-line="${lineIndex}"]`)
    if (heading) {
        preview.value?.scrollToTarget({
            target: heading,
            scrollContainer: window,
            top: 60
        })
    }
}
</script>

<style lang="scss" scoped>
.md-content-container {
    margin: 16px 0 0 0;
    .anchor-container {
        max-height: 500px;
        overflow: auto;
    }
    .md-content-container-title {
        font-size: 16px;
        color: #666666;
        padding: 15px 20px;
        border-bottom: 1px solid #eee;
        background-color: #fefefe;
        position: sticky;
        top: 0px;
        z-index: 100;
        .title-text {
            margin: 0 10px;
            font-weight: 600;
        }
    }
    .md-menu-icon {
        font-size: 24px;
        margin: 0 0 -2px 0;
    }
}
</style>

<style lang="scss">
.md-tip-pop {
    min-width: 300px;
    .ant-popover-inner-content {
        padding: {
            left: 0;
            right: 0;
        }
    }
    .anchor-line {
        margin: 0 0 10px 0;
        font-size: 16px;
        transition: all 0;
        color: #333333;
        &:hover {
            background-color: rgb(245, 245, 250);
            color: rgb(252, 85, 59);
        }
    }
}
</style>
