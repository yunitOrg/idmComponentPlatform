<template>
    <div class="image-introduction-card">
        <div class="card-title">
            所属组织
        </div>
        <ul class="card-content-list">
            <li v-for="item in list" :key="item.id">
                <div class="flex justify-start">
                    <div>
                        <a-avatar :size="60" shape="square" :src="getImagePath(item.orgphoto) || defaultSettings.userphoto" />
                    </div>
                    <div style="margin-left:15px">
                        <div class="title text-o-e-1">{{ item.orgname }}</div>
                        <div class="attr text-o-e-1" :title="item.companyName">
                            {{ item.companyName }}
                        </div>
                    </div>
                </div>
                <div class="introduce">
                    {{ item.introduce }}
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
</script>

<style lang="scss" scoped>
.image-introduction-card{
    border-radius: 5px;
    background: #fff;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.05);
    margin-top: 20px;
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
        padding: 0;
        li{
            padding: 20px;
            &:not(:last-child){
                border-bottom: 1px solid #EEEEEE;
            }
            .title{
                font-size: 18px;
            }
            .attr{
                padding-top: 5px;
                color: #666;
            }
            .introduce{
                color: #999;
                margin-top: 10px;
            }
        }
    }
}
</style>
