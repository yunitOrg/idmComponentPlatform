<template>
    <a-popover v-if="slots.card" placement="bottom" overlayClassName="user-card-popover" @visible-change="visibleChange">
        <template #content>
            <div class="user-card-container">
                <div v-if="pageData.loading" class="flex justify-center align-center">
                    <a-spin></a-spin>
                </div>
                <Card v-else />
            </div>
        </template>
        <slot></slot>
    </a-popover>
    <template v-else>
        <slot />
    </template>
</template>

<script setup lang="ts">
import { InjectSlots } from '../../key'
import { useUserApi } from '@/apis'
interface Props {
    uid: string
}

const propData = defineProps<Props>()
const pageData = reactive({
    loading: false
})

const userInfo = ref({})

const visibleChange = (isShow: boolean) => {
    if (isShow) {
        pageData.loading = true
        useUserApi
            .requestGetUserInfo({
                user_id: propData.uid
            })
            .then((res) => {
                if (res.success) {
                    userInfo.value = res.result
                }
            })
            .finally(() => {
                pageData.loading = false
            })
    }
}

// 工具slots
const slots = inject(InjectSlots) as any
const Card = () => h('div', slots.card(userInfo.value))
</script>

<style lang="scss" scoped>
.user-card-container {
    width: 260px;
    min-height: 100px;
}
</style>

<style lang="scss">
.user-card-popover{
    .ant-popover-inner-content {
        padding-top: 0;
    }
}
</style>
