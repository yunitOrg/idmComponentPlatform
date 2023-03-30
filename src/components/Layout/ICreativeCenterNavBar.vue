<template>
    <a-menu
        class="creative-center-nav-bar"
        :selectedKeys="selectedKeys"
        mode="inline"
        :open-keys="openKeys"
        @click="handleClick"
    >
        <template v-for="item in navList" :key="item.routeName">
            <a-sub-menu v-if="item.children && item.children.length" :key="item.key" :icon="item.icon" :title="item.title">
                <a-menu-item v-for="i in item.children" :key="i.routeName" :icon="i.icon" :title="i.title">{{ i.title }}</a-menu-item>
            </a-sub-menu>
            <a-menu-item v-else :key="item.routeName" style="font-weight: 600;" :icon="item.icon" :title="item.title">{{ item.title }}</a-menu-item>
        </template>
    </a-menu>
</template>

<script lang="ts" setup>
import type { MenuProps } from 'ant-design-vue'
const props = defineProps({
    navList: {
        type: Array<MenuItem>,
        default: () => []
    }
})
const selectedKeys = ref<string[]>(['index-creativeCenter'])
const openKeys = computed(() => props.navList.map((item :any) => item.key))
const route = useRoute()
const router = useRouter()
watch(
    () => route.name,
    (newValue) => {
        selectedKeys.value = [newValue as string]
    },
    { immediate: true, deep: true }
)
const handleClick: MenuProps['onClick'] = (e: any) => {
    if (e.key && e.key.startsWith('/')) {
        return window.open(e.key, '_blank')
    } else if (e.key) {
        // selectedKeys.value = [e.key as string]
        router.push({
            name: e.key
        })
    }
}
</script>

<style lang="scss" scoped>
.creative-center-nav-bar {
  font-size: 15px;
  padding: 10px 15px;
  :deep(.ant-menu-sub) {
    background-color: transparent;
  }
  :deep(.ant-menu-item) {
    color: #5f5f5f;
    border-radius: 4px;
    background-color: transparent;
    &:hover {
      color: #1890ff;
      transition: color .1s;
    }
  }
  :deep(.ant-menu-submenu-title) {
    color: #5f5f5f;
    font-weight: 600;
  }
  :deep(.ant-menu-item-icon) {
    font-size: 18px;
    color: inherit;
    font-weight: 600;
  }
  :deep(.ant-menu-submenu-arrow) {
    color: #5f5f5f !important;
  }
  :deep(.ant-menu-item-selected) {
    background-color: #e6f7ff !important;
    &::after {
      display: none;
    }
    &::before {
      display: none;
    }
  }
  :deep(.ant-menu-item-active) {
    background-color: unset;
  }
}
</style>
