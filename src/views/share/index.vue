<template>
    <div class="invite-container">
        <div class="idm-component-common-box">
            <div class="user-line">
                <a-avatar :size="25" :src="getImagePath(pageData.inviteInfo.userInfo.userphoto)" />
                <span class="user-name">{{ pageData.inviteInfo.userInfo.nickname }}</span>
                邀请你加入
            </div>
            <div class="org-line flex flex-direction-column align-center">
                <a-image :width="100" :preview="false" style="object-fit: cover" :height="100" alt="logo加载失败" :src="getImagePath(pageData.inviteInfo.org.orgphoto)" />
                <div class="text-center org-name">{{ pageData.inviteInfo.org.orgname }}</div>
                <div v-if="pageData.inviteInfo.org.introduce" class="flex-1 org-introduce">{{ pageData.inviteInfo.org.introduce }}</div>
                <div v-else class="flex-1 org-introduce">正在使用云it进行组件分享，请尽快加入</div>
            </div>
            <div v-if="userStore.isUserLogined" style="padding: 15px 0 15px 27px">
                <span class="color-999">您将授权以下信息给该组织管理员查看</span>
                <div style="margin: 15px 0 10px">
                    <a-checkbox :default-checked="true" disabled class="invite-checkbox color-999">头像、昵称、个性签名、个人简介</a-checkbox>
                </div>
                <a-checkbox v-model:checked="pageData.shareMobile" class="invite-checkbox">授权该组织管理员可查看手机号</a-checkbox>
            </div>
            <div v-else>
                <div class="flex align-center form-item">
                    <div class="star">*</div>
                    <div class="flex-1">
                        <div>手机号/邮箱</div>
                        <a-input v-model:value="pageData.form.username" class="border-input" :bordered="false" placeholder="请输入手机号/邮箱" />
                    </div>
                </div>
                <div v-if="isPhoneLogin" class="flex align-center form-item">
                    <div class="star">*</div>
                    <AInput v-model:value="pageData.captcha" style="border-bottom: 1px solid #ddd" :bordered="false" placeholder="图形验证码" @keyup.enter="handleSubmit">
                        <template #suffix>
                            <img v-if="pageData.randomImage" style="height: 25px" :src="pageData.randomImage" alt="点击刷新" class="randomImage" @click.stop="handleGetImage" />
                        </template>
                    </AInput>
                </div>
                <div class="flex align-center form-item">
                    <div class="star">*</div>
                    <a-input v-model:value="pageData.form.captcha" style="border-bottom: 1px solid #ddd" :bordered="false" placeholder="验证码">
                        <template #suffix>
                            <AButton class="idm-component-login-box-get-code" :loading="pageData.isSendBtnLoading" type="text" @click="handleGetCode">获取验证码</AButton>
                        </template>
                    </a-input>
                </div>
            </div>
            <div style="margin: 15px 0 0 26px">
                <div class="font-16">申请理由（选填）</div>
                <a-input v-model:value="pageData.form.applyReason" allow-clear :bordered="false" placeholder="请输入申请理由" />
            </div>
            <div class="btn-container text-center">
                <a-button block :loading="pageData.isLoginLoading" style="width: 86%; border-radius: 10px; margin: 0 auto" size="large" type="primary" @click="handleSubmit">
                    提交申请
                </a-button>
                <div v-if="!userStore.isUserLogined" class="reg-intr">未注册的将自动进行注册</div>
            </div>
            <a-checkbox v-if="!userStore.isUserLogined" v-model:checked="pageData.shareMobile" class="invite-checkbox" style="margin: 0 0 0 40px">
                授权该组织管理员可查看手机号
            </a-checkbox>
        </div>
        <div class="flex justify-center align-center" style="margin: 10px 0">
            <a-image :src="yunitLogo" :width="100" style="opacity: 0.6" :preview="false"></a-image>
            <span class="bottom-line"></span>
            <div class="bottom-website">{{ settings.website }}</div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { shareCodeAes } from '@/utils/cipher'
import { coreApi, useUserApi } from '@/apis'
import { getImagePath } from '@/utils'
import { yunitLogo } from '@/assets/images'
import { useUserStore } from '@/store/modules/user'
import { isEmail, isPhone } from '@/utils/is'
import { message } from '@/plugins/globalComponents'
import { settings } from '@/settings/idmSettings'
const userStore = useUserStore()
const route = useRoute()
const router = useRouter()
const pageData = reactive({
    inviteInfo: {
        org: {
            orgphoto: '',
            orgname: '',
            introduce: ''
        },
        userInfo: {
            userphoto: '',
            nickname: ''
        }
    },
    isSendBtnLoading: false,
    isLoginLoading: false,
    form: {
        username: '',
        captcha: '',
        applyReason: '',
        shareMobile: 1
    },
    captcha: '',
    shareMobile: true,
    randomImage: '',
    checkKey: ''
})

