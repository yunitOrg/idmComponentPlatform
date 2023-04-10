<template>
    <div class="idm-component-common-box course-box">
        <div class="course-box-header flex justify-between">
            <div class="header-title">教程专场</div>
            <div class="header-change"><button @click="reset"><svg-icon iconClass="reset"></svg-icon>换一换</button></div>
        </div>
        <div class="course-box-list">
            <div v-for="(item, index) in pageData.listData" :key="index" class="list-item flex justify-between align-center">
                <div class="list-item-left flex align-center">
                    <div class="item-icon flex align-center justify-center"><img :src="getImagePath(item.icon) || defaultCourse"></div>
                    <div class="item-name">{{ item.name }}</div>
                </div>
                <div class="list-item-right">
                    <button @click="enter">进入</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { defaultCourse } from '@/assets/images'
import { getImagePath } from '@/utils'
// const propData = defineProps({

// })
const pageData = reactive({
    listData: [
        {
            icon: '',
            name: 'Android开发',
            id: '101'
        },
        {
            icon: '',
            name: '开放平台',
            id: '102'
        },
        {
            icon: '',
            name: '数据库',
            id: '103'
        },
        {
            icon: '',
            name: '开发工具',
            id: '104'
        },
        {
            icon: '',
            name: '服务器',
            id: '105'
        }
    ]
})
/**
 * 换一换按钮回调
 */
const reset = () => {
    console.log('换一换')
}
/**
 * 进入按钮回回调
 */
const enter = () => {
    console.log('进入')
}
</script>
<style lang="scss" scoped>
.course-box{
    margin-top: 16px;
    .course-box-header {
        padding: 10px 15px;
        font-size: 16px;
        .header-change button {
            color: #aaa;
            background-color: transparent;
            font-size: 12px;
            border: 1px solid #aaa;
            border-radius: 4px;
            cursor: pointer;

            .svg-icon {
                margin-right: 2px;
            }
        }
    }
    .course-box-list{
        padding: 5px 15px 15px 15px;
        .list-item{
            padding: 6px;
            .list-item-left {
                .item-icon{
                    width: 26px;
                    height: 26px;
                    border: 1px solid #ccc;
                    border-radius: 6px;
                    margin-right: 6px;
                    img{
                        width: 80%;
                        height: 80%;
                    }
                }
            }
            .list-item-right button {
                position: relative;
                font-size: 12px;
                border: none;
                border-radius: 4px;
                background-color: rgb(245, 246, 247);
                padding-left: 16px;
                cursor: pointer;
                &::before{
                    content: "+";
                    display: block;
                    position: absolute;
                    top: 0;
                    left: 5px;
                    bottom: 0;
                    margin: auto 0;
                    width: 6px;
                    height: 6px;
                    line-height: 4px;
                    color: rgb(234, 103, 68);
                    border-radius: 50%;
                    font-weight: bold;
                }
            }
        }
    }
}
</style>
