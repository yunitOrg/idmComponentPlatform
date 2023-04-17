<template>
    <div class="idm-component-common-box title-info-box">
        <!-- 顶部基本信息 -->
        <div class="flex justify-between align-center">
            <div>
                <span class="doc-title">{{ docProp.title }}<img v-for="(item,index) in docProp.badge" :key="index" class="doc-badge" :src="getImagePath(item.icon) || defaultCourse" /></span>
            </div>
        </div>
        <!-- 简介 -->
        <div class="doc-sub-intr flex justify-between">
            <div>
                <span v-if="docProp.isOriginal" class="intr-original">原创</span>
                <span v-if="!docProp.isOriginal" class="intr-transport">转载</span>
                <span>{{ docProp.userNickname }}</span>
                <span>{{ docProp.createTime }}</span>
                <span>阅读 {{ docProp.readNumber }}</span>
                <span>评论 {{ docProp.commentNumber }}</span>
                <span>收藏 {{ docProp.collectNumber }}</span>
            </div>
            <div>
                <span class="intr-copyright">版权</span>
            </div>
        </div>
        <!-- 标签 -->
        <div class="flex align-center" style="margin: 20px 0 0 0">
            <span v-for="(item, index) in docProp.tags && docProp.tags.split(',')" :key="index" class="tag-box"> {{ item }}</span>
        </div>
        <!-- 收录信息 -->
        <div class="flex justify-between align-center classify-info">
            <div class="classify-info-left flex align-center">
                <img :src="getImagePath(docProp.classifyImg) || defaultClassify" alt="图片加载失败">
                <div>
                    <div>本文被收录于分类</div>
                    <div class="classify-info-title">{{ docProp.classify }}</div>
                </div>
            </div>
            <div class="classify-info-right">进入分类参与更多专题讨论<svg-icon iconClass="right-arrow"></svg-icon></div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { getImagePath } from '@/utils'
import { defaultClassify, defaultCourse } from '@/assets/images'
import { docTitleInfoOptions } from './mock/mockData'
defineProps({
    type: {
        type: String,
        default: 'imageText'
    },
    docProp: {
        type: Object,
        default: () => docTitleInfoOptions
    }
})
</script>

<style lang="scss" scoped>
.title-info-box {
    padding: 25px;
    .doc-title {
        font-weight: 600;
        color: #333333;
        font-size: 32px;
    }
    .doc-badge {
        width: 36px;
        height: 36px;
    }
    .doc-sub-intr {
        color: #999;
        &>div {
            span {
                margin-right: 15px;
                &:last-child {
                    margin-right: 0;
                }
            }
        }
        .intr-original,.intr-transport{
            color: #ffffff;
            border-radius: 5px;
            padding: 2px 8px;
            background: #40a9ff;
        }
        .intr-transport {
            background: rgb(247, 157, 52);
        }
        .intr-copyright {
            color: #40a9ff;
            cursor: pointer;
        }
    }
    .tag-box {
        margin-right: 10px;
        border: 1px solid #ddd;
        color: #40a9ff;
        border-radius: 3px;
        padding: 0 8px;
    }

    .classify-info {
        margin-top: 30px;
        padding: 6px;
        border-radius: 5px;
        background-color: rgb(246, 246, 246);
        color: #999;

        img {
            width: 60px;
            height: 60px;
            border-radius: 5px;
            margin-right: 4px;
        }

        .classify-info-title {
            color: #000;
            font-weight: 600;
            font-size: 16px;
        }

        .classify-info-right .svg-icon {
            margin: 0 6px;
        }
    }
}
</style>
