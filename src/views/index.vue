<template>
    <IHeadBar :nav-list="pageConfig.headNavList"></IHeadBar>
    <div class="page-min-height">
        <router-view v-slot="{ Component }">
            <component :is="Component" :key="$route.name" />
        </router-view>
    </div>
    <IPageFooter></IPageFooter>
    <!-- 登录弹框 -->
    <loginAndRegModal v-model:visible="userStore.isVisibleLoginModal"></loginAndRegModal>
    <!-- 回到顶部 -->
    <a-back-top :duration="50" />
</template>
<script lang="ts" setup>
import configObject from '@/settings/indexPageConfig'
import { useUserStore } from '@/store/modules/user'
import { useAppStore } from '@/store/modules/app'
import { setSession } from '@/utils/cache/sessionStorage'
const userStore = useUserStore()
const appStore = useAppStore()
const pageConfig = reactive(configObject)
onMounted(() => {
    appStore.setAppMounted(true)
    setSession('isAppMounted', 1)
})
</script>
