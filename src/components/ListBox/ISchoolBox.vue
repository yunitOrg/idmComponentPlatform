<template>
    <a-card hoverable :bordered="false" class="school-box">
        <template #cover>
            <div class="school-box-top">
                <img alt="图片加载失败" class="school-box-top-image" :src="componentProps.cover" />
                <div class="school-box-top-sort">视频</div>
            </div>
        </template>
        <div class="school-box-title">
            <span class="text-o-e-2">
                {{ componentProps.title }}
            </span>
        </div>
        <div class="school-box-team"><svg-icon icon-class="renqun" class-name="school-box-icon"></svg-icon>{{ componentProps.team }}</div>
        <div class="flex justify-between align-center school-box-bottom">
            <div class="flex align-center">
                <a-avatar :size="15" :src="componentProps.originAvatar" />
                <span class="ml-6 text-o-e">{{ componentProps.origin }}</span>
            </div>
            <span class="text-o-e school-box-count" style="width: auto">{{ componentProps.count }}</span>
        </div>
    </a-card>
</template>
<script lang="ts" setup>
import { ISchoolData } from './mock/mockData'
defineProps({
    componentProps: {
        type: Object,
        default: () => ISchoolData
    }
})
</script>

<style lang="scss" scoped>
.school-box {
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #f1f1f1;

    ::v-deep(.ant-card-body) {
        padding: 0;
    }

    .school-box-top {
        position: relative;
        overflow: hidden;

        .school-box-top-sort {
            position: absolute;
            bottom: -2px;
            right: -2px;
            padding: 1px 7px;
            border-top-left-radius: 5px;
            font-size: 12px;
            background: rgb(232, 233, 240);
            transform: scale(0.92);
        }
    }

    .school-box-top-image {
        width: 100%;
        border: 0;
    }

    .school-box-team {
        color: #999;
        font-size: 12px;
        padding: 0 4px;
        transform: scale(0.92);

        .school-box-icon {
            font: inherit;
            color: #999;
            margin: 0 5px 0 0;
            font-size: 12px;
        }
    }

    .school-box-title {
        color: #000;
        padding: 5px 10px;
        font-size: 12px;
    }

    .ml-6 {
        margin-left: 6px;
    }

    .school-box-bottom {
        font-size: 12px;
        margin-top: 5px;
        padding: 0 4px 10px;
        transform: scale(0.92);
    }

    .school-box-count {
        color: #999;
    }

    &:hover {
        .school-box-title {
            color: rgb(24, 144, 255);
        }
    }
}
</style>
