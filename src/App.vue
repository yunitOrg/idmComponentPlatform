<template>
    <AConfigProvider :locale="zhCN">
        <RouterView v-if="isAlive"></RouterView>
    </AConfigProvider>
</template>

<script lang="ts" setup>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
// const route = useRoute()
// const router = useRouter()

dayjs.locale('zh-cn')
const isAlive = ref(true)
function reload() {
    isAlive.value = false
    nextTick(() => {
        isAlive.value = true
    })
}

provide('reload', reload)
</script>

<style lang="scss">
@import './styles/reset.css';
@import './styles/flex.css';
@import './styles/common.css';
@import './styles/layout.scss';
@import './styles/antd.scss';
body {
    background: rgb(247, 248, 250) !important;
}
.page-min-height {
    min-height: calc(100vh - 280px);
}
.bg-white {
    background: #fff;
}
.idm-component-common-box {
    border-radius: 3px;
    background-color: #fff;
}
.common-scrollbar_style {
    &::-webkit-scrollbar {
        width: 3px;
        height: 3px;
    }
    &::-webkit-scrollbar-thumb {
        min-height: 28px;
        border-radius: 4px;
        background-color: #cccccc;
    }
    &::-webkit-scrollbar-track-piece,
    &::-webkit-scrollbar-corner {
        background-color: transparent;
    }
}
</style>
