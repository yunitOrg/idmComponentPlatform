<template>
    <div class="idm-component-common-box component-list">
        <div class="component-list-title">
            {{ title }} <span class="component-number">（{{ componentList.length }}）</span>
        </div>
        <div class="component-list-content common-scrollbar_style">
            <div v-for="(item, index) in componentList" :key="index" class="component-box flex align-center" :class="[index + 1 > pageData.limit && 'dis-n']">
                <AImage :preview="false" :width="80" :height="50" :src="getImagePath(item.coverPath) || componentMarketDetault"></AImage>
                <div class="flex-1 cursor-pointer" style="margin: 0 0 0 15px" @click="handleClickItem(item)">
                    <div class="component-text">{{ item.comTitle }}</div>
                    <div class="component-class">
                        类名: <span> {{ item.comClassname }}</span>
                    </div>
                </div>
                <a @click="handlePreview(item)">预览</a>
            </div>
            <div v-if="!pageData.isFirst && componentList.length === 0" class="empty-text text-center">暂无</div>
            <div v-if="componentList.length > pageData.limit" class="look-more text-center cursor-pointer" @click="handleLookMore">查看更多 <span>></span></div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useHomePageApi } from '@/apis'
import { componentMarketDetault } from '@/assets/images'
import { getImagePath } from '@/utils'
const router = useRouter()
const propData = defineProps({
    title: {
        type: String,
        default: '组件包的组件'
    },
    componentList: {
        type: Array<any>,
        default: () => []
    },
    codePackageProp: {
        type: Object,
        default: () => {}
    }
})
const pageData = reactive({
    limit: 5,
    isFirst: true
})
const handlePreview = (item: any) => {
    if (item.currentCodePath || propData.codePackageProp.currentCodePath) {
        const url = propData.codePackageProp.currentCodePath + '/index.html?className=' + item.comClassname
        useHomePageApi.handlePreviewComponent(url)
    }
}
const handleLookMore = () => {
    pageData.limit = 99
}
watch(
    () => propData.componentList,
    () => {
        pageData.isFirst = false
    }
)
const handleClickItem = (item: any) => {
    const { href } = router.resolve({
        name: 'index-componentMarket-detail',
        query: {
            componentId: item.id,
            version: item.codepackageVersion
        }
    })
    window.open(href, '_blank')
}
</script>

<style lang="scss" scoped>
.component-list {
    margin: 16px 0 0 0;
    .component-list-title {
        padding: 10px 15px;
        border-bottom: 1px solid #f1f1f1;
        font-size: 16px;
    }
    .component-list-content {
        padding: 10px 15px;
        max-height: 520px;
        overflow-y: auto;
    }
    .component-text {
        font-weight: 600;
        margin: 0 10px 0 0;
    }
    .component-box {
        margin: 0 0 15px 0;
    }
    .latest {
        border: 1px solid #40a9ff;
        color: #40a9ff;
        border-radius: 20px;
        font-size: 12px;
        padding: 0 5px;
        transform: scale(0.9);
    }
    .component-class {
        font-size: 12px;
        color: #939393;
        span {
            color: #1890ff;
        }
    }
    .component-number {
        color: #666;
        font-size: 12px;
    }
    .look-more {
        border-top: 1px solid #eee;
        padding: 10px 0 0 0;
        color: #666;
        font-size: 12px;
    }
    .empty-text {
        color: #666;
        padding: 10px 0;
    }
}
</style>
