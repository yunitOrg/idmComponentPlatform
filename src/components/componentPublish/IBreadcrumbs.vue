<template>
    <div class="idm-breadcrumbs flex justify-between">
        <div class="idm-breadcrumbs-main flex">
            <div v-for="(item, index) in list" :key="index" class="crumb-item">
                <a :href="item.url">{{ item.name }}</a> <span v-if="index !== list.length - 1">></span>
            </div>
        </div>
        <div v-if="column" class="video-info-column">
            <img :src="getImagePath(column.imgUrl) || defaultColumn" /> <span>{{ column.title }}</span>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { getImagePath } from '@/utils'
import { defaultColumn } from '@/assets/images'
defineProps({
    list: {
        type: Array<{ name: string; url: string }>,
        default: () => [
            {
                name: '首页'
            }
        ]
    },
    column: {
        type: Object,
        default: () => {}
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
    .video-info-column {
        img {
            width: 24px;
            margin-right: 4px;
            margin-top: -3px;
        }
    }
}
</style>
