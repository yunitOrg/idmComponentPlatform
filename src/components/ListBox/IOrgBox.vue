<template>
    <!-- 组织滑动列表 -->
    <div class="flex org-box cursor-pointer">
        <AImage :preview="false" :width="60" :height="60" :src=" componentProps.id === '' ? componentProps.orgphoto : getImagePath(componentProps.orgphoto)"></AImage>
        <div style="margin: 0 0 0 15px" class="flex flex-direction-column justify-between flex-1">
            <div class="text-o-e-1 org-title">{{ componentProps.orgname }}</div>
            <div class="flex justify-between org-box-bottom align-center">
                <div>
                    <span class="person">{{ componentProps.userCount }}</span> <span class="person-text">人</span>
                </div>
                <!-- <div class="org-box-index-page flex align-center">
                    <svg-icon iconClass="indexPage" style="margin: 0 1px 1px 0"></svg-icon> <span>主页</span>
                </div> -->
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { IOrgData } from './mock/mockData'
import { getImagePath } from '@/utils'
defineProps({
    componentProps: {
        type: Object,
        default: () => IOrgData
    }
})
</script>

<style lang="scss" scoped>
.org-box {
    width: 254px;
    margin: 5px 15px 5px 5px;
    border-radius: 3px;
    padding: 13px 10px;
    box-shadow: 0 0 7px #ddd;
    .org-title {
        font-size: 16px;
    }
    .org-box-bottom {
        margin: 25px 0 0 0;
        font-size: 12px;
    }

    .person {
        color: #1890ff;
    }

    .org-box-index-page {
        transform: scale(0.9);
        color: #1890ff;
        padding: 0 5px;
        border-radius: 3px;
        border: 1px solid #1890ff;
    }
}
</style>

<style lang="scss">
.idm-header-org-active.org-box {
    background-image: linear-gradient(to right, rgb(115, 188, 255), rgb(3, 134, 255));
    color: #fff;

    .person,
    .org-box-index-page {
        color: #fff;
    }
    .person-text {
        color: rgba($color: #fff, $alpha: 0.7);
    }
}
</style>
