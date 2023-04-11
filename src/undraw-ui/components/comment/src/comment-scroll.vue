<template>
    <div class="u-comment-scroll">
        <div v-infinite-scroll="load" :infinite-scroll-disabled="disabled" infinite-scroll-distance="2">
            <slot></slot>
            <div class="scroll-btn">
                <a-button v-if="!active" type="link" :underline="false" @click="active = !active">加载更多</a-button>
                <p v-if="loading">加载中...</p>
                <p v-if="noMore">没有更多了</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { debounce } from '@/undraw-ui/util'

defineOptions({
    name: 'UCommentScroll'
})

interface Props {
    disable: boolean
    // show: boolean
}

const props = defineProps<Props>()

// 是否开启加载
const loading = ref(false)
// 是否使用
const active = ref(false)

const emit = defineEmits<{
    (e: 'more'): void
}>()

const noMore = computed(() => active.value && props.disable)
const disabled = computed(() => !active.value || loading.value || noMore.value)

const _debounce = debounce(() => {
    emit('more')
    loading.value = false
}, 500)

const load = () => {
    loading.value = true
    _debounce()
}
</script>

<style lang="scss" scoped>
.u-comment-scroll {
    position: relative;
    .scroll-btn {
        position: absolute;
        left: 50%;
        transform: translate(-50%, -50%);
        bottom: 10px;
    }
}
</style>
