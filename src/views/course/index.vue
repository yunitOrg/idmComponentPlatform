<template>
    <div class="cp-upload">
        <div class="course-type-title">请选择教程类型</div>
        <div class="course-type-content">
            <div v-for="item in list" :key="item.id" class="course-item" @click="itemClick(item)">
                <span class="course-icon"><svg-icon :iconClass="item.id"></svg-icon></span>
                <div>{{ item.name }}</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const list = ref([
    {
        name: '视频教程',
        id: 'video'
    },
    {
        name: '图文教程',
        id: 'imageText'
    },
    {
        name: '电子书教程',
        id: 'ebook'
    }
])

const router = useRouter()
function itemClick(item: any) {
    router.push({
        name: `index-coursePublish-${item.id}`
    })
}
</script>

<style lang="scss" scoped>
.cp-upload {
    margin: 20px auto;
    background: #fff;
    border-radius: 5px;
    box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.06);
    padding: 40px;
    width: 960px;
    .course-type-title {
        text-align: center;
        font-size: 24px;
        margin-bottom: 40px;
    }

    .course-type-content {
        display: flex;
        justify-content: space-around;
        .course-item {
            text-align: center;
            cursor: pointer;
            font-size: 20px;
            .course-icon {
                font-size: 60px;
            }
            &:first-child {
                color: #3f51b5;
                .svg-icon {
                    transform: scale(1.1);
                }
            }
            &:nth-child(2) {
                color: #ff9800;
            }
            &:last-child {
                color: #009688;
                .svg-icon {
                    transform: scale(1.1);
                }
            }
        }
    }
}
</style>
