<template>
    <a-modal
        destroy-on-close
        width="800px"
        centered
        :visible="visible"
        :mask-closable="false"
        :body-style="{paddingTop: 0}"
        title="组织设置"
        cancel-text="取消"
        ok-text="保存"
        :confirm-loading="state.btnLoading"
        :ok-button-props="{
            disabled: disabledSave
        }"
        @cancel="handleClose"
        @ok="handleOk"
    >
        <a-spin :spinning="state.loading">
            <a-tabs v-model:activeKey="activeKey">
                <a-tab-pane key="1" tab="基本信息">
                    <OrgManageBaseBox v-if="state.data.id" v-model:data="state.data" />
                    <a-empty v-else />
                </a-tab-pane>
                <a-tab-pane v-if="isAdmin && isAdmin.userType === 1" key="2" tab="功能设置">
                    <OrgManageFunBox v-if="state.data.id" v-model:data="state.data" />
                    <a-empty v-else />
                </a-tab-pane>
            </a-tabs>
        </a-spin>
    </a-modal>
</template>

<script lang="ts" setup>
import { message } from 'ant-design-vue'
import { useUserStore } from '@/store/modules/user'
import { useOrgAboutApi } from '@/apis'
const userStore = useUserStore()
const props = defineProps({
    visible: {
        type: Boolean,
        default: false
    },
    itemData: {
        type: Object,
        default: () => ({})
    }
})
const state = reactive<{[x: string]: any}>({
    data: {},
    loading: false,
    btnLoading: false
})
const required = ['orgphoto', 'orgname', 'introduce']
const disabledSave = computed(() => required.some((str: string) => !state.data[str]))
const isAdmin = computed(() => props.itemData.userInfoModels?.find((item: any) => item.id === userStore.userInfo?.id))
const activeKey = ref('1')
const emits = defineEmits(['update:visible'])

const handleOk = () => {
    state.btnLoading = true
    const data = {
        id: state.data.id,
        rolePublic: state.data.rolePublic,
        roleInvitation: state.data.roleInvitation,
        roleTopic: state.data.roleTopic,
        joinCheck: state.data.joinCheck,
        orgphoto: state.data.orgphoto,
        orgname: state.data.orgname,
        introduce: state.data.introduce,
        companyName: state.data.companyName
    }
    useOrgAboutApi.requestSaveOrgInfo({ ...data }).then((res: any) => {
        state.btnLoading = false
        if (res.success) {
            message.success('保存成功！')
            handleClose()
        } else {
            message.error(res.message || '保存失败！')
        }
    }).catch(() => {
        state.btnLoading = false
        message.error('请求失败！')
    })
}
const handleClose = () => {
    emits('update:visible', false)
}
const getFormData = () => {
    state.loading = true
    useOrgAboutApi.requestOrgInfo({ id: props.itemData.id }).then((res: any) => {
        state.loading = false
        if (res.success) {
            state.data = res.result
        } else {
            message.error(res.message || '获取详情失败！')
        }
    }).catch(() => {
        state.loading = false
        message.error('请求失败！')
    })
}

watch(() => props.visible, () => {
    if (props.visible) {
        activeKey.value = '1'
        getFormData()
    }
}, { immediate: true, deep: true })
</script>
<style lang="scss" scoped>
.list {
    max-height: 510px;
    overflow: auto;
}
</style>
