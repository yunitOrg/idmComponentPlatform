<template>
    <div class="idm-page-box cursor-pointer" @click="handleItemClick">
        <div class="page-inner-box">
            <div class="info-tip-icon">
                <a-popover>
                    <template #content>
                        <div v-for="(item,index) in cardList" :key="index" class="flex justify-start" style="margin:10px 25px 10px 0px">
                            <span style="width:80px;text-align:right;color:#999999">{{ item[0] }}：</span><span v-if="componentProps[item[1]]||componentProps[item[1]]===0">{{ handleCardFunction(item) }}</span><span v-else style="color:#CCC">空</span>
                        </div>
                    </template>
                    <InfoCircleOutlined style="font-size: 16px;color:#999" />
                </a-popover>
            </div>
            <div class="flex justify-start align-center">
                <div v-if="componentProps.coverPath" class="image-wapper">
                    <div v-if="propData.onPreviewComponentClick" class="preview-tag cursor-pointer" @click.stop="propData.onPreviewComponentClick">预览</div>
                    <img object-fit alt="图片加载失败" class="image" :src="getImagePath(componentProps.coverPath)" />
                </div>
                <div style="height: 88px;" :class="componentProps.coverPath?'has-image':''">
                    <div class="page-title flex justify-start">
                        <div class="title-inner">{{ componentProps.title }}</div>
                        <div class="page-tag" v-if="componentProps.typeCN">{{ componentProps.typeCN }}</div>
                    </div>
                    <div class="page-subtitle text-o-e-2">{{ componentProps.currentRemark }}</div>
                </div>
            </div>
            <div class="page-attr-describe text-o-e-2">
                <a-row :gutter="[16, 0]">
                    <a-col :span="8">
                        <div class="flex align-center">
                            <a-avatar :size="16" :src="getImagePath(componentProps.userPhoto) || defaultSettings.userphoto" />
                            <span class="page-username">{{ componentProps.userNickname }}</span>
                        </div>
                    </a-col>
                    <a-col :span="8">
                        <div class="page-class-team text-o-e" :title="!componentProps.publishOpen?componentProps.publishRangeName: defaultSettings.yunitName">
                            <span>组织：</span>{{ !componentProps.publishOpen?componentProps.publishRangeName: defaultSettings.yunitName }}
                        </div>
                    </a-col>
                    <a-col :span="8">
                        <div class="page-class-ownter text-o-e"><span>所属：</span>{{ componentProps.ownerTypeCN }}</div>
                    </a-col>
                </a-row>
            </div>
        </div>
        <div class="page-bottom-box flex justify-between">
            <div v-if="propData.bottomShowTime" class="bottom-left"><span>更新时间：</span>{{ componentProps.updateTime || componentProps.createTime }}</div>
            <div v-else class="bottom-left"><span>最新版本：</span>{{ componentProps.currentVersion }}</div>
            <div class="bottom-button">
                <AButton type="primary" shape="round" size="small">下载</AButton>
                <AButton style="margin-left:10px" shape="round" size="small" @click.stop="propData.onPreviewComponentClick">预览</AButton>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { IComponentPackageData } from './mock/mockData'
import { defaultSettings } from '@/settings/defaultSetting'
import { getImagePath } from '@/utils'
import { InfoCircleOutlined } from '@ant-design/icons-vue'
const router = useRouter()
const propData = defineProps({
    // [['ID','id'],['阅读量','readCount'],['标题','title'],['缩略图','coverPath'],['发布时间','publishTime'],['发布人','userNickname'],['发布人头像','userPhoto'],['发布人类型','ownerType'],['发布范围','publishRange'],['发布范围名称','publishRangeName'],['所属类型','ownertype'],['所属类型名称','ownertypeName'],['所属类型名称','ownertype']]
    cardList: {
        type: Array<[String, String]>,
        default: () => { return [] }
    },
    bottomShowTime: {
        type: Boolean,
        default: false
    },
    attrProps: {
        type: Object,
        default: () => { return {} }
    },
    componentProps: {
        type: Object,
        default: () => IComponentPackageData
    },
    onPreviewComponentClick: {
        type: Function,
        default: undefined
    }
})
const handleItemClick = () => {
    router.push({
        name: 'index-componentPackage-detail',
        query: {
            codepackageId: propData.componentProps.id,
            version: propData.componentProps.currentVersion
        }
    })
}

