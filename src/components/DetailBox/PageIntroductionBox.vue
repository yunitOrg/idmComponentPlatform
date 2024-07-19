<template>
    <div class="page-introduction-card">
        <div class="card-title">
            {{ title }}
        </div>
        <ul class="card-content-list">
            <li>
                <span>{{ dataInfoProp.currentRemark }}</span>
            </li>
            <li v-if="dataInfoProp.ownerType=='product'">
                <label>产品：</label><span>{{ dataInfoProp.productName }}</span>
            </li>
            <li v-if="dataInfoProp.ownerType=='project'">
                <label>项目：</label><span>{{ dataInfoProp.productName }}</span>
            </li>
            <li v-if="dataInfoProp.type=='list'||dataInfoProp.type=='form'">
                <label>模块：</label><span>{{ dataInfoProp.moduleName }}（{{ dataInfoProp.moduleCode }}）</span>
            </li>
            <div class="flex justify-between align-start">
                <div class="btn-box">
                    <div class="download-btn" @click="downloadStaticFile(dataInfoProp.currentZipPath)">
                        下 载  <span class="filesize">{{ transformSize(dataInfoProp.currentZipSize) }}</span>
                    </div>
                </div>
                <div class="btn-box">
                    <div class="download-btn" @click="handlePreviewComponent(dataInfoProp)">预 览</div>
                </div>
            </div>
        </ul>
    </div>
</template>

<script lang="ts" setup>
import { baseURL } from '@/plugins/axios'
import { componentPublishApi } from '@/apis'
import { componentMarketDetault } from '@/assets/images'
import { getImagePath, transformSize } from '@/utils'
const router = useRouter()
const propData = defineProps({
    dataInfoProp: {
        type: Object,
        default: () => {}
    },
    title: {
        type: String,
        default: '图片简介'
    },
    iscustom: {
        type: Boolean,
        default: false
    }
})
const pageData = reactive({
})

const handlePreviewComponent = (data: any) => {
    if (data.id) {
        window.open(baseURL + '/p1000/idm/' + (propData.iscustom ? 'custom_' : '') + data.id + '.html?timespan=' + new Date().getTime(), '_blank')
    }
}
const downloadStaticFile = async (url: any) => {
    if (!url) {
        return
    }
    componentPublishApi.downloadStaticFile(url)
}
</script>

<style lang="scss" scoped>
.page-introduction-card{
    border-radius: 5px;
    background: #fff;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.05);
    margin-top: 20px;
    .btn-box{
        width: calc(50% - 10px);
        .filesize{
            text-align: center;
            font-size: 11px;
            color: #999;
        }
    }
    .download-btn {
        color: #40a9ff;
        border-radius: 3px;
        border: 1px solid #40a9ff;
        text-align: center;
        padding: 7px 0;
        margin: 0 0 3px 0;
        cursor: pointer;
    }
    .card-title{
        color: #666;
        font-size: 16px;
        padding: 0 20px;
        height: 50px;
        line-height: 50px;
        border-bottom: 1px solid #EEEEEE;
    }
    .card-content-list{
        list-style: none;
        margin: 0;
        padding: 10px 0;
        >div{
            margin: 10px 20px 10px;
        }
        li{
            cursor: pointer;
            min-height: 40px;
            padding: 10px 20px;
            transition: all 0.2s;
            label{
                font-size: 14px;
                color: #AAA;
            }
            span{
                color: #333;
                font-size: 14px;
            }

        }
    }
}
</style>
