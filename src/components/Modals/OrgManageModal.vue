<template>
    <a-modal
        destroy-on-close
        width="1000px"
        centered
        :visible="visible"
        :mask-closable="false"
        :body-style="{paddingTop: 0}"
        title="组织设置"
        cancel-text="取消"
        ok-text="确认"
        @cancel="handleClose"
        @ok="handleOk"
    >
        <a-tabs v-model:activeKey="activeKey">
            <a-tab-pane key="1" tab="基本信息">
                基本信息
            </a-tab-pane>
            <a-tab-pane v-if="isAdmin && isAdmin.userType === 1" key="2" tab="功能设置">
                <OrgManageFunBox />
            </a-tab-pane>
        </a-tabs>
    </a-modal>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/store/modules/user'
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
const isAdmin = computed(() => props.itemData.userInfoModels?.find((item: any) => item.id === userStore.userInfo?.id))
const activeKey = ref('1')
const emits = defineEmits(['update:visible'])

const handleOk = () => {
    console.log('...............handleOk')
}
const handleClose = () => {
    emits('update:visible', false)
}

watch(() => props.visible, () => {
    if (props.visible) {
        activeKey.value = '1'
    }
}, { immediate: true, deep: true })
</script>
<style lang="scss" scoped>
.list {
    max-height: 510px;
    overflow: auto;
}
</style>