const formatSize = (size: number) => {
    if (size < 1024) {
        return size + 'B'
    } else if (size < 1024 * 1024) {
        return (size / 1024).toFixed(2) + 'KB'
    } else if (size < 1024 * 1024 * 1024) {
        return (size / 1024 / 1024).toFixed(2) + 'MB'
    } else if (size < 1024 * 1024 * 1024 * 1024) {
        return (size / 1024 / 1024 / 1024).toFixed(2) + 'GB'
    } else {
        return (size / 1024 / 1024 / 1024 / 1024).toFixed(2) + 'TB'
    }
}
const handleCardFunction = (item: Array<[String, String, String]>) => {
    if (item.length > 2) {
        switch (item[2]) {
            case 'formatSize':
                return formatSize(propData.componentProps[item[1]])
            case 'format01':
                return propData.componentProps[item[1]] === 1 ? '内容模板' : '布局模板'
        }
    }
    return propData.componentProps[item[1]]
}
</script>

<style lang="scss" scoped>
.idm-page-box {
    border: 1px solid #E1F0FF;
    background: linear-gradient(0deg, #ddeeff 0%, #FFFFFF 38%, #FFFFFF 100%);
    border-radius: 5px;
    transition: all 0.3s;
    &:hover{
        box-shadow: 0 0 20px rgba($color: #C6C6C6, $alpha: 0.5);
        transform: translateY(-5px);
        .image-wapper {
            .preview-tag {
                display: block;
                opacity: 1;
            }
        }
        .page-bottom-box{
            .bottom-button{
                display: block;
            }
        }
    }
    .page-inner-box{
        padding: 15px;
        position: relative;
    }
    .info-tip-icon{
        position: absolute;
        right: 10px;
        top:10px;
    }
    .image-wapper {
        border:1px solid #F1F1F1;
        position: relative;
        border-radius: 5px;
        overflow: hidden;
        margin-right: 15px;
        flex-shrink: 1;
        width: 175px;
        .preview-tag {
            position: absolute;
            top: 6px;
            right: 6px;
            border-radius: 10px;
            background: rgba($color: #000000, $alpha: 0.3);
            color: #fff;
            font-size: 12px;
            padding: 2px 10px;
            opacity: 0;
            transition: opacity 0.2s;
        }
        .image {
            display: block;
            overflow: hidden;
            width: 100%;
            height: 86px;
            object-fit: cover;
        }
    }
    .page-attr-describe{
        padding: 15px 0 5px 0;
        font-size: 12px;
        span{
            color:#999999;
        }
        .page-username{
            margin-left: 5px;
        }
        .page-class-time{
            text-align: right;
        }
    }
    .page-bottom-box{
        height: 44px;
        line-height: 44px;
        padding: 0px 15px;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
        .bottom-left{
            color: #1890FF;
            span{
                color: #999999;
            }
        }
        .bottom-button{
            display: none;
        }
    }
    .has-image{
        width:calc(100% - 190px);
    }
    .page-title{
        font-size: 16px;
        display: flex;
        .title-inner{
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
        }
        .page-tag{
            background: #fafafa;
            border: 1px solid #d9d9d9;
            font-size: 12px;
            padding:2px 5px;
            border-radius: 5px;
            margin-left: 10px;
            white-space: nowrap;

        }
    }
    .page-subtitle{
        color: #999999;
        font-size: 14px;
        margin-top: 10px;
    }
    .page-attr{
        font-size: 14px;
        margin-top: 10px;
        color: #666666;
        span{
            color: #999999;
        }
    }
}
</style>
