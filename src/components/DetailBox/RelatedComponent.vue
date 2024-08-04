<template>
    <div class="idm-component-common-box related-component">
        <div class="related-component-header flex justify-between">
            <div class="header-title">
                相关组件<span>({{ propData.list.length }})</span>
            </div>
        </div>
        <div class="component-container">
            <div v-for="(item, index) in propData.list.slice(0, state.isMore ? propData.list.length : 5)" :key="index" @click="handleItemClick(item)" class="component-item">
                <img :src="getImagePath(item.coverPath) || defaultClassify" alt="图片加载失败" />
                <div class="component-item-left">
                    <div class="component-name">{{ item.comTitle }}</div>
                    <div class="component-class">
                        类名：<span>{{ item.comClassname }}</span>
                    </div>
                </div>
                <div class="component-item-right"><a @click.stop="handlePreview(item)">预览</a></div>
            </div>
        </div>
        <div v-if="list.length > 5 && !state.isMore" class="preview-more" @click="() => state.isMore = true">查看更多 ></div>
    </div>
</template>
<script setup lang="ts">
import { defaultClassify } from '@/assets/images'
import { getImagePath } from '@/utils'
import { baseURL } from '@/plugins/axios'
const router = useRouter()
const propData = defineProps({
    list: {
        type: Array<{ coverPath: string; comTitle: string; comClassname: string }>,
        default: () => [
            {
                aaa: '附件1',
                coverPath: 'https://www.baidu.com',
                comClassname: 'IStatisticsCard',
                comTitle: ''
            }
        ]
    }
})
const state = reactive({
    isMore: false
})
const handlePreview = (item: any) => {
    if (item.codePath) {
        const url = baseURL + item.codePath + '/index.html?className=' + item.comClassname
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

const handleItemClick = (item: any) => {
    const { href } = router.resolve({
        name: 'index-componentMarket-detail',
        query: {
            componentId: item.id
        }
    })
    window.open(href, '_blank')
}
</script>
<style lang="scss">
.related-component {
    margin-top: 16px;

    background: #fff;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.05);
    .related-component-header {
        padding: 10px 15px;
        font-size: 16px;

        .header-title span {
            margin-left: 6px;
            font-size: 14px;
        }
    }
    .component-container {
        padding: 14px;
        border-bottom: 1px solid #eee;
        border-top: 1px solid #eee;

        .component-item {
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 6px 0;
            &:hover {
                .component-item-right a {
                    display: block;
                }
            }

            img {
                width: 80px;
                height: 50px;
                margin-right: 10px;
            }
            .component-item-left {
                width: calc(100% - 130px);
            }
            .component-item-right {
                flex-shrink: 0;
                width: 30px;
                a {
                    display: none;
                }
            }
            .component-name {
                font-weight: 600;
                font-size: 14px;
                color: #666;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .component-class {
                font-size: 12px;
                color: #939393;
                span {
                    color: #1890ff;
                }
            }
        }
    }
    .preview-more {
        text-align: center;
        padding: 10px 0;
        color: #999;
        font-size: 12px;
    }
}
</style>
