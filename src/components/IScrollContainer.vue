<template>
    <div class="switch-tab">
        <div class="switch-tab-left" @click="leftClick">
            <svg-icon iconClass="arrowLeft"></svg-icon>
        </div>
        <!-- 显示的区域 -->
        <div class="switch-tab-wrap">
            <!-- 滑动的区域 -->
            <div class="switch-tab-scroll-content" :class="id">
                <slot />
            </div>
        </div>
        <div class="switch-tab-right" @click="rightClick">
            <svg-icon iconClass="arrowLeft"></svg-icon>
        </div>
    </div>
</template>
<script lang="ts" setup>
const props = defineProps({
    moveWidth: {
        // 左右移动基础值
        type: Number,
        default: 100
    },
    listLength: {
        type: Number,
        default: 0
    },
    limitLength: {
        type: Number,
        default: 3
    },
    id: {
        // 唯一性
        type: String,
        default: 'switch-scroll'
    }
})

const leftClick = () => {
    if (props.listLength < props.limitLength) return
    const dom: any = document.querySelector(`.${props.id}`)
    if (dom!.offsetLeft >= -props.moveWidth) {
        dom.style.left = '0px'
    } else {
        dom.style.left = `${dom.offsetLeft + props.moveWidth}px`
    }
}
const rightClick = () => {
    if (props.listLength < props.limitLength) return
    const dom: any = document.querySelector(`.${props.id}`)
    const domWrap: any = document.querySelector('.switch-tab-wrap')
    if (dom.scrollWidth + dom.offsetLeft - props.moveWidth <= domWrap.offsetWidth) {
        dom.style.left = `${domWrap.offsetWidth - dom.scrollWidth}px`
    } else {
        dom.style.left = `${dom.offsetLeft - props.moveWidth}px`
    }
}
</script>
<style lang="scss" scoped>
.switch-tab {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    &-left,
    &-right {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 82px;
        // background: rgba(52, 118, 255, 0.04);
        border-radius: 2px;
        cursor: pointer;
        opacity: 1;
        font-size: 60px;
    }
    &-right {
        transform: rotate(180deg);
    }
    &-wrap {
        position: relative;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        width: calc(100% - 100px);
        height: 100%;
        padding: 0 10px;
        overflow: hidden;
        transition: all 0.5s;
    }
    &-scroll-content {
        position: absolute;
        left: 0px;
        display: flex;
        align-items: center;
        width: auto;
        transition: all 0.5s;
    }
}
</style>
