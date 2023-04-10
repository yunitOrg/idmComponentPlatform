<template>
    <div class="org-manage-fun-box">
        <div class="item">
            邀请成员限制：
            <a-radio-group :value="data.roleInvitation" :options="roleInvitationOptions" />
        </div>
        <div class="item">
            组织是否公开：
            <a-radio-group :value="data.rolePublic" :options="rolePublicOptions" />
        </div>
        <div class="item">
            创建话题权限：
            <a-radio-group :value="data.roleTopic" :options="roleTopicOptions" />
        </div>
        <div class="item">
            加入审核设置：
            <a-radio-group :value="data.joinCheck" :options="joinCheckOptions" />
        </div>
    </div>
</template>
<script lang="ts" setup>
import { roleInvitationOptions, rolePublicOptions, roleTopicOptions, joinCheckOptions } from './mock/mockData'
defineProps({
    data: {
        type: Object,
        default: () => ({})
    }
})
</script>

<style lang="scss" scoped>
.org-manage-fun-box {
  margin-top: 8px;
  .item {
    display: flex;
    :deep(.ant-radio-group) {
      flex-grow: 1;
      .ant-radio-wrapper {
        min-width: 20%;
      }
    }
    &:not(:last-child) {
      margin-bottom: 24px;
    }
  }
}
</style>
