<template>
    <div class="image-introduction-card">
        <div class="card-title">
            图片简介
        </div>
        <ul class="card-content-list">
            <li>
                <label>尺寸：</label><span>{{ item.imgWidth }} * {{ item.imgHeight }}</span>
            </li>
            <li>
                <label>格式：</label><span>{{ item.type }}</span>
            </li>
            <li>
                <label>体积：</label><span>{{ transformSize(item.fileSize) }}</span>
            </li>
            <div class="download-btn" @click="downloadStaticFile(item.imgPath)">下 载</div>
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
    item: {
        type: Object,
        default: () => {}
    }
})
const pageData = reactive({
})

const downloadStaticFile = async (url: any) => {
    if (!url) {
        return
    }
    componentPublishApi.downloadStaticFile(url)
}
</script>

<style lang="scss" scoped>
.image-introduction-card{
    border-radius: 5px;
    background: #fff;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.05);
    margin-top: 20px;
    .download-btn {
        color: #40a9ff;
        border-radius: 3px;
        border: 1px solid #40a9ff;
        text-align: center;
        padding: 7px 0;
        margin: 0 0 15px 0;
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
            margin: 10px 20px 20px;
        }
        li{
            cursor: pointer;
            height: 40px;
            line-height: 40px;
            padding: 0 20px;
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
