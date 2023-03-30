<template>
    <IFilterCondition :titleInfo="conditionTitle"></IFilterCondition>
    <IPagenationContainer>
        <template #list>
            <ARow :gutter="[20, 20]">
                <ACol v-for="item in 25" :key="item" :span="5">
                    <ISchoolBox />
                </ACol>
            </ARow>
        </template>
    </IPagenationContainer>
</template>

<script lang="ts" setup>
import { schoolImage } from '@/assets/images'

const conditionTitle = {
    image: schoolImage,
    title: 'i学院',
    subTitle: '畅学海量高品质教程',
    placeholder: '搜索感兴趣的教程'
}
// interface PageData {
//     conditionList: Array<IFilterConditionItem>
// }
// const pageData = reactive<PageData>({
//     conditionList: []
// })
</script>
<style lang="scss" scoped>
::v-deep(.ant-col-5) {
    display: block;
    flex: 0 0 20%;
    max-width: 20%;
}
</style>
