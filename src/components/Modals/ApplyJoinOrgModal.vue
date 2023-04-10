<template>
    <a-modal
        width="600px"
        centered
        wrapClassName="idm-reg-org-box"
        :body-style="{ padding: '15px 28px 15px' }"
        :visible="visible"
        :mask-closable="false"
        :update:visible="($e: boolean) => emits('update:visible', $e)"
        title=""
        :footer="null"
        @cancel="() => emits('update:visible', false)">
        <div class="text-center box-title">申请加入组织</div>
        <div class="text-center">
            <AImage :preview="false" :width="60" :src="getImagePath(propData.orgInfo.orgphoto)"></AImage>
            <div class="org-name">{{ propData.orgInfo.orgname }}</div>
            <div class="org-instrance text-o-e-2">{{ propData.orgInfo.introduce }}</div>
            <div class="org-user flex justify-center">
                成员：<span style="margin: 0 20px 0 0; font-weight: 600">{{ propData.orgInfo.userCount }}</span> 管理员：
                <div class="admin-name text-o-e" style="max-width: 115px">{{ handleGetAdmin() }}</div>
            </div>
            <div class="info-container text-left">
                <div>您将授权以下信息给该组织管理员查看</div>
                <a-checkbox v-model:checked="pageData.baseChecked" style="margin: 10px 0 5px 0" disabled>头像、昵称、个性签名、个人简介</a-checkbox>
                <div>
                    <a-checkbox v-model:checked="pageData.phoneChecked">
                        <span>手机号</span>
                        <span>({{ handleShowMobile(userStore.userInfo?.mobile) || '暂无' }})</span>
                    </a-checkbox>
                </div>
            </div>
        </div>
        <div class="text-center">
            <AButton type="primary" style="margin: 0 20px 0 0" :loading="pageData.btnLoading" @click="handleConfirm">提交申请</AButton>
            <AButton type="default" @click="emits('update:visible', false)">取消</AButton>
        </div>
    </a-modal>
</template>

<script lang="ts" setup>
import { message } from '@/plugins/globalComponents'
import { getImagePath } from '@/utils'
import { useHomeCoreApi } from '@/apis'
import { useUserStore } from '@/store/modules/user'
const userStore = useUserStore()
const propData = defineProps({
    visible: {
        type: Boolean,
        default: false
    },
    orgInfo: {
        type: Object,
        default: () => {}
    }
})
const pageData = reactive<{ [x: string]: any }>({
    btnLoading: false,
    baseChecked: true,
    phoneChecked: false
})
const emits = defineEmits(['update:visible'])
const handleConfirm = async () => {
    pageData.btnLoading = true
    try {
        const res = await useHomeCoreApi.requestCoreApplyJoinOrg({
            orgId: propData.orgInfo.id,
            shareMobile: pageData.phoneChecked ? '1' : '0'
        })
        message[res.success ? 'success' : 'error'](res.message)
        if (res.success) {
            emits('update:visible', false)
        }
    } finally {
        pageData.btnLoading = false
    }
}
const handleGetAdmin = () => {
    return propData.orgInfo.userInfoModels.map((el: any) => el.nickname).join(',')
}
const handleShowMobile = (mobile?: number) => {
    if (!mobile) return
    const mobileStr = mobile.toString()
    const reg = /^(\d{3})\d{4}(\d{4})$/
    return mobileStr.replace(reg, '$1****$2')
}
</script>
<style lang="scss" scoped>
.box-title {
    font-size: 20px;
    font-weight: 600;
    margin: 0 0 30px 0;
}
.org-name {
    font-size: 18px;
    font-weight: 600;
    color: #666666;
    margin: 20px 0 8px;
}
.org-instrance {
    font-size: 14px;
    color: #666666;
}
.admin-name {
    color: #40a9ff;
}
.org-user {
    margin: 8px 0;
    font-size: 14px;
    color: #555;
}
.info-container {
    width: 242px;
    margin: 30px auto 50px;
}
</style>
