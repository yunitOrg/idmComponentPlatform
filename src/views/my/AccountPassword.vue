<template>
    <div class="AccountPassword_app page-max-width">
        <div class="title flex_between">
            <div class="title_left">
                账号与密码
            </div>
            <div class="title_right flex_end">
                <div class="pointer" @click="backHome()">
                    <span>返回我的主页 > </span>
                </div>
            </div>
        </div>
        <div class="form">
            <div class="row flex_between">
                <div class="row_left">密码</div>
                <div class="row_right flex_between">
                    <span>存在风险请修改密码</span>
                    <div class="action_button">
                        <span class="pointer" @click="changePassword">修改密码</span>
                    </div>
                </div>
            </div>
            <div class="row flex_between">
                <div class="row_left">手机</div>
                <div class="row_right flex_between">
                    <span>{{ encipher(userInfo ? userInfo.mobile : '') }}</span>
                    <div class="action_button">
                        <span class="pointer" @click="changeEmail(2)">修改手机</span>
                    </div>
                </div>
            </div>
            <div class="row flex_between">
                <div class="row_left">邮箱</div>
                <div class="row_right flex_between">
                    <span>{{ encipher(userInfo ? userInfo.email : '') }}</span>
                    <div class="action_button">
                        <span class="pointer" @click="changeEmail(1)">修改邮箱</span>
                    </div>
                </div>
            </div>
            <div class="row flex_between">
                <div class="row_left">登录记录</div>
                <div class="row_right flex_between">
                    <div class="action_button">
                        <span>查看记录</span>
                    </div>
                </div>
            </div>
            <div class="row flex_between">
                <div class="row_left">账号注销</div>
                <div class="row_right flex_between">
                    <div class="action_button">
                        <span>立即注销</span>
                    </div>
                </div>
            </div>
            <div class="row flex_between">
                <div class="row_left">微信</div>
                <div class="row_right flex_between">
                    <span class="status_text">未绑定</span>
                    <div class="action_button">
                        <span>绑定</span>
                    </div>
                </div>
            </div>
            <div class="row flex_between">
                <div class="row_left">钉钉</div>
                <div class="row_right flex_between">
                    <span class="status_text">未绑定</span>
                    <div class="action_button">
                        <span>绑定</span>
                    </div>
                </div>
            </div>
            <div class="row flex_between">
                <div class="row_left">GitHub</div>
                <div class="row_right flex_between">
                    <span class="status_text">未绑定</span>
                    <div class="action_button">
                        <span>绑定</span>
                    </div>
                </div>
            </div>
        </div>
        <AModal v-model:visible="pageState.isChangeEmailPopShow" :afterClose="afterClose" :title="pageState.changeEmailMobileType == 1 ? '修改邮箱' : '修改手机号'" wrapClassName="changeEmailPop" :maskClosable="false" :footer="null" @ok="handleOk">
            <template v-if="pageState.formStatus == 1">
                <div class="row">验证码将发送到{{ encipher(pageState.validType == 1 ? userInfo.email : userInfo.mobile) }}</div>
                <div v-if="pageState.validType == 1" class="notice">如果长时间未收到验证码，请检查垃圾箱</div>
                <div v-if="pageState.validType == 2" class="row flex_start">
                    <div class="label">图形验证码：</div>
                    <AInput v-model:value="formState.checkKey" placeholder="图形验证码">
                        <template #suffix>
                            <img v-if="pageState.randomImage" style="height: 25px;width: 80px" :src="pageState.randomImage" alt="点击刷新" class="randomImage" @click.stop="handleGetImage" />
                        </template>
                    </AInput>
                </div>
                <div class="row flex_start">
                    <div class="label">填写验证码：</div>
                    <AInput v-model:value="formState.captcha" placeholder="请输入验证码">
                        <template #suffix>
                            <AButton class="idm-component-login-box-get-code" :loading="pageState.isSendBtnLoading" type="text" @click="hanldeGetCode">获取验证码</AButton>
                        </template>
                    </AInput>
                </div>
                <div class="button_block flex_center">
                    <AButton type="primary" @click="toNextType()">下一步</AButton>
                </div>
                <div v-if="pageState.validType === 1 && userInfo && userInfo.mobile" class="link" @click="changeValidType(2)">邮箱不可用？可通过手机号修改</div>
                <div v-if="pageState.validType === 2 && userInfo && userInfo.email" class="link" @click="changeValidType(1)">手机号不可用？可通过邮箱修改</div>
            </template>
            <template v-else>
                <div class="row flex_start">
                    <div class="label">{{ pageState.changeEmailMobileType == 1 ? '输入新邮箱：' : '输入手机号：' }}</div>
                    <AInput v-model:value="formState.newEmail" :placeholder="pageState.changeEmailMobileType == 1 ? '不建议使用QQ邮箱' : '请输入新手机号'">
                        <template #suffix>
                        </template>
                    </AInput>
                </div>
                <div v-if="pageState.changeEmailMobileType == 2 && isPhoneValid" class="row flex_start">
                    <div class="label">图形验证码：</div>
                    <AInput v-model:value="formState.checkKey" placeholder="图形验证码">
                        <template #suffix>
                            <img v-if="pageState.randomImage" style="height: 25px;width: 80px" :src="pageState.randomImage" alt="点击刷新" class="randomImage" @click.stop="handleGetImage" />
                        </template>
                    </AInput>
                </div>
                <div class="row flex_start">
                    <div class="label">填写验证码：</div>
                    <AInput v-model:value="formState.newCaptcha" placeholder="请输入验证码">
                        <template #suffix>
                            <AButton class="idm-component-login-box-get-code" :loading="pageState.isSendBtnLoadingNew" type="text" @click="hanldeGetCodeNew">获取验证码</AButton>
                        </template>
                    </AInput>
                </div>
                <div class="button_block flex_center">
                    <AButton :loading="pageState.isConfirmBtnLoading" type="primary" @click="changeEmailSubmit">确定</AButton>
                </div>
                <div v-if="pageState.changeEmailMobileType == 1" class="notice">如果长时间未收到验证码，请检查垃圾箱</div>
            </template>
        </AModal>
        <AModal v-model:visible="pageState.isChangePasswordPopShow" :afterClose="afterClose" :destroyOnClose="true" title="修改密码" wrapClassName="changePasswordPop" :maskClosable="false" :footer="null">
            <div class="row">
                <AInput v-model:value="passwordFormState.username" placeholder="请输入手机号/邮箱">
                </AInput>
            </div>
            <div v-if="isPhoneChangePassword" class="row">
                <AInput v-model:value="formState.checkKey" placeholder="图形验证码">
                    <template #suffix>
                        <img v-if="pageState.randomImage" style="height: 25px;width: 80px" :src="pageState.randomImage" alt="点击刷新" class="randomImage" @click.stop="handleGetImage" />
                    </template>
                </AInput>
            </div>
            <div class="row">
                <AInput v-model:value="passwordFormState.captcha" placeholder="请输入验证码">
                    <template #suffix>
                        <AButton class="idm-component-login-box-get-code" :loading="pageState.isSendBtnLoadingPassword" type="text" @click="hanldeGetCodePassword">获取验证码</AButton>
                    </template>
                </AInput>
            </div>
            <div class="row">
                <AInput v-model:value="passwordFormState.password" type="password" placeholder="请输入密码">
                </AInput>
            </div>
            <div class="button_block">
                <AButton :loading="pageState.isChangePasswordConfirmBtnLoading" :block="true" size="large" type="primary" @click="changePasswordSubmit">确定</AButton>
            </div>
        </AModal>
    </div>
