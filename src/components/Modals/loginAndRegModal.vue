<template>
    <a-modal
        width="450px"
        centered
        wrapClassName="idm-component-login-box"
        :body-style="{ padding: '15px 28px 15px' }"
        :visible="visible"
        :mask-closable="false"
        :update:visible="($e: boolean) => emits('update:visible', $e)"
        title="欢迎登录IDM组件平台"
        :footer="null"
        @cancel="() => emits('update:visible', false)">
        <div class="box-title">
            <span class="cursor-pointer">{{ boxType[pageState.currentType] }}</span>
        </div>
        <AForm ref="formRef" :model="formState" name="loginAndReg" :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }">
            <AFormItem label="" name="username" :rules="[{ required: true, validator: usernameValidator }]">
                <AInput
                    ref="usernameInput"
                    v-model:value="formState.username"
                    :placeholder="[1, 3].includes(pageState.currentType) ? '请输入手机号/邮箱' : '请输入手机号/邮箱/用户名'"
                    @keyup.enter="handleLogin" />
            </AFormItem>

            <AFormItem v-if="isPhoneLogin" label="">
                <AInput v-model:value="pageState.captcha" placeholder="图形验证码" @keyup.enter="handleLogin">
                    <template #suffix>
                        <img v-if="pageState.randomImage" style="height: 25px;width: 80px" :src="pageState.randomImage" alt="点击刷新" class="randomImage" @click.stop="handleGetImage" />
                    </template>
                </AInput>
            </AFormItem>

            <AFormItem v-if="[1, 3].includes(pageState.currentType)" label="" name="captcha" :rules="[{ required: true, message: '请输入验证码' }]">
                <AInput v-model:value="formState.captcha" placeholder="请输入验证码" @keyup.enter="handleLogin">
                    <template #suffix>
                        <AButton class="idm-component-login-box-get-code" :loading="pageState.isSendBtnLoading" type="text" @click="hanldeGetCode">获取验证码</AButton>
                    </template>
                </AInput>
            </AFormItem>

            <AFormItem v-if="[2, 3].includes(pageState.currentType)" label="" name="password" :rules="[{ required: true, message: '请输入密码' }]">
                <AInput v-model:value="formState.password" type="password" placeholder="请输入密码" @keyup.enter="handleLogin">
                    <template v-if="[2].includes(pageState.currentType)" #suffix>
                        <span class="cursor-pointer" @click="changeBoxType(3)">忘记密码</span>
                    </template>
                </AInput>
            </AFormItem>

            <AFormItem v-if="[2].includes(pageState.currentType)" label="" name="checkKey" :rules="[{ required: true, message: '图形验证码' }]">
                <AInput v-model:value="formState.captcha" placeholder="图形验证码" @keyup.enter="handleLogin">
                    <template #suffix>
                        <img v-if="pageState.randomImage" style="height: 25px" :src="pageState.randomImage" alt="点击刷新" class="randomImage" @click.stop="handleGetImage" />
                    </template>
                </AInput>
            </AFormItem>

            <AFormItem>
                <AButton block type="primary" style="height: 36px" :loading="pageState.isLoginLoading" @click="handleLogin">
                    {{ [1, 2].includes(pageState.currentType) ? '登录' : '确认' }}
                </AButton>
            </AFormItem>
        </AForm>
        <div style="text-align: right; margin-top: -10px">
            <span v-if="[1, 2].includes(pageState.currentType)" class="box-bottom-text cursor-pointer" @click="changeBoxType(pageState.currentType === 1 ? 2 : 1)">{{
                pageState.currentType === 1 ? boxType[pageState.currentType + 1] : boxType[pageState.currentType - 1]
            }}</span>
            <span v-if="[3].includes(pageState.currentType)" class="box-bottom-text cursor-pointer" @click="changeBoxType(2)">返回登录</span>
        </div>
    </a-modal>
</template>
<script lang="ts" setup>
import type { FormInstance } from 'ant-design-vue'
import type { SmsData } from '@/apis/user'
import type { Rule } from 'ant-design-vue/es/form'
import { isPhone, isEmail } from '@/utils/is'
import { useUserStore } from '@/store/modules/user'
import { message } from '@/plugins/globalComponents'
import { LoginData } from '@/apis/user'
import { useUserApi } from '@/apis'
const userStore = useUserStore()
const boxType = {
    1: '验证码登录',
    2: '密码登录',
    3: '重置密码'
} as any

const propData = defineProps({
    boxType: {
        type: String,
        default: 'login'
    },
    visible: {
        type: Boolean,
        default: false
    }
})
const emits = defineEmits(['update:visible'])
const usernameInput = ref<HTMLElement>()
const pageState = reactive({
    currentType: 1,
    isSendBtnLoading: false,
    isLoginLoading: false,
    randomImage: '',
    captcha: ''
})
const formRef = ref<FormInstance>()
const formState = reactive<LoginData>({
    username: '',
    password: '',
    captcha: '',
    checkKey: ''
})
const isPhoneLogin = computed(() => isPhone(formState.username) && [1, 3].includes(pageState.currentType))

