<template>
    <div class="suspense-container flex flex-direction-column justify-center align-center">
        <AImage :preview="false" :width="120" :height="120" class="idm-loading-image" :src="logo1"></AImage>
        <div class="app-loading-dots">
            <span class="dot dot-spin"><i></i><i></i><i></i><i></i></span>
        </div>
        <div class="text-tip">云IT <span style="font-weight: 800;">·</span> 组件共享平台</div>
    </div>
</template>

<script lang="ts" setup>
import { logo1 } from '@/assets/images'
</script>

<style lang="scss" scoped>
.suspense-container {
    width: 100%;
    height: 100vh;
    background: #fff;
    .text-tip {
        color: #333;
        margin: 10px 0 0 0;
        font-size: 20px;
        font-weight: 600;
    }

    .app-loading .dots {
        display: flex;
        padding: 98px;
        justify-content: center;
        align-items: center;
    }
    .dot {
        position: relative;
        display: inline-block;
        width: 48px;
        height: 48px;
        margin-top: 30px;
        font-size: 32px;
        transform: rotate(45deg);
        box-sizing: border-box;
        animation: antRotate 1.2s infinite linear;
    }

    .dot i {
        position: absolute;
        display: block;
        width: 20px;
        height: 20px;
        background-color: #0065cc;
        border-radius: 100%;
        opacity: 0.3;
        transform: scale(0.75);
        animation: antSpinMove 1s infinite linear alternate;
        transform-origin: 50% 50%;
    }

    .dot i:nth-child(1) {
        top: 0;
        left: 0;
    }

    .dot i:nth-child(2) {
        top: 0;
        right: 0;
        -webkit-animation-delay: 0.4s;
        animation-delay: 0.4s;
    }

    .dot i:nth-child(3) {
        right: 0;
        bottom: 0;
        -webkit-animation-delay: 0.8s;
        animation-delay: 0.8s;
    }

    .dot i:nth-child(4) {
        bottom: 0;
        left: 0;
        -webkit-animation-delay: 1.2s;
        animation-delay: 1.2s;
    }
    @keyframes antRotate {
        to {
            -webkit-transform: rotate(405deg);
            transform: rotate(405deg);
        }
    }
    @-webkit-keyframes antRotate {
        to {
            -webkit-transform: rotate(405deg);
            transform: rotate(405deg);
        }
    }
    @keyframes antSpinMove {
        to {
            opacity: 1;
        }
    }
    @-webkit-keyframes antSpinMove {
        to {
            opacity: 1;
        }
    }
}
</style>
