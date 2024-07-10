<template>
    <a-card hoverable :bordered="false" class="school-box" @click="handleItemClick">
        <template #cover>
            <div class="school-box-top">
                <img alt="图片加载失败" class="school-box-top-image" :src="getImagePath(componentProps.coverUrl || componentMarketDetault)" />
                <div class="school-box-top-number">{{ !componentProps.type ? `${componentProps.readNumber || 0}人学习` : `${componentProps.collectNumber || 0}人收藏` }}</div>
                <div class="school-box-top-sort">{{ componentProps.type === 0 ? '视频' : componentProps.type === 1 ? '图文' : '电子书' }}</div>
                <div v-if="componentProps.type === 0" class="school-box-top-video-mask"><PlayCircleOutlined /></div>
            </div>
        </template>
        <div class="school-box-title">
            <span class="text-o-e-2">
                {{ componentProps.title }}
            </span>
            <i></i>
        </div>
        <div class="school-box-team">
            <svg-icon iconClass="renqun" class="school-box-icon"></svg-icon>{{ componentProps.publishRangeName || defaultSettings.yunitName }}
        </div>
        <div class="flex justify-between align-center school-box-bottom">
            <div class="flex align-center">
                <a-avatar :size="15" :src="getImagePath(componentProps.userPhoto)" />
                <span class="ml-6 nowrap">{{ componentProps.userNickname }}</span>
            </div>
            <span class="text-o-e school-box-count" style="width: auto">{{ componentProps.type==0?componentProps.vedioNumber+'节':componentProps.readNumber+'阅读' }}</span>
        </div>
    </a-card>
</template>
<script lang="ts" setup>
import { ISchoolData } from './mock/mockData'
import { getImagePath } from '@/utils'
import { componentMarketDetault } from '@/assets/images'
import { defaultSettings } from '@/settings/defaultSetting'
import { PlayCircleOutlined } from '@ant-design/icons-vue'
const router = useRouter()
const porps = defineProps({
    componentProps: {
        type: Object,
        default: () => ISchoolData
    }
})
const handleItemClick = () => {
    router.push({
        name: `index-iSchool-${porps.componentProps.type === 0 ? 'video' : porps.componentProps.type === 1 ? 'imageText' : 'eBook'}Detail`,
        query: {
            courseId: porps.componentProps.id
        }
    })
}
</script>

<style lang="scss" scoped>
.school-box {
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #eee;
    transition: all 0.3s;
    &:hover{
        box-shadow: 0 0 20px rgba($color: #C6C6C6, $alpha: 0.5);
        transform: translateY(-5px);
    }
    ::v-deep(.ant-card-body) {
        padding: 0;
    }

    .school-box-top {
        position: relative;
        overflow: hidden;
        height: 118px;

        .school-box-top-number {
            position: absolute;
            bottom: -2px;
            left: -2px;
            padding: 1px 7px;
            font-size: 12px;
            transform: scale(0.92);
            color: #fff;
            z-index: 1;
        }

        .school-box-top-sort {
            position: absolute;
            bottom: -2px;
            right: -2px;
            padding: 1px 7px;
            border-top-left-radius: 5px;
            font-size: 12px;
            background: rgb(232, 233, 240);
            transform: scale(0.92);
            z-index: 1;
        }

        .school-box-top-video-mask {
            display: none;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba($color: #000000, $alpha: .5);
            color: #fff;
            font-size: 40px;
            text-align: center;
            line-height: 110px;
        }
    }

    .school-box-top-image {
        width: 100%;
        height: 118px;
        object-fit: cover;
        border-radius: 0;
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
        min-height: 64px;
        color: #333;
        padding: 10px 10px;
        font-size: 14px;
        position: relative;
        &>i{
            position: absolute;
            left: 0;
            top: 10px;
            width: 3px;
            height: 18px;
            background-color: #1890FF;
        }
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
        .school-box-top-video-mask {
            display: block;
        }
    }
}
</style>
