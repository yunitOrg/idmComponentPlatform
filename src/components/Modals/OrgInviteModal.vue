<template>
    <a-modal
        width="660px"
        centered
        :visible="visible"
        :mask-closable="false"
        :title="null"
        :footer="null"
        :closable="false"
        :body-style="{ padding: '15px 30px' }"
    >
        <div class="text-center box-title">邀请成员</div>
        <div class="block">
            <div class="sub-title">方式一：站内邀请</div>
            <div class="flex">
                <AsyncSelect
                    v-model:value="state.userIds"
                    asyncSearch
                    mode="multiple"
                    :fieldNames="{label: 'nickname', value: 'id'}"
                    placeholder="请查询后选择"
                    :request="getUserList"
                />
                <a-button :disabled="!state.userIds || !state.userIds.length" :loading="state.loading" type="primary" style="margin-left: 10px;" @click="handleSendInvite">发送邀请</a-button>
            </div>
        </div>
        <div class="block">
            <div class="sub-title">方式二：分享链接</div>
            <a-input :value="state.url" readonly>
                <template #suffix>
                    <AButton type="link" size="small" @click.stop="handleCopyUrl">点击复制</AButton>
                </template>
            </a-input>
        </div>
        <div class="block">
            <div class="sub-title">方式三：分享二维码</div>
            <canvas id="org_invite_qrcode_canvas"></canvas>
            <div style="width: 150px;" class="text-center">
                <AButton type="link" size="small" @click.stop="handleDownloadQrcode">直接下载</AButton>
            </div>
        </div>
        <div class="text-center">
            <a-button @click="handleClose">关闭</a-button>
        </div>
    </a-modal>
</template>

<script lang="ts" setup>
import QRCode from 'qrcode'
import { copyToBoard } from '@/utils/copy'
import { shareCodeAes } from '@/utils/cipher'
import { message } from 'ant-design-vue'
import { useHomeCoreApi } from '@/apis'
const props = defineProps({
    visible: {
        type: Boolean,
        default: false
    },
    itemData: {
        type: Object,
        default: () => {}
    }
})
const state = reactive<{ [x: string]: any }>({
    userIds: [],
    url: '',
    loading: false
})
const emits = defineEmits(['update:visible'])

onUpdated(() => {
    state.url = `${window.location.protocol}//${window.location.host}/share?shareCode=${encodeURIComponent(shareCodeAes.encryptByAES(props.itemData.orgUserId))}`
    const canvas: any = document.getElementById('org_invite_qrcode_canvas')
    QRCode.toCanvas(canvas, state.url, {
        width: 150,
        height: 150,
        margin: 1
    })
})

const handleClose = () => {
    emits('update:visible', false)
}
const handleSendInvite = () => {
    state.loading = true
    useHomeCoreApi.requestSendInviteJoinOrg({ id: props.itemData.id, userIds: state.userIds?.join(',') }).then((res: any) => {
        state.loading = false
        if (res.success) {
            message.success('邀请成功！')
        } else {
            message.error(res.message || '邀请失败！')
        }
    })
}
const handleCopyUrl = () => {
    copyToBoard(state.url)
    message.success('复制成功！')
}
const handleDownloadQrcode = () => {
    const canvas: any = document.getElementById('org_invite_qrcode_canvas')
    const imgurl = canvas.toDataURL('image/jpeg')
    const a = document.createElement('a')
    a.href = imgurl
    a.download = '二维码' // 图片名称
    a.click()
}
const getUserList = async (text: string) => {
    return await useHomeCoreApi.requestSearchUser({ searchTxt: text })
}
</script>
<style lang="scss" scoped>
.box-title {
    font-size: 20px;
    font-weight: 600;
    margin: 0 0 30px 0;
}
.block {
  margin-bottom: 30px;
  .sub-title {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 10px;
  }
}
</style>
