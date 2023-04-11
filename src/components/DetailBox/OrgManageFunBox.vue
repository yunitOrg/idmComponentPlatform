<template>
    <div class="org-manage-fun-box">
        <div class="item">
            <span style="margin-right: 25px;">组织是否公开：</span>
            <a-radio-group :value="data.rolePublic" :options="rolePublicOptions" @change="(e:RadioChangeEvent) => handleChange(e, 'rolePublic')" />
        </div>
        <div class="item">
            <span style="margin-right: 25px;">邀请成员限制：</span>
            <a-radio-group :value="data.roleInvitation" :options="roleInvitationOptions" @change="(e:RadioChangeEvent) => handleChange(e, 'roleInvitation')" />
        </div>
        <div class="item">
            <span style="margin-right: 25px;">创建话题权限：</span>
            <a-radio-group :value="data.roleTopic" :options="roleTopicOptions" @change="(e:RadioChangeEvent) => handleChange(e, 'roleTopic')" />
        </div>
        <div class="item">
            <span style="margin-right: 25px;">加入审核设置：</span>
            <a-radio-group :value="data.joinCheck" :options="joinCheckOptions" @change="(e:RadioChangeEvent) => handleChange(e, 'joinCheck')" />
        </div>
    </div>
</template>
<script lang="ts" setup>
import { RadioChangeEvent } from 'ant-design-vue'
import { roleInvitationOptions, rolePublicOptions, roleTopicOptions, joinCheckOptions } from './mock/mockData'
const props = defineProps({
    data: {
        type: Object,
        default: () => ({})
    }
})
const emit = defineEmits(['update:data'])
const handleChange = (e: RadioChangeEvent, key: string) => {
    emit('update:data', { ...props.data, [key]: e.target?.value })
}
</script>

<style lang="scss" scoped>
.org-manage-fun-box {
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
