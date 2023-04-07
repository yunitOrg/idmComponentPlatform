<template>
    <!-- 组织页面列表 -->
    <div class="org-member-box idm-component-common-box">
        <div class="flex">
            <div class="image">
                <AImage style="border-radius: 50%;" :preview="false" :width="70" :height="70" :src="getImagePath(data.userphoto)"></AImage>
                <div class="gender">
                    <AImage v-if="data.gender === 1" :width="18" :preview="false" :src="memberMale"></AImage>
                    <AImage v-else-if="data.gender === 0" :width="18" :preview="false" :src="memberfemale"></AImage>
                </div>
            </div>
            <div class="flex-1 item">
                <div style="height: 100%;" class="flex flex-direction-column justify-around">
                    <div class="name text-o-e">{{ data.nickname }}</div>
                    <div class="job text-o-e">{{ job ? job.itemValue : '' }}</div>
                    <div class="like">获赞 <span style="color: #333;">{{ data.likeTotal }}</span></div>
                </div>
            </div>
            <div class="flex-1 item">
                <div style="height: 100%;" class="flex flex-direction-column justify-around text-center">
                    <div class="time">
                        <div>加入时间</div>
                        <div style="color: #333;">{{ data.createTime }}</div>
                    </div>
                </div>
            </div>
            <div class="flex-1 item">
                <div style="height: 100%;" class="flex flex-direction-column justify-around text-center">
                    <a-popover v-if="allowChangeType" v-model:visible="showTypePopover" overlayClassName="org-member-box-popover-content" trigger="click" placement="bottom">
                        <template #content>
                            <template
                                v-for="value, key in orgMemberType"
                                :key="key"
                            >
                                <div
                                    v-if="+key !== 1"
                                    :style="{ cursor: 'pointer', padding: '0 5px', 'margin-bottom': '10px', color: data.type === +key ? '#1890ff' : '#666'}"
                                    @click.stop="handleChangeType(+key)">
                                    {{ value }}
                                </div>
                            </template>
                        </template>
                        <a-button v-if="allowChangeType" type="link" size="small">{{ orgMemberType[data.type as number] }}</a-button>
                    </a-popover>
                    <div v-else class="type" style="color: #333;">{{ orgMemberType[data.type as number] }}</div>
                </div>
            </div>
            <div class="flex-1 item">
                <div style="height: 100%;" class="flex flex-direction-column justify-around text-center">
                    <div>
                        <div>{{ data.joinType === 0 ? '受邀加入' : '申请加入' }}</div>
                        <a-popconfirm
                            v-if="allowCheck"
                            title="批准此成员加入组织吗？"
                            ok-text="通过"
                            cancel-text="拒绝"
                            placement="bottom"
                            @confirm="emits('handleCheck', data, 1)"
                            @cancel="emits('handleCheck', data, 2)"
                        >
                            <a-button v-if="allowCheck" type="link" size="small">{{ orgMemberCheckStatus[data.checkStatus as number] }}</a-button>
                        </a-popconfirm>
                        <div v-else class="status" style="color: #333;">{{ data.joinType === 0 ? orgMemberInviteStatus[data.inviteStatus as number] : orgMemberCheckStatus[data.checkStatus as number] }}</div>
                    </div>
                </div>
            </div>
            <div class="item">
                <div style="height: 100%;" class="flex align-center">
                    <a-button v-if="showLetter" type="link" size="small" disabled>私信</a-button>
                    <a-popconfirm
                        v-if="showDelete"
                        title="确定要移除当前成员吗？"
                        ok-text="确认"
                        cancel-text="取消"
                        placement="bottom"
                        @confirm="emits('handleDelete', data)"
                    >
                        <a-button v-if="showDelete" type="link" size="small">移除</a-button>
                    </a-popconfirm>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { getImagePath } from '@/utils'
import { memberMale, memberfemale } from '@/assets/images'
import { orgMemberType, orgMemberInviteStatus, orgMemberCheckStatus } from './mock/mockData'
import { useUserStore } from '@/store/modules/user'
const userStore = useUserStore()
const props = defineProps({
    data: {
        type: Object,
        default: () => ({})
    },
    jobs: {
        type: Array,
        default: () => []
    },
    userType: {
        type: Number,
        default: 0
    }
})
const showTypePopover = ref(false)
const emits = defineEmits(['handleDelete', 'handleCheck', 'handleChangeType'])
const job: any = computed(() => props.jobs.find((job: any) => job.id === props.data.businessId))
const showDelete: ComputedRef<boolean> = computed(() => {
    if (props.data.type === 1 || props.userType === 0 || props.data.userId === userStore.userInfo?.id) {
        return false
    }
    return true
})
const allowChangeType: ComputedRef<boolean> = computed(() => {
    if (props.data.type !== 1 && props.userType !== 0 && props.data.userId !== userStore.userInfo?.id) {
        return true
    }
    return false
})
const allowCheck: ComputedRef<boolean> = computed(() => {
    if (props.data.joinType === 1 &&
      props.data.checkStatus !== 1 &&
      props.userType !== 0 &&
      props.data.userId !== userStore.userInfo?.id
    ) {
        return true
    }
    return false
})
const showLetter: ComputedRef<boolean> = computed(() => props.data.userId !== userStore.userInfo?.id)
const handleChangeType = (type: number) => {
    showTypePopover.value = false
    emits('handleChangeType', props.data, type)
}
</script>

<style lang="scss">
.org-member-box {
  padding: 15px 0;
  margin: 0 10px;
  border-bottom: 1px solid rgb(230, 230, 230);
  color: #999;
  .image {
    padding: 0 10px;
    position: relative;
    .gender {
      line-height: 1;
      overflow: hidden;
      border-radius: 50%;
      position: absolute;
      right: 8px;
      bottom: 4px;
      :deep(img) {
        display: block;
      }
    }
  }
  .item {
    padding: 0 10px;
    width: 100px;
    flex-shrink: 1;
    .name {
      font-weight: bold;
      color: #333;
    }
  }
}
.org-member-box-popover-content {
  .ant-popover-inner-content {
    padding: 12px 16px 2px 16px;
    div {
      text-align: center;
      font-size: 14px;
      &:hover {
        opacity: 0.8;
        transition: opacity .3s;
      }
    }
  }
}
</style>
