<template>
    <!-- 组织页面列表 -->
    <div class="org-box idm-component-common-box cursor-pointer">
        <div class="flex">
            <AImage :preview="false" :width="70" :height="70" :src="getImagePath(componentProps.orgphoto)"></AImage>
            <div class="flex-1" style="margin: 0 0 0 20px">
                <div class="flex justify-between">
                    <div class="org-title">{{ componentProps.orgname }}</div>
                    <div>
                        <span class="person">{{ componentProps.userCount }} </span>人
                    </div>
                </div>
                <div>
                    <a-row>
                        <a-col class="flex align-center text-o-e org-image" :span="5">
                            <AImage style="margin: -4px 0 0 0" :width="16" :preview="false" :src="orgIcon"></AImage>
                            <span class="">{{ componentProps.companyName }}</span>
                        </a-col>
                        <a-col class="flex align-center" :span="10">
                            <AImage :width="16" :preview="false" :src="orgUser"></AImage>
                            <span class="text-o-e" style="margin: 0 0 0 5px">{{ componentProps.userInfoModels.map((el: any) => el.nickname).join(',') }}</span>
                        </a-col>
                    </a-row>
                </div>
            </div>
        </div>
        <div class="introduce">{{ componentProps.introduce }}</div>
        <div class="flex justify-between align-center introduce">
            <div class="flex">
                <div class="pr-10">
                    组件 <span class="instroduce-number">{{ componentProps.componentCount }}</span>
                </div>
                <div class="pr-10">教程 <span class="instroduce-number">0</span></div>
                <div class="pr-10">云圈 <span class="instroduce-number">0</span></div>
            </div>
            <div>
                <div v-if="componentProps.joinStatus != '1'" class="apply-btn flex align-center" @click="emits('handleApplyOrg', componentProps)">
                    <AImage :width="12" :preview="false" :src="orgApply"></AImage>
                    <a>申请加入</a>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { IOrgData } from './mock/mockData'
import { getImagePath } from '@/utils'
import { orgIcon, orgUser, orgApply } from '@/assets/images'
defineProps({
    componentProps: {
        type: Object,
        default: () => IOrgData
    }
})
const emits = defineEmits(['handleApplyOrg'])
</script>

<style lang="scss" scoped>
.org-box {
    padding: 15px;
    margin: 0 0 15px 0;
    .person {
        font-size: 18px;
    }
    .org-image {
        &::v-deep(.ant-image) {
            margin: 0 5px 0 0;
        }
    }
    .org-box-bottom {
        margin: 10px 0 0 0;
        font-size: 12px;
    }

    .org-box-index-page {
        transform: scale(0.9);
        color: #1890ff;
        padding: 0 5px;
        border-radius: 3px;
        border: 1px solid #1890ff;
    }
    .pr-10 {
        padding-right: 30px;
    }
    .introduce {
        font-size: 12px;
        color: #797979;
    }
    .instroduce-number {
        font-size: 18px;
        color: #333333;
    }
    .apply-btn {
        border-radius: 3px;
        border: 1px solid #40a9ff;
        padding: 0 5px 2px;
        a {
            color: #40a9ff;
            margin: 2px 0 0 4px;
        }
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
