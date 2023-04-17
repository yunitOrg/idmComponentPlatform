<template>
    <div class="idm-component-common-box version-list">
        <div class="version-list-title">
            版本 <span class="version-number">（{{ versionList.length || '0' }}）</span>
        </div>
        <div class="version-list-content">
            <div v-for="(item, index) in versionList" :key="index" class="version-box flex align-center" :class="[index + 1 > pageData.limit && 'dis-n']">
                <AImage :width="20" :preview="false" :src="versionImage"></AImage>
                <div class="flex-1" style="margin: 0 0 0 15px">
                    <div class="flex align-center">
                        <span class="version-text">v{{ item.version || item.codepackageVersion }}</span>
                        <span v-if="codePackageProp.currentVersion === item.version || codePackageProp.currentVersion === item.codepackageVersion" class="latest cursout-pointer">
                            Latest
                        </span>
                    </div>
                    <div class="time">{{ item.updateTime || item.createTime }}</div>
                </div>
                <a v-if="item.version !== currentLookVersion && item.codepackageVersion !== currentLookVersion" @click="handleLookVersion(item)">查看</a>
            </div>
            <div v-if="!pageData.isFirst && versionList.length === 0" class="empty-text text-center">暂无</div>
            <div v-if="versionList.length > pageData.limit" class="look-more text-center cursor-pointer" @click="handleLookMore">查看更多 <span>></span>></div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { versionImage } from '@/assets/images'
const route = useRoute()

const reload: any = inject('reload')
const propData = defineProps({
    type: {
        type: String,
        default: 'component'
    },
    codePackageProp: {
        type: Object,
        default: () => {}
    },
    versionList: {
        type: Array<any>,
        default: () => []
    }
})
const pageData = reactive({
    limit: 5,
    isFirst: true
})
const router = useRouter()
const currentLookVersion = computed(() => {
    if (route.query.version) return route.query.version
    return propData.codePackageProp.currentVersion
})
watch(
    () => propData.versionList,
    () => {
        pageData.isFirst = false
    }
)
const handleLookVersion = async (item: any) => {
    let paramsObj = {}
    if (propData.type === 'component') {
        paramsObj = {
            name: 'index-componentMarket-detail',
            query: {
                componentId: item.componentId,
                version: item.codepackageVersion
            }
        }
    } else if (propData.type === 'codePackage') {
        paramsObj = {
            name: 'index-componentPackage-detail',
            query: {
                codepackageId: propData.codePackageProp.id,
                version: item.version
            }
        }
    }
    await router.push(paramsObj)
    reload()
}
const handleLookMore = () => {
    pageData.limit = 99
}
</script>

<style lang="scss" scoped>
.version-list {
    margin: 16px 0 0 0;
    .version-list-title {
        padding: 10px 15px;
        border-bottom: 1px solid #f1f1f1;
        font-size: 16px;
    }
    .version-list-content {
        padding: 10px 15px;
    }
    .version-text {
        font-weight: 600;
        font-size: 12px;
        margin: 0 10px 0 0;
    }
    .version-box {
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
    .time {
        font-size: 12px;
        color: #939393;
    }
    .version-number {
        color: #666;
        font-size: 12px;
    }
    .look-more {
        border-top: 1px solid #eee;
        padding: 10px 0 0 0;
        color: #666;
        font-size: 12px;
    }
}
</style>