watch(
    () => isPhoneLogin.value,
    (newV) => {
        if (newV) {
            handleGetImage()
        }
    }
)
watch(
    () => propData.visible,
    (newV) => {
        if (newV) {
            pageState.currentType = 1
            nextTick(() => {
                formRef.value?.resetFields()
                formState.password = ''
                usernameInput.value?.focus()
            })
        }
    }
)
const handleGetParams = (): SmsData => {
    return {
        email: isEmail(formState.username) ? formState.username : '',
        mobile: isPhone(formState.username) ? formState.username : '',
        smsmode: [1, 2].includes(pageState.currentType) ? 0 : 2,
        captcha: pageState.captcha,
        checkKey: formState.checkKey
    }
}
const handleLogin = async () => {
    await formRef.value?.validateFields()
    pageState.isLoginLoading = true
    try {
        if ([1, 2].includes(pageState.currentType)) {
            const res = await userStore.handleUserLogin(formState)
            if (res) {
                emits('update:visible', false)
                window.location.reload()
            }
        } else {
            // 修改密码
            const res = await useUserApi.requestCoreResetPwd({
                account: formState.username,
                pwd: formState.password,
                captcha: formState.captcha
            })
            if (res) {
                message[res.success ? 'success' : 'error'](res.message)
                if (res.success) {
                    pageState.currentType = 2
                }
            }
        }
    } finally {
        pageState.isLoginLoading = false
    }
}
const handleSendCode = async (): Promise<any> => {
    try {
        const res = await userStore.handleSendCode(handleGetParams())
        message[res.success ? 'success' : 'error'](res.message)
    } finally {
        pageState.isSendBtnLoading = false
    }
}

const changeBoxType = (type: number) => {
    pageState.currentType = type
    formRef.value?.resetFields()
    pageState.captcha = ''
    formState.captcha = ''
    if (type === 2) {
        handleGetImage()
    }
}
const handleGetImage = async () => {
    formState.checkKey = Date.now() + ''
    const res = await useUserApi.requestRandomImage(formState.checkKey)
    pageState.randomImage = res.result
}
const hanldeGetCode = () => {
    formRef.value?.validate(['username']).then(() => {
        if (isPhone(formState.username) && !pageState.captcha) {
            return message.warn('请输入图形验证码')
        }
        pageState.isSendBtnLoading = true
        handleSendCode()
    })
}
const usernameValidator = async (_rule: Rule, value: string) => {
    if ([1, 3].includes(pageState.currentType)) {
        if (isEmail(value) || isPhone(value)) {
            return Promise.resolve()
        } else {
            return Promise.reject('请输入手机号/邮箱')
        }
    } else {
        if (value) {
            return Promise.resolve()
        } else {
            return Promise.reject('请输入手机号/邮箱/用户名')
        }
    }
}
</script>

<style lang="scss">
.idm-component-login-box {
    .ant-modal-header {
        padding: 20px 26px;
        .ant-modal-title {
            font-size: 20px;
        }
    }
    .box-title {
        margin: 0 0 25px 0;
        font-size: 16px;
    }
    .ant-input {
        font-size: 15px;
    }
    .ant-form-item-control-input-content {
        background: #f2f3f5;
        > .ant-input {
            transition: all 0s;
            padding: 6px 14px;
            border-color: transparent;
            background: #f2f3f5;
            &:focus {
                border-color: #1890ff;
                background: #ffffff;
            }
        }
        &:focus-within {
            border-color: #1890ff;
            background: #ffffff;
        }
    }
    .ant-input-affix-wrapper {
        padding: 6px 14px;
        border-color: transparent;
        background: #f2f3f5;
        transition: all 0s;
        input.ant-input {
            background: #f2f3f5;
            transition: all 0s;
        }
        &:hover {
            border-color: transparent;
        }
    }
    .ant-input-affix-wrapper-focused {
        border-color: #1890ff;
        background: #ffffff;
        input.ant-input {
            background: #ffffff;
        }
    }
    .ant-input-affix-wrapper.ant-input-affix-wrapper-focused {
        &:hover {
            border-color: #1890ff;
        }
    }
    .ant-btn[type='submit'] {
        height: 40px;
        font-size: 16px;
    }
    .box-bottom-text {
        text-decoration: underline;
    }
    .idm-component-login-box-get-code {
        &::before {
            background: transparent !important;
        }
        margin: -5px 0 0 0;
        height: 25px;
        color: #1890ff;
        padding-right: 0;
        background: transparent !important;
    }
}
</style>
