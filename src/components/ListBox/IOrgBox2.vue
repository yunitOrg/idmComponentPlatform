<template>
    <!-- 组织页面列表 -->
    <div class="org-box idm-component-common-box cursor-pointer" :class="{'style-type-1': styleType === '1', 'style-type-2': styleType === '2'}">
        <div class="flex">
            <AImage :preview="false" :width="70" :height="70" :src="getImagePath(componentProps.orgphoto)"></AImage>
            <div class="flex-1" style="margin: 0 0 0 25px">
                <div class="flex justify-between">
                    <div class="org-title">{{ componentProps.orgname }}</div>
                    <div>
                        <span class="person">{{ componentProps.userCount }} </span>人
                    </div>
                </div>
                <div style="margin: 15px 0 0 0">
                    <a-row>
                        <a-col class="flex align-center text-o-e org-image" :span="5">
                            <AImage style="margin: -4px 0 0 0" :width="20" :preview="false" :src="orgIcon"></AImage>
                            <span class="">{{ componentProps.companyName }}</span>
                        </a-col>
                        <a-col class="flex align-center" :span="10">
                            <AImage :width="20" :preview="false" :src="orgUser"></AImage>
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
            <div class="flex">
                <!-- <div v-if="showHome" class="apply-btn flex align-center" @click="emits('handleOrgHome', componentProps)">
                    <AImage :width="14" :preview="false" :src="orgHome"></AImage>
                    <a>主页</a>
                </div> -->
                <div v-if="showJoin && componentProps.joinStatus != '1'" class="apply-btn flex align-center" @click="emits('handleApplyOrg', componentProps)">
                    <AImage :width="14" :preview="false" :src="orgApply"></AImage>
                    <a>申请加入</a>
                </div>
                <div v-if="showManage && isAdmin" class="apply-btn flex align-center" @click="emits('handleOrgManage', componentProps)">
                    <AImage :width="14" :preview="false" :src="orgManage"></AImage>
                    <a>组织管理</a>
                </div>
                <div v-if="showManage" class="apply-btn flex align-center" @click="emits('handleMemberManage', componentProps)">
                    <template v-if="isAdmin">
                        <AImage :width="14" :preview="false" :src="orgMember"></AImage>
                        <a>成员管理</a>
                    </template>
                    <template v-else>
                        <!-- todo -->
                        <!-- <AImage :width="14" :preview="false" :src="orgMember"></AImage> -->
                        <a>成员列表</a>
                    </template>
                </div>
                <div v-if="showInvite && allowInvite" class="apply-btn flex align-center" @click="emits('handleOrgInvite', componentProps)">
                    <AImage :width="14" :preview="false" :src="orgInvite"></AImage>
                    <a>邀请加入</a>
                </div>
                <slot name="footer"></slot>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { IOrgData } from './mock/mockData'
import { useUserStore } from '@/store/modules/user'
import { getImagePath } from '@/utils'
import { orgIcon, orgUser, orgApply, orgManage, orgMember, orgInvite } from '@/assets/images'
const userStore = useUserStore()
const props = defineProps({
    componentProps: {
        type: Object,
        default: () => IOrgData
    },
    styleType: {
        type: String,
        default: '1'
    },
    showHome: {
        type: Boolean,
        default: true
    },
    showJoin: {
        type: Boolean,
        default: true
    },
    showManage: {
        type: Boolean,
        default: false
    },
    showInvite: {
        type: Boolean,
        default: false
    }
})
const isAdmin = computed(() => props.componentProps.userInfoModels?.find((item: any) => item.id === userStore.userInfo?.id))
const allowInvite = computed(() => {
    let result = false
    switch (props.componentProps.roleInvitation) {
        case 0:
            result = true
            break
        case 1:
            result = !!isAdmin
            break
        case 2:
            result = isAdmin.value && isAdmin.value.userType === 1
            break
    }
    return result
})
const emits = defineEmits(['handleApplyOrg', 'handleOrgHome', 'handleOrgManage', 'handleMemberManage', 'handleOrgInvite'])
</script>

<style lang="scss" scoped>
.style-type-1 {
    padding: 15px 20px;
    margin-bottom: 15px;
}
.style-type-2 {
    margin: 0 20px;
    padding: 15px 5px;
    border-bottom: 1px solid rgb(230, 230, 230);
}
.org-box {
    .org-title {
        font-size: 18px;
    }
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
        width: 100px;
        // padding-right: 20px;
    }
    .introduce {
        margin-top: 10px;
        font-size: 14px;
        color: #797979;
    }
    .instroduce-number {
        margin-left: 5px;
        font-size: 18px;
        color: #333333;
    }
    .apply-btn {
        border-radius: 5px;
        border: 1px solid #40a9ff;
        padding: 0 10px 2px 10px;
        a {
            color: #40a9ff;
            margin: 2px 0 0 4px;
        }
        &:not(:last-child) {
            margin-right: 10px;
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
