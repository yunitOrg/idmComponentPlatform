<template>
    <INoPermission :text="text"></INoPermission>
</template>
<script lang="ts" setup>
const route = useRoute()

const text = computed(() => {
    return route.params.pathMatch + '页面找不到了！'
})

</script>
