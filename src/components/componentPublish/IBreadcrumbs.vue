<template>
    <div class="idm-breadcrumbs flex justify-between">
        <div class="idm-breadcrumbs-main flex">
            <div v-for="(item, index) in list" :key="index" class="crumb-item">
                <a :href="item.url">{{ item.name }}</a> <span v-if="index !== list.length - 1">></span>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
defineProps({
    list: {
        type: Array<{ name: string; url: string }>,
        default: () => [
            {
                name: '首页'
            }
        ]
    }
})
</script>

<style lang="scss" scoped>
.idm-breadcrumbs {
    color: #ababab;
    .idm-breadcrumbs-main {
        span {
            margin: 4px;
        }
        a {
            color: #ababab;
        }
    }
}
</style>
