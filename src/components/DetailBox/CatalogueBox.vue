<template>
    <div class="idm-component-common-box recommend-box">
        <div class="recommend-box-header flex justify-between">
            <div class="header-title">目录</div>
        </div>
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
    </div>
</template>
<script setup lang="ts">
const propData = defineProps({
    docContentRef: {
        type: Object,
        default: () => {}
    }
})

const pageData = reactive<{ titles: Array<any> }>({
    titles: []
})

watch(
    () => propData.docContentRef,
    (newV) => {
        if (newV && newV.$el) {
            handleGetTitle()
        }
    }
)

const handleGetTitle = () => {
    nextTick(() => {
        const anchors = propData.docContentRef.$el?.querySelectorAll('h1,h2,h3,h4,h5,h6')
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
    const heading = propData.docContentRef?.$el.querySelector(`[data-v-md-line="${lineIndex}"]`)
    if (heading) {
        propData.docContentRef?.scrollToTarget({
            target: heading,
            scrollContainer: window,
            top: 60
        })
    }
}
</script>
<style lang="scss">
.anchor-container {
        max-height: 500px;
        overflow: auto;
    }
    .ant-popover-inner-content {
        padding: {
            left: 0;
            right: 0;
        }
    }
    .anchor-line {
        margin: 0 0 10px 0;
        font-size: 14px;
        transition: all 0;
        color: #333333;
        &:hover {
            background-color: rgb(245, 245, 250);
            color: rgb(252, 85, 59);
        }
    }
</style>
