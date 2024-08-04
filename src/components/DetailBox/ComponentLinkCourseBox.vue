<template>
    <div class="course-introduction-card">
        <div class="card-title">
            相关教程
        </div>
        <ul class="card-content-list">
            <li v-for="item in list" :key="item.id" @click="gotoVedioPage(item)">
                <div class="flex justify-start">
                    <div>
                        <img :src="getImagePath(item.coverUrl) || componentMarketDetault" />
                    </div>
                    <div style="margin-left:10px">
                        <div class="title text-o-e-1">{{ item.title }}</div>
                        <div class="attr text-o-e-1" :title="item.userNickname">
                            {{ item.userNickname }}&nbsp;&nbsp;●&nbsp;&nbsp;{{ item.readNumber }}次浏览
                        </div>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script lang="ts" setup>
import { baseURL } from '@/plugins/axios'
import { defaultSettings } from '@/settings/defaultSetting'
import { componentPublishApi } from '@/apis'
import { componentMarketDetault } from '@/assets/images'
import { getImagePath, transformSize } from '@/utils'
const router = useRouter()
const propData = defineProps({
    list: {
        type: Object,
        default: () => { return [] }
    }
})
const gotoVedioPage = (item: any) => {
    const { href } = router.resolve({
        name: `index-iSchool-${item.type === 0 ? 'video' : item.type === 1 ? 'imageText' : 'eBook'}Detail`,
        query: {
            courseId: item.id
        }
    })
    window.open(href, '_blank')
}
</script>

<style lang="scss" scoped>
.course-introduction-card{
    border-radius: 5px;
    background: #fff;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.05);
    margin-top: 20px;
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
        padding: 0;
        li{
            cursor: pointer;
            img{
                width: 100px;
                height: 60px;
                border-radius: 4px;
            }
            padding: 15px;
            &:not(:last-child){
                border-bottom: 1px solid #EEEEEE;
            }
            .title{
                font-size: 16px;
            }
            .attr{
                font-size: 12px;
                padding-top: 5px;
                color: #666;
            }
        }
    }
}
</style>
