<template>
    <div class="org-manage-base-box">
        <div class="item">
            <span style="margin-right: 10px;">组织头像：</span>
            <div class="org-photo">
                <AImage style="height: 100%;" :preview="false" :width="70" :height="70" :src="getImagePath(data.orgphoto)"></AImage>
                <div class="org-photo-button flex_center">
                    <a-upload name="file" :showUploadList="false" :beforeUpload="beforeUpload" @change="(e: any) => handleChange(e,'orgphoto')">
                        <div class="icon_box pointer"><camera-outlined /></div>
                        <div class="upload_button pointer">修改</div>
                    </a-upload>
                </div>
            </div>
        </div>
        <div class="item">
            <span style="margin-right: 10px;">组织名称：</span>
            <a-input :value="data.orgname" placeholder="请输入组织名称" @change="(e: any) => handleChange(e, 'orgname')" />
        </div>
        <div class="item">
            <span style="margin-right: 10px;">组织简介：</span>
            <a-textarea :value="data.introduce" placeholder="请输入组织简介" @change="(e: any) => handleChange(e, 'introduce')" />
        </div>
        <div class="item">
            <span style="margin-right: 10px;">企业名称：</span>
            <a-input :value="data.companyName" placeholder="请输入企业名称" @change="(e: any) => handleChange(e, 'companyName')" />
        </div>
    </div>
</template>
<script lang="ts" setup>
import { componentPublishApi } from '@/apis'
import { getImagePath } from '@/utils'
import { message } from 'ant-design-vue'
import { CameraOutlined } from '@ant-design/icons-vue'
const props = defineProps({
    data: {
        type: Object,
        default: () => ({})
    }
})
const emit = defineEmits(['update:data'])
const handleChange = (e: any, key: string) => {
    if (key === 'orgphoto') {
        const params = {
            file: e.file,
            data: {
                upFileType: 'image'
            }
        }
        componentPublishApi.requestUploadDist(params).then((res) => {
            if (res.success) {
                emit('update:data', { ...props.data, [key]: res.result.filePath })
            } else {
                message.error(res.message)
            }
        }).catch((err) => {
            console.log(err)
        })
    } else {
        emit('update:data', { ...props.data, [key]: e.target?.value })
    }
}
const beforeUpload = () => {
    return false
}
</script>

<style lang="scss" scoped>
.org-manage-base-box {
    .org-photo{
        width: 70px;
        height: 70px;
        border-radius: 50%;
        overflow: hidden;
        position: relative;
        img{
            width: 144px;
            height: 144px;
            object-fit: cover;
            border-radius: 50%;
        }
        .org-photo-button{
            opacity: 0;
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0,0,0,0.3);
            .upload_button{
                color: white;
                font-size: 14px;
            }
            .icon_box{
                text-align: center;
                color: white;
                font-size: 18px;
            }
        }
        &:hover .org-photo-button {
            opacity: 1;
        }
    }
  // margin-top: 8px;
  .item {
    display: flex;
    align-items: center;
    :deep(.ant-input) {
      max-width: 75%;
    }
    &:not(:last-child) {
      margin-bottom: 25px;
    }
  }
}
</style>
