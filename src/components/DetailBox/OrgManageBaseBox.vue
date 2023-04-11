<template>
    <div class="org-manage-base-box">
        <!-- <div class="item">
            <span style="margin-right: 25px;">组织头像：</span>
            <a-radio-group :value="data.rolePublic" :options="rolePublicOptions" @change="(e: Event) => handleChange(e, 'rolePublic')" />
        </div> -->
        <div class="item">
            <span style="margin-right: 25px;">组织名称：</span>
            <a-input :value="data.roleInvitation" placeholder="请输入组织名称" @change="(e: ChangeEvent) => handleChange(e, 'roleInvitation')" />
        </div>
        <div class="item">
            <span style="margin-right: 25px;">组织简介：</span>
            <a-textarea :value="data.roleTopic" placeholder="请输入组织简介" @change="(e: ChangeEvent) => handleChange(e, 'roleTopic')" />
        </div>
    </div>
</template>
<script lang="ts" setup>
import { ChangeEvent } from 'ant-design-vue/es/_util/EventInterface'
const props = defineProps({
    data: {
        type: Object,
        default: () => ({})
    }
})
const emit = defineEmits(['update:data'])
const handleChange = (e: ChangeEvent, key: string) => {
    emit('update:data', { ...props.data, [key]: e.target?.value })
}
</script>

<style lang="scss" scoped>
.org-manage-base-box {
  // margin-top: 8px;
  .item {
    display: flex;
    :deep(.ant-radio-group) {
      flex-grow: 1;
      .ant-radio-wrapper {
        min-width: 20%;
      }
    }
    &:not(:last-child) {
      margin-bottom: 25px;
    }
  }
}
</style>
