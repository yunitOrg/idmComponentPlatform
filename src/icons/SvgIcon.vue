<template>
    <div v-if="isExternal" :style="styleExternalIcon" class="svg-external-icon svg-icon" />
    <svg v-else :class="svgClass" aria-hidden="true">
        <use :xlink:href="iconName" />
    </svg>
</template>

<script lang="ts" setup>
const props = defineProps({
    iconClass: {
        type: String,
        required: true
    },
    className: {
        type: String,
        default: ''
    },
    color: {
        type: String,
        default: '#333'
    }
})

const iconName = computed(() => {
    return `#icon-svg-${props.iconClass}`
})
const svgClass = computed(() => {
    if (props.className) {
        return `svg-icon ${props.className}`
    }
    return 'svg-icon'
})

const styleExternalIcon = computed(() => {
    return {
        mask: `url(${props.iconClass}) no-repeat 50% 50%`,
        '-webkit-mask': `url(${props.iconClass}) no-repeat 50% 50%`
    }
})

const isExternal = computed(() => {
    return /^(https?:|mailto:|tel:)/.test(props.iconClass)
})
</script>

<style scoped>
.svg-icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
}

.svg-external-icon {
    background-color: currentColor;
    mask-size: cover !important;
    display: inline-block;
}
</style>