if (!route.query.shareCode) {
    message.error('缺少参数：shareCode')
}

const inviteCode = shareCodeAes.decryptByAES(decodeURIComponent(route.query.shareCode as string))

const isPhoneLogin = computed(() => isPhone(pageData.form.username))
const handleGetImage = async () => {
    pageData.checkKey = Date.now() + ''
    const res = await useUserApi.requestRandomImage(pageData.checkKey)
    pageData.randomImage = res.result
}

const handleGetOrgInfo = () => {
    coreApi
        .requestGetInviteInfo({
            inviteCode
        })
        .then((res) => {
            if (res.success) {
                pageData.inviteInfo = res.result
            }
        })
}

handleGetOrgInfo()
const handleSubmit = async () => {
    if (userStore.isUserLogined) {
        coreApi
            .requestApplyJoinOrgByInvite({
                inviteCode,
                applyReason: pageData.form.applyReason,
                shareMobile: pageData.shareMobile ? 1 : 0
            })
            .then((res) => {
                message[res.success ? 'success' : 'error'](res.message)
                if (res.success) {
                    router.push({
                        name: 'index'
                    })
                }
            })
        return
    }
    if (isPhone(pageData.form.username) && !pageData.captcha) {
        return message.warn('请输入图形验证码')
    }
    if (isEmail(pageData.form.username) || isPhone(pageData.form.username)) {
        if (pageData.form.captcha) {
            pageData.isLoginLoading = true
            try {
                const data = Object.assign({}, pageData.form, { inviteCode })
                data.shareMobile = pageData.shareMobile ? 1 : 0
                const res = await userStore.handleUserLogin(data)
                if (res) {
                    router.push({
                        name: 'index'
                    })
                }
            } finally {
                pageData.isLoginLoading = false
            }
        } else {
            message.warn('请输入验证码')
        }
    } else {
        message.warn('请输入正确的邮箱/手机号')
    }
}

const handleGetCode = () => {
    if (isPhone(pageData.form.username) && !pageData.captcha) {
        return message.warn('请输入图形验证码')
    }
    if (isEmail(pageData.form.username) || isPhone(pageData.form.username)) {
        pageData.isSendBtnLoading = true
        handleSendCode()
    } else {
        message.warn('请输入正确的邮箱/手机号')
    }
}
watch(
    () => isPhoneLogin.value,
    (newV) => {
        if (newV) {
            handleGetImage()
        }
    }
)
const handleSendCode = async (): Promise<any> => {
    try {
        const res = await userStore.handleSendCode({
            email: isEmail(pageData.form.username) ? pageData.form.username : '',
            mobile: isPhone(pageData.form.username) ? pageData.form.username : '',
            smsmode: 0,
            captcha: pageData.captcha,
            checkKey: pageData.checkKey
        })
        message[res.success ? 'success' : 'error'](res.message)
    } finally {
        pageData.isSendBtnLoading = false
    }
}
</script>

<style lang="scss" scoped>
.invite-container {
    max-width: 580px;
    margin: 0 auto;
    padding: 10px;
    .idm-component-common-box {
        padding: 15px;
        border-radius: 8px;
    }
    .user-line {
        color: #444;
        letter-spacing: 2px;
        font-size: 16px;
        .user-name {
            color: #333333;
            font-size: 18px;
            margin: 0 10px;
            letter-spacing: 1px;
        }
    }
    .org-line {
        padding: 20px 0;
        border-bottom: 1px solid #ccc;
        .org-name {
            font-size: 24px;
            font-weight: 600;
            color: #333333;
            margin: 10px 0 0 0;
        }
        .org-introduce {
            color: #999999;
        }
        .flex-1 {
            width: 100%;
        }
    }
    .btn-container {
        margin: 30px 0 10px;
    }
    .font-16 {
        font-size: 16px;
    }
    .star {
        display: inline-block;
        margin: 0 10px;
        color: #ff4d4f;
        font-size: 14px;
        font-family: SimSun, sans-serif;
    }
    .form-item {
        margin: 15px 0 10px;
    }
    ::v-deep(.ant-input) {
        padding: 4px 0 10px;
        width: 100%;
    }
    .border-input {
        border-bottom: 1px solid #ddd;
    }
    ::v-deep(.ant-input-affix-wrapper) {
        padding: 4px 0;
        .ant-input {
            border: 0;
            font-size: 20px;
        }
    }

    ::v-deep(.ant-checkbox-inner) {
        width: 14px;
        height: 14px;
    }
    .reg-intr {
        color: #c6c6c6;
        font-size: 12px;
        margin: 10px 0 0 0;
    }
    .invite-checkbox {
        font-size: 12px;
    }
    .color-999 {
        color: #999 !important;
    }
    .bottom-line {
        border-left: 1px solid #c4c4c4;
        height: 24px;
        margin: 0 10px;
    }
    .bottom-website {
        color: #c4c4c4;
        font-size: 20px;
    }
}
</style>