</template>
<script lang="ts" setup>
import { useUserStore } from '@/store/modules/user'
import { isEmail, isPhone } from '@/utils/is'
import { message } from '@/plugins/globalComponents'
import { useUserApi } from '@/apis'
import { useRouter } from 'vue-router'
import type { SmsData } from '@/apis/user'
const router = useRouter()
const userStore = useUserStore()
const { userInfo } = toRefs<any>(userStore)
const pageState = reactive({
    isChangeEmailPopShow: false,
    isSendBtnLoading: false,
    isSendBtnLoadingNew: false,
    isConfirmBtnLoading: false,
    isChangePasswordPopShow: false,
    isSendBtnLoadingPassword: false,
    isChangePasswordConfirmBtnLoading: false,
    changeEmailMobileType: 1, // 1表示邮箱，2表示手机号
    formStatus: 1,
    validType: 1, // 初次获取验证码校验方式-1表示邮箱，2表示手机号
    randomImage: '',
    checkKey: ''
})
const formState = reactive({
    captcha: '',
    checkKey: '',
    newEmail: '',
    newCaptcha: '',
    newCheckKey: ''
})
const passwordFormState = reactive({
    username: '',
    password: '',
    captcha: ''
})
const isPhoneValid:any = computed(() => isPhone(formState.newEmail))
watch(
    () => isPhoneValid.value,
    (newV) => {
        if (newV) {
            handleGetImage()
        }
    }
)
const isPhoneChangePassword = computed(() => isPhone(passwordFormState.username))
watch(
    () => isPhoneChangePassword.value,
    (newV) => {
        if (newV) {
            handleGetImage()
        }
    }
)
const encipher = (str: any) => {
    if (!str) {
        return ''
    }
    return str.substr(0, 3) + '****' + str.substr(7)
}
const handleGetImage = async () => {
    pageState.checkKey = Date.now() + ''
    const res = await useUserApi.requestRandomImage(pageState.checkKey)
    pageState.randomImage = res.result
}
const changeValidType = (type: number) => {
    if (pageState.validType === type) {
        return
    }
    pageState.validType = type
    if (type === 2) {
        handleGetImage()
    }
}
const handleOk = () => {
    pageState.isChangeEmailPopShow = false
}
const changeEmail = (type:number) => {
    pageState.changeEmailMobileType = type
    pageState.formStatus = 1
    if ((type === 1 && userInfo.value.email) || (type === 2 && !userInfo.value.mobile)) {
        pageState.validType = 1
    } else {
        pageState.validType = 2
        handleGetImage()
    }
    pageState.isChangeEmailPopShow = true
}
const handleGetParams = (): SmsData => {
    return {
        email: isEmail(userInfo.value?.email) && pageState.validType === 1 ? userInfo.value.email : '',
        mobile: isPhone(userInfo.value?.mobile) && pageState.validType === 2 ? userInfo.value.mobile : '',
        smsmode: 2,
        captcha: formState.checkKey,
        checkKey: pageState.checkKey
    }
}
const hanldeGetCode = () => {
    pageState.isSendBtnLoading = true
    userStore.handleSendCode(handleGetParams()).then((res) => {
        pageState.isSendBtnLoading = false
        if (res.success) {
            message.success(res.message)
        } else {
            message.error(res.message)
        }
    }).catch(() => {
        pageState.isSendBtnLoading = false
    })
}
const hanldeGetCodeNew = () => {
    pageState.isSendBtnLoadingNew = true
    const data: SmsData = {
        email: isEmail(formState.newEmail) && pageState.changeEmailMobileType === 1 ? formState.newEmail : '',
        mobile: isPhone(formState.newEmail) && pageState.changeEmailMobileType === 2 ? formState.newEmail : '',
        smsmode: 2,
        captcha: formState.checkKey,
        checkKey: pageState.checkKey
    }
    userStore.handleSendCode(data).then((res) => {
        pageState.isSendBtnLoadingNew = false
        if (res.success) {
            message.success(res.message)
        } else {
            message.error(res.message)
        }
    }).catch(() => {
        pageState.isSendBtnLoadingNew = false
    })
}
const toNextType = () => {
    useUserApi.checkAccountCaptchaApi({
        account: pageState.validType === 1 ? userInfo.value.email : userInfo.value.mobile,
        captcha: formState.captcha
        // checkKey: formState.checkKey
    }).then((res) => {
        if (res.success) {
            pageState.checkKey = ''
            pageState.randomImage = ''
            pageState.formStatus = 2
            formState.checkKey = ''
        } else {
            message.error(res.message)
        }
    }).catch((err) => {
        console.log(err)
    })
}
const changeEmailSubmit = () => {
    const data = {
        account: formState.newEmail,
        captcha: formState.newCaptcha
    }
    pageState.isConfirmBtnLoading = true
    useUserApi.resetAccountInfoApi(data).then((res) => {
        pageState.isConfirmBtnLoading = false
        if (res.success) {
            message.success(res.message)
            userStore.handleGetUserInfo()
            pageState.isChangeEmailPopShow = false
        } else {
            message.error(res.message)
        }
    }).catch((err) => {
        console.log(err)
        pageState.isConfirmBtnLoading = false
    })
}
const afterClose = () => {
    pageState.formStatus = 1
    pageState.isSendBtnLoading = false
    pageState.isSendBtnLoadingNew = false
    pageState.isConfirmBtnLoading = false
    formState.captcha = ''
    formState.newEmail = ''
    formState.newCaptcha = ''
    formState.checkKey = ''
    passwordFormState.username = ''
    passwordFormState.password = ''
    passwordFormState.captcha = ''
}
const changePassword = () => {
    pageState.isChangePasswordPopShow = true
}
const hanldeGetCodePassword = () => {
    pageState.isSendBtnLoadingPassword = true
    const data: SmsData = {
        email: isEmail(passwordFormState.username) ? passwordFormState.username : '',
        mobile: isPhone(passwordFormState.username) ? passwordFormState.username : '',
        smsmode: 2,
        captcha: formState.checkKey,
        checkKey: pageState.checkKey
    }
    userStore.handleSendCode(data).then((res) => {
        pageState.isSendBtnLoadingPassword = false
        if (res.success) {
            message.success(res.message)
        } else {
            message.error(res.message)
        }
    }).catch(() => {
        pageState.isSendBtnLoadingPassword = false
    })
}
const changePasswordSubmit = () => {
    pageState.isChangePasswordConfirmBtnLoading = true
    useUserApi.requestCoreResetPwd({
        account: passwordFormState.username,
        pwd: passwordFormState.password,
        captcha: passwordFormState.captcha
    }).then((res) => {
        pageState.isChangePasswordConfirmBtnLoading = false
        if (res.success) {
            message.success(res.message)
            pageState.isChangePasswordPopShow = false
            userStore.handleUserLogout()
        } else {
            message.error(res.message)
        }
    }).catch((err) => {
        console.log(err)
        pageState.isChangePasswordConfirmBtnLoading = false
    })
}
const backHome = () => {
    router.push({
        name: 'indexPage',
        params: {
            userId: userInfo.value.id
        }
    })
}
</script>
<style lang="scss" scoped>
.AccountPassword_app{
    padding: 30px 40px;
    margin-bottom: 20px !important;
    border-radius: 5px;
    background: white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    .title{
        .title_left{
            font-size: 24px;
            font-weight: 600;
            color: #333;
        }
        .title_right{
            text-align: right;
            font-size: 14px;
            color: #8590A6;
        }
    }
    .form{
        .row{
            height: 73px;
            padding: 0 0 0 5px;
            font-size: 13px;
            color: #333;
            border-bottom: 1px solid rgba(0,0,0,0.1);
            .row_right{
                .status_text{
                    color: #999;
                }
                .action_button{
                    text-align: right;
                    width: 150px;
                    color: #007fff;
                }
            }
            &:last-child{
                border-bottom: none;
            }
        }
    }
}
</style>
<style lang="scss">
.changeEmailPop{
    .row{
        margin-bottom: 20px;
        .label{
            white-space: nowrap;
        }
        .ant-input-affix-wrapper{
            height: 42px;
        }
    }
    .notice{
        margin: 10px 0 20px 0;
        color: #999;
    }
    .button_block{
        margin: 30px 0 20px 0;
    }
    .link{
        text-align: center;
        color: #007fff;
    }
    .idm-component-login-box-get-code{
        span{
            color: #007fff;
        }
    }
}
.changePasswordPop{
    .row{
        margin-bottom: 15px;
        .ant-input-affix-wrapper{
            height: 42px;
        }
        &>.ant-input{
            height: 42px;
        }
    }
    .button_block{
        margin-top: 30px;
    }
    .idm-component-login-box-get-code{
        span{
            color: #007fff;
        }
    }
}
</style>
