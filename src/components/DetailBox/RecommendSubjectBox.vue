<template>
    <div class="recommend-card">
        <div class="card-title">
            推荐专题
        </div>
        <ul class="card-content-list">
            <li v-for="item in pageData.recommendList" :key="item.id" @click="handlePreviewComponent(item)" class="flex justify-between">
                <div class="title">
                    <label v-if="item.istop">置顶</label>
                    <span>{{ item.type=='platform'?'平台': ((item.type=='product'?'产品':'项目')+' / '+item.title) }}</span>
                </div>
                <div class="subtitle">
                    {{ item.readNumber }}
                </div>
            </li>
        </ul>
    </div>
</template>

<script lang="ts" setup>
import { baseURL } from '@/plugins/axios'
import { useHomePageApi, resourcePublish, useHomeCoreApi } from '@/apis'
import { componentMarketDetault } from '@/assets/images'
import { getImagePath } from '@/utils'
const router = useRouter()
const propData = defineProps({
    clickOpenNewWin: {
        type: Boolean,
        default: false
    }
})
const pageData = reactive({
    limit: 5,
    isFirst: true,
    recommendList: [] as any
})
resourcePublish.getSubjectTop10List({}).then((res) => {
    if (res.success) {
        pageData.recommendList = res.result
    }
})
const handlePreviewComponent = (data: any) => {
    if (data.id) {
        if (propData.clickOpenNewWin) {
            const { href } = router.resolve({
                name: 'index-resourcesubjectdetail',
                query: {
                    id: data.id
                }
            })
            window.open(href, '_blank')
            return
        }
        router.push({
            name: 'index-resourcesubjectdetail',
            query: {
                id: data.id
            }
        })
    }
}
</script>

<style lang="scss" scoped>
.recommend-card{
    border-radius: 5px;
    background: #fff;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.05);
    .card-title{
        color: #666;
        font-size: 16px;
        padding: 0 15px;
        height: 50px;
        line-height: 50px;
        border-bottom: 1px solid #EEEEEE;
    }
    .card-content-list{
        list-style: none;
        margin: 0;
        padding: 10px 0;
        li{
            cursor: pointer;
            height: 40px;
            line-height: 40px;
            padding: 0 15px;
            transition: all 0.2s;
            .title{
                font-size: 14px;
                color: #666;
                label{
                    color: #FFFFFF;
                    background: #F5222D;
                    padding: 2px 5px;
                    border-radius: 3px;
                    margin-right: 10px;
                    font-size: 12px;
                }
            }
            .subtitle{
                color: #999;
                font-size: 12px;
                text-align: right;
            }
            &:hover{
                background-color: #F1F1F1;
            }

        }
    }
}
</style>
