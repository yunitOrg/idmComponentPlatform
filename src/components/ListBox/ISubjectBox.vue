<template>
    <div class="idm-component-subject-box cursor-pointer" @click="propData.onPreviewComponentClick">
        <div class="flex justify-between align-center">
            <div>
                <div class="item-title flex justify-start align-center text-o-e-1">
                    <span>{{ componentProps.type=='platform'?'平台': ((componentProps.type=='product'?'产品':'项目')+' / '+componentProps.title) }}</span>
                    <label v-if="componentProps.istop">置顶</label>
                </div>
                <div class="item-subtitle text-o-e-1">
                    {{ componentProps.remark || '暂无导语' }}
                </div>
                <div class="item-footerTitle flex justify-start">
                    <div style="width:120px">{{ componentProps.readNumber }} 阅读</div>
                    <div class="text-o-e-1">创建人：{{ componentProps.userNickname }}</div>
                </div>
            </div>
            <a-avatar :size="80" shape="square" :src="getImagePath(componentProps.coverPath) || defaultSettings.userphoto" />
        </div>
    </div>
</template>
<script lang="ts" setup>
import { IComponentPackageData } from './mock/mockData'
import { defaultSettings } from '@/settings/defaultSetting'
import { getImagePath } from '@/utils'
const router = useRouter()
const propData = defineProps({
    componentProps: {
        type: Object,
        default: () => IComponentPackageData
    },
    onPreviewComponentClick: {
        type: Function,
        default: undefined
    }
})
</script>

<style lang="scss" scoped>
.idm-component-subject-box {
    padding: 20px 0;
    .item-title{
        font-size: 16px;
        margin-bottom: 10px;
        color: #666;
        label{
            color: #FFFFFF;
            background: #F5222D;
            padding: 2px 5px;
            border-radius: 3px;
            margin-left: 10px;
            font-size: 12px;
        }
    }
    .item-subtitle{
        font-size: 14px;
        color: #999;
    }
    .item-footerTitle{
        font-size: 12px;
        color: #999;
        margin-top: 10px;
    }
}
</style>
