<template>
    <div class="flex justify-center align-center">
        <svg-icon iconClass="no-permission" className="no-permission-icon"></svg-icon>
    </div>
    <div class="text-center no-permission-text">{{ text }}</div>
    <div class="text-center" style="margin: 20px 0">
        <a-button @click="router.go(-1)">返回上一页</a-button>
        <a-button type="primary" style="margin: 0 0 0 20px" @click="router.push({ name: 'index' })">回到首页</a-button>
    </div>
</template>

<script lang="ts" setup>
defineProps({
    text: {
        type: String,
        default: '很遗憾，您没有权限访问'
    }
})
const router = useRouter()
</script>

<style lang="scss" scoped>
.no-permission-icon {
    font-size: 350px;
}
.no-permission-text {
    font-size: 16px;
}
</style>
