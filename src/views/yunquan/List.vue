<template>
    <IFilterCondition :titleInfo="conditionTitle" :isShowList="false"></IFilterCondition>
</template>

<script lang="ts" setup>
import { yunQuanImage } from '@/assets/images'

const conditionTitle = {
    image: yunQuanImage,
    title: '云圈',
    subTitle: '一起来交流组件开发，共享心得吧',
    placeholder: '输入交流关键词搜索'
}
// interface PageData {
//     conditionList: Array<IFilterConditionItem>
// }
// const pageData = reactive<PageData>({
//     conditionList: []
// })
</script>
<style lang="scss" scoped></style>
