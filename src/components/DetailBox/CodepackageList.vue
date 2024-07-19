<template>
    <div class="idm-component-common-box packagelist-list">
        <div class="component-list-title">
            {{ title }} <span class="component-number">（{{ codepackageList.length }}）</span>
        </div>
        <div class="component-list-content common-scrollbar_style">
            <div v-for="(item, index) in codepackageList" :key="index" class="component-box flex align-center" :class="[index + 1 > pageData.limit && 'dis-n']">
                <div class="flex-1 cursor-pointer" @click="handleClickItem(item,item.version)">
                    <div class="component-text">{{ item.id?item.title+' / ':'' }}{{ item.className }} @ {{ item.version }}</div>
                    <div class="component-class">
                        {{ item.remark }}
                    </div>
                </div>
                <a v-if="item.id" @click="handleClickItem(item,item.currentVersion)">最新版本：{{ item.currentVersion }}</a>
                <span v-else class="no-register-text">未注册</span>
            </div>
            <div v-if="!pageData.isFirst && codepackageList.length === 0" class="empty-text text-center">暂无</div>
            <div v-if="codepackageList.length > pageData.limit" class="look-more text-center cursor-pointer" @click="handleLookMore">查看更多 <span>></span></div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { baseURL } from '@/plugins/axios'
import { componentMarketDetault } from '@/assets/images'
import { getImagePath } from '@/utils'
const router = useRouter()
const propData = defineProps({
    type: {
        type: String,
        default: 'component'
    },
    title: {
        type: String,
        default: '组件包的组件'
    },
    codepackageList: {
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
        const url = baseURL + propData.codePackageProp.currentCodePath + '/index.html?className=' + item.comClassname
        const { href } = router.resolve({
            name: 'previewComponent',
            query: {
                previewSrc: url,
                componentName: item.comTitle,
                adaptiveType: item.adaptiveType
            }
        })
        window.open(href, '_blank')
    }
}
const handleLookMore = () => {
    pageData.limit = 99
}
watch(
    () => propData.codepackageList,
    () => {
        pageData.isFirst = false
    }
)
const handleClickItem = (item: any, version: any) => {
    if (item.id) {
        const { href } = router.resolve({
            name: 'index-componentPackage-detail',
            query: {
                codepackageId: item.id,
                version: version || item.codepackageVersion || item.packageVersion
            }
        })
        window.open(href, '_blank')
    }
}
</script>

<style lang="scss" scoped>
.packagelist-list {
    margin: 16px 0 0 0;
    background: #fff;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.05);
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
    .no-register-text{
        color: #FF8C1C;
        font-size: 12px;
    }
    .component-text {
        font-weight: 600;
        margin: 0 10px 0 0;
    }
    .component-box {
        margin: 0 0 15px 0;
        background-color: #F7F7F7;
        border-radius: 5px;
        padding: 10px;
        gap:10px;
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
        margin-top: 5px;
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
