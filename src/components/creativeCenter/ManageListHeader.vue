<template>
    <div class="manage-list-header">
        <div class="title">
            {{ props.title }}
        </div>
        <div class="button">
            <a-button type="primary" shape="round" @click="props.onBtnClick">{{ props.btnText }}</a-button>
        </div>
    </div>
</template>
<script lang="ts" setup>
const props = defineProps({
    title: {
        type: String,
        default: ''
    },
    btnText: {
        type: String,
        default: ''
    },
    onBtnClick: {
        type: Function,
        default() {
            return () => {}
        }
    }
})
</script>
<style lang="scss" scoped>
.manage-list-header {
  border-bottom: 1px solid rgba(230, 230, 230, 1);
  padding: 0 20px;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .title {
    font-size: 16px;
    font-weight: bold;
  }
}
</style>
