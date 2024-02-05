<template>
    <div class="idm-component-common-box attachment-box">
        <div class="attachment-box-header flex justify-between">
            <div class="header-title">相关附件</div>
        </div>
        <div class="attachment-container">
            <div v-for="(item, index) in list" :key="index" class="attachment-item">
                <div class="attachment-item-left">
                    <div class="attachment-name">{{ item.name }}</div>
                    <div class="attachment-time">{{ item.time }}</div>
                </div>
                <div class="attachment-item-right"><a :href="item.downloadUrl">下载</a></div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
const list = ref([
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
])
// const propData = defineProps({
//     userInfoProp: {
//         type: Object,
//         default: () => {}
//     }
// })
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
        .attachment-item-left {
          width: calc(100% - 40px);
        }
        .attachment-item-right {
          flex-shrink: 0;
          width: 30px;
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
