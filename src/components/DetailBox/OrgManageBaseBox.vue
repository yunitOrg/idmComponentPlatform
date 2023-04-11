<template>
    <div class="org-manage-base-box">
        <div class="item">
            <span style="margin-right: 10px;">组织头像：</span>
            <AImage style="border-radius: 50%;width: 100%;height: 100%;" :preview="false" :width="70" :height="70" :src="getImagePath(data.orgphoto)"></AImage>
        </div>
        <div class="item">
            <span style="margin-right: 10px;">组织名称：</span>
            <a-input :value="data.orgname" placeholder="请输入组织名称" @change="(e: ChangeEvent) => handleChange(e, 'orgname')" />
        </div>
        <div class="item">
            <span style="margin-right: 10px;">组织简介：</span>
            <a-textarea :value="data.introduce" placeholder="请输入组织简介" @change="(e: ChangeEvent) => handleChange(e, 'introduce')" />
        </div>
        <div class="item">
            <span style="margin-right: 10px;">企业名称：</span>
            <a-input :value="data.companyName" placeholder="请输入企业名称" @change="(e: ChangeEvent) => handleChange(e, 'companyName')" />
        </div>
    </div>
</template>
<script lang="ts" setup>
import { getImagePath } from '@/utils'
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
    :deep(.ant-input) {
      max-width: 75%;
    }
    &:not(:last-child) {
      margin-bottom: 25px;
    }
  }
}
</style>
