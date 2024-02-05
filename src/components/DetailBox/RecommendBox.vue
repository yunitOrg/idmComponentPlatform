<template>
    <div class="idm-component-common-box recommend-box">
        <div class="recommend-box-header flex justify-between">
            <div class="header-title">相关推荐</div>
            <div class="header-change">
                <button @click="reset"><svg-icon iconClass="reset"></svg-icon>换一换</button>
            </div>
        </div>
        <ARow :gutter="20" class="recommend-box-list">
            <ACol v-for="(item, index) in recommendOptions" :key="index" :span="6">
                <ISchoolBox :componentProps="item" />
            </ACol>
        </ARow>
    </div>
</template>
<script setup lang="ts">
import { recommendOptions } from './mock/mockData'
// const pageData = reactive({
//     listData: []
// })
/**
 * 换一换按钮回调
 */
const reset = () => {
    console.log('换一换')
}
</script>
<style lang="scss" scoped>
.recommend-box {
    margin-top: 16px;

    .recommend-box-header {
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

    .recommend-box-list {
        padding: 10px 15px;
    }
}
</style>
