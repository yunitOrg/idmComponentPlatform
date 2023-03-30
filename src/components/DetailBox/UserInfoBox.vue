<template>
    <div class="idm-component-common-box user-info-box">
        <div class="flex justify-between align-center">
            <div class="flex flex-1">
                <a-avatar :size="48" :src="getImagePath(userInfoProp.userphoto) || defaultSettings.userphoto"></a-avatar>
                <div style="margin: 0 0 0 10px" class="flex-1">
                    <div class="text-o-e-1">{{ userInfoProp.nickname || 'yunit' }}</div>
                    <div class="text-o-e-1" style="color: #999;">{{ userInfoProp.saying || '这家伙很懒什么也没留下' }}</div>
                </div>
            </div>
            <div :class="['guanzhu-btn', 'cursor-pointer']" @click="handleFlow">
                {{ userInfoProp.focusThis == 1 ? '已关注' : '关注' }}
            </div>
        </div>
        <div class="flex justify-around align-center" style="margin: 15px 0 0 0">
            <div><span class="color-999 mr-5">组件包</span> {{ userInfoProp.codepackageTotal || userInfoProp.componentTotal || '0' }}</div>
            <div class="line"></div>
            <div><span class="color-999 mr-5">获赞总数</span> {{ userInfoProp.likeTotal || '0' }}</div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { defaultSettings } from '@/settings/defaultSetting'
import { useUserApi } from '@/apis'
import { useUserStore } from '@/store/modules/user'
import { getImagePath } from '@/utils'
const userStore = useUserStore()

const propData = defineProps({
    userInfoProp: {
        type: Object,
        default: () => {}
    }
})
const emits = defineEmits(['onDoFollow'])
const handleFlow = () => {
    if (!userStore.isUserLogined) {
        return userStore.setLoginModal(true)
    }
    if (propData.userInfoProp.focusThis === undefined) return
    useUserApi[propData.userInfoProp.focusThis !== 1 ? 'requestFollowUser' : 'requestUnFollowUser']({
        userId: propData.userInfoProp.id
    }).then((res) => {
        if (res.success) emits('onDoFollow')
    })
}
</script>

<style lang="scss" scoped>
.user-info-box {
    padding: 15px;
    .guanzhu-btn {
        height: 25px;
        line-height: 25px;
        padding: 0 20px;
        color: #fff;
        font-size: 12px;
        border-radius: 50px;
        background-image: linear-gradient(to right, rgb(115, 188, 255), rgb(3, 134, 255));
    }
    .line {
        border-left: 1px solid #ccc;
        height: 20px;
        width: 1px;
    }
    .color-999 {
        color: #999;
    }
    .mr-5 {
        margin-right: 5px;
    }
}
</style>
