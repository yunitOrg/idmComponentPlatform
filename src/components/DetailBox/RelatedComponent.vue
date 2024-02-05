<template>
    <div class="idm-component-common-box related-component">
        <div class="related-component-header flex justify-between">
            <div class="header-title">
                相关组件<span>({{ list.length }})</span>
            </div>
        </div>
        <div class="component-container">
            <div v-for="(item, index) in list.slice(0, 5)" :key="index" class="component-item">
                <img :src="getImagePath(item.imgUrl) || defaultClassify" alt="图片加载失败" />
                <div class="component-item-left">
                    <div class="component-name">{{ item.name }}</div>
                    <div class="component-class">
                        类名：<span>{{ item.cls }}</span>
                    </div>
                </div>
                <div class="component-item-right"><a :href="item.previewUrl">预览</a></div>
            </div>
        </div>
        <div v-if="list.length > 5" class="preview-more">查看更多 ></div>
    </div>
</template>
<script setup lang="ts">
import { defaultClassify } from '@/assets/images'
import { getImagePath } from '@/utils'
import { ref } from 'vue'
const list = ref([
    {
        name: '附件1',
        previewUrl: 'https://www.baidu.com',
        cls: 'IStatisticsCard',
        imgUrl: ''
    },
    {
        name: '附件2',
        previewUrl: 'https://www.baidu.com',
        cls: 'IStatisticsCard',
        imgUrl: ''
    },
    {
        name: '附件1',
        previewUrl: 'https://www.baidu.com',
        cls: 'IStatisticsCard',
        imgUrl: ''
    },
    {
        name: '附件2',
        previewUrl: 'https://www.baidu.com',
        cls: 'IStatisticsCard',
        imgUrl: ''
    },
    {
        name: '附件1',
        previewUrl: 'https://www.baidu.com',
        cls: 'IStatisticsCard',
        imgUrl: ''
    },
    {
        name: '附件2',
        previewUrl: 'https://www.baidu.com',
        cls: 'IStatisticsCard',
        imgUrl: ''
    }
])
// const propData = defineProps({
//     userInfoProp: {
//         type: Object,
//         default: () => {}
//     }
// })
</script>
<style lang="scss">
.related-component {
    margin-top: 16px;

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

        .component-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 6px 0;

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
      padding: 14px 0;
      color: #999;
    }
}
</style>
