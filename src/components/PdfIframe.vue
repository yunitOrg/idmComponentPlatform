<template>
    <iframe id="pdfjs" name="pdfjs" :src="`static/pdfjs/web/viewer.html?file=${pdfUrl}`"></iframe>
</template>

<script lang="ts" setup>
defineProps({
    pdfUrl: {
        type: String,
        default: ''
    }
})
</script>

<style lang="scss" scoped>
#pdfjs {
    width: 100%;
    min-height: 90vh;
    border: 0;
    padding-bottom: 14px;
}
</style>
