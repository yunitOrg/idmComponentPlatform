<template>
    <div class="userinfo-container">
        <div class="userinfo-container-left">
            <a-avatar :size="160" class="user-avatar" :src="defaultSettings.userphoto" alt="头像加载失败" />
            <div class="edit-avatar-overlay text-center">
                <svg-icon iconClass="camera" style="font-size: 30px; margin-top: 40px"></svg-icon>
                <div style="margin-top: 10px">修改我的头像</div>
            </div>
        </div>
        <div class="userinfo-base">
            <div class="flex justify-between">
                <span class="nickname">{{ userStore.userInfo && userStore.userInfo.nickname }}</span>
                <span class="back cursor-pointer" @click="router.push({ name: 'my-indexPage' })">返回我的首页 ></span>
            </div>
            <div class="line-data flex">
                <div class="label">性别</div>
                <div>男</div>
            </div>
            <div class="line-data flex">
                <div class="label">一句话简介</div>
                <div>IT</div>
            </div>
            <div class="line-data flex">
                <div class="label">居住地</div>
                <div>男</div>
            </div>
            <div class="line-data flex">
                <div class="label">所在行业</div>
                <div>互联网</div>
            </div>
            <div class="line-data flex">
                <div class="label">职业经历</div>
                <div>男</div>
            </div>
            <div class="line-data flex">
                <div class="label">教育经历</div>
                <div>男</div>
            </div>
            <div class="line-data flex">
                <div class="label">个人简介</div>
                <div>男</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { defaultSettings } from '@/settings/defaultSetting'
import { useUserStore } from '@/store/modules/user'
const userStore = useUserStore()
const router = useRouter()
</script>

<style lang="scss" scoped>
.userinfo-container {
    position: relative;
    .userinfo-container-left {
        position: absolute;
        top: -75px;
        left: 40px;
        .user-avatar {
            border: 8px solid #fff;
        }
        .edit-avatar-overlay {
            position: absolute;
            width: 100%;
            height: 100%;
            color: #fff;
            font-size: 12px;
            top: 0;
            background: rgba($color: #000000, $alpha: 0.2);
            border-radius: 50%;
            overflow: hidden;
            border: 8px solid #fff;
        }
    }
}
.userinfo-base {
    padding: 10px 20px 0 230px;
    background-color: #fff;
    border-radius: 0 0 5px 5px;
    overflow: hidden;
    min-height: 140px;
    .nickname {
        font-size: 22px;
        font-weight: 600;
    }
    .back {
        color: #666666;
        font-size: 12px;
    }

    .line-data {
        padding: 30px 0;
        margin-right: 160px;
        border-bottom: 1px solid #ccc;
        .label {
            width: 100px;
            font-weight: 600;
        }
        &:nth-child(2) {
            margin-top: 20px;
        }
        &:last-child {
            margin-bottom: 50px;
        }
    }
}
</style>
