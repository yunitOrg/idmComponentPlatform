<template>
    <div class="page-max-width my-page-container">
        <div class="my-index-page-top">
            <img :src="defaultBgImage" object-fit="cover" class="cover-bg" alt="封面加载失败" />
            <div class="edit-btn cursor-pointer"><svg-icon iconClass="camera" style="margin: 0 3px -3px 0; font-size: 18px"></svg-icon> 编辑封面图片</div>
        </div>
        <RouterView></RouterView>
    </div>
</template>

<script lang="ts" setup>
import { defaultBgImage } from '@/assets/images'
</script>

<style lang="scss" scoped>
.my-page-container{
    padding: 0 0 20px;
}
.my-index-page-top {
    position: relative;
    width: 100%;
    height: 240px;
    border-radius: 5px 5px 0 0;
    overflow: hidden;
    .cover-bg {
        position: absolute;
        width: 100%;
        height: 100%;
    }
    .edit-btn {
        position: absolute;
        top: 10px;
        right: 10px;
        color: rgba($color: #fff, $alpha: 0.8);
        z-index: 1;
        font-size: 12px;
        border: 1px solid rgba($color: #fff, $alpha: 0.8);
        border-radius: 50px;
        padding: 5px 10px;
    }
}
</style>
