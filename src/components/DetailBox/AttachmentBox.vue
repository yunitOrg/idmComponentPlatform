<template>
    <div class="idm-component-common-box attachment-box">
        <div class="attachment-box-header flex justify-between">
            <div class="header-title">相关附件</div>
        </div>
        <div class="attachment-container">
            <div v-for="(item, index) in propData.list" :key="index" class="attachment-item">
                <div class="attachment-item-left">
                    <div class="attachment-name" :title="item.name">{{ item.name }}</div>
                    <div class="attachment-time">{{ getFileSize(item.size) }}</div>
                </div>
                <div class="attachment-item-right"><a href="" @click="handleDownload(item)">下载</a></div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { componentPublishApi } from '@/apis'
const propData = defineProps({
    list: {
        type: Array<{ name: string; size: number; downloadUrl: string }>,
        default: () => [
            {
                name: '附件1',
                downloadUrl: 'https://www.baidu.com',
                time: '2022-4-3 16:55:59'
            },
            {
                name: '附件2',
                downloadUrl: 'https://www.baidu.com',
                time: '2022-4-3 16:55:59'
            }
        ]
    }
})

const handleDownload = (item: any) => {
    componentPublishApi.downloadStaticFile(item.url)
}
const getFileSize = (size: number) => {
    if (!size || isNaN(Number(size))) {
        return '-'
    }
    let index = 0
    let k = size
    const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB', 'BB']
    if (size >= 1024) {
        while (k > 1024) {
            k = k / 1024
            index++
        }
    }
    return `${(k).toFixed(2)}${units[index]}`
}
</script>
<style lang="scss">
.attachment-box {
    margin-top: 16px;

    .attachment-box-header {
        padding: 10px 15px;
        font-size: 16px;
        border-bottom: 1px solid #eee;
    }

    .attachment-container {
        padding: 14px;

        .attachment-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 6px 0;

            &:hover {
                .attachment-item-right a {
                    display: block;
                }
            }

            .attachment-item-left {
                width: calc(100% - 40px);
            }

            .attachment-item-right {
                flex-shrink: 0;
                width: 30px;

                a {
                    display: none;
                }
            }

            .attachment-name {
                font-weight: 600;
                font-size: 14px;
                color: #666;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .attachment-time {
                font-size: 12px;
                color: #939393;
            }
        }
    }
}
</style>
