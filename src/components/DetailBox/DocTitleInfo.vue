<template>
    <div class="idm-component-common-box title-info-box">
        <!-- 顶部基本信息 -->
        <div class="flex justify-between align-center">
            <div>
                <span class="doc-title">
                    <span>{{ docProp.title }}</span>
                    <span class="school-box-team">
                        <svg-icon iconClass="renqun" class="school-box-icon"></svg-icon>{{ docProp.publishRangeName || defaultSettings.yunitName }}
                    </span>
                </span>
            </div>
        </div>
        <!-- 简介 -->
        <div class="doc-sub-intr flex justify-between">
            <div>
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
    </div>
</template>

<script lang="ts" setup>
import { docTitleInfoOptions } from './mock/mockData'
import { defaultSettings } from '@/settings/defaultSetting'
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
        .school-box-team {
            color: #1890ff;
            font-size: 16px;
            padding: 0 10px;

            .school-box-icon {
                font: inherit;
                color: #1890ff;
                margin: 0 5px 0 0;
                font-size: 16px;
            }
        }
    }
    .doc-sub-intr {
        color: #999;
        & > div {
            span {
                margin-right: 15px;
                &:last-child {
                    margin-right: 0;
                }
            }
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
}
</style>
