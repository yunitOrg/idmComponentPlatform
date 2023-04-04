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
            <div style="width: 200px;" class="text-center">
                <AButton type="link" size="small" @click.stop="handleDownloadQrcode">下载二维码</AButton>
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
import { AesEncryption } from '@/utils/cipher'
import { message } from 'ant-design-vue'
import { useHomeCoreApi } from '@/apis'
const aesEncryption = new AesEncryption()
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
    a.download = `${props.itemData.orgname}邀请二维码` // 图片名称
    a.click()
}
const getUserList = async (text: string) => {
    return await useHomeCoreApi.requestSearchUser({ searchTxt: text })
}

const setFont = (ctx: any) => {
    ctx.font = 'normal 15px Arial'
    ctx.textBaseline = 'top' // 设置绘制文本时的文本基线。
    ctx.textAlign = 'left'
    ctx.fillStyle = '#333'
}

const handleQrcode = () => {
    const qrCodeWidth = 160
    const qrCodeHeight = 160
    const width = 200
    const padding = 10
    const steps = 20
    const canvas: any = document.getElementById('org_invite_qrcode_canvas')
    QRCode.toDataURL(state.url, {
        width: qrCodeWidth,
        height: qrCodeHeight,
        margin: 1
    }).then((url: string) => {
        // 画二维码里的logo// 在canvas里进行拼接
        const ctx = canvas.getContext('2d')
        const image = new Image()
        image.src = url
        new Promise<HTMLImageElement>((resolve) => {
            image.onload = () => {
                resolve(image)
            }
        }).then((img: HTMLImageElement) => {
            const text = `${props.itemData.orgname}`
            setFont(ctx)
            const keyStrArr = toFormateStr(ctx, text, width - padding * 2, padding, qrCodeHeight + padding * 2, steps)
            const height = qrCodeHeight + padding * 3 + steps * keyStrArr.length
            canvas.width = width
            canvas.height = height
            ctx.rect(0, 0, width, height)
            ctx.fillStyle = '#fff'
            ctx.fill()
            ctx.drawImage(img, (width - qrCodeWidth) / 2, padding, qrCodeWidth, qrCodeHeight)
            setFont(ctx)
            fillText(ctx, keyStrArr)
        })
    }).catch((err: Error) => {
        console.error(err)
    })
}

const toFormateStr = (ctx: any, str: string, drawWidth: number, startX: number, startY: number, steps: number) => {
    let start = 0
    let keyStr = ''
    let startpoint = startY
    const keyStrArr = []
    for (let i = 0; i < str.length; i++) {
        keyStr = str.slice(start, i + 1)
        if (ctx.measureText(keyStr).width > drawWidth) {
            keyStr = str.slice(start, i)
            keyStrArr.push({ str: keyStr, strWidth: ctx.measureText(keyStr).width, drawWidth, startX, startpoint })
            // ctx.fillText(keyStr, (drawWidth - ctx.measureText(keyStr).width) / 2 + startX, startpoint)
            start = i
            startpoint = startpoint + steps
        } else if (i === str.length - 1) {
            keyStrArr.push({ str: keyStr, strWidth: ctx.measureText(keyStr).width, drawWidth, startX, startpoint })
        }
    }
    return keyStrArr
}

const fillText = (ctx, arr: any) => {
    arr.forEach((item: any) => {
        ctx.fillText(item.str, (item.drawWidth - item.strWidth) / 2 + item.startX, item.startpoint)
    })
}

watch(() => props.visible, () => {
    if (props.visible) {
        state.userIds = []
        state.url = `${window.location.protocol}//${window.location.host}/share?shareCode=${aesEncryption.encryptByAES(props.itemData.orgUserId)}`
        nextTick(() => handleQrcode())
    }
}, { immediate: true, deep: true })
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
