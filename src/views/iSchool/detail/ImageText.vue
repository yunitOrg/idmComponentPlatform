<template>
    <div class="page-max-width flex">
        <div style="padding: 50px 30px 0 0">
            <ButtonList
                :componentProp="pageData.docDetail.docInfo"
                :isPraise="pageData.docDetail.isPraise"
                :isCollect="pageData.docDetail.isCollect"
                sourceType="1"
                :sourceId="pageData.docDetail.docInfo.id"
                @handleClickButtonList="handleClickButtonList"
                @collectSuccess="collectSuccess"
                @cancelCollect="cancelCollect"></ButtonList>
        </div>
        <ARow :gutter="[20, 20]" class="flex-1">
            <ACol :span="17">
                <DocTitleInfo type="imageText" :codePackageProp="pageData.docDetail.docInfo"></DocTitleInfo>
                <div class="detail-md-outer">
                    <v-md-preview ref="preview" :text="pageData.content"></v-md-preview>
                </div>
                <CommentBox commentTypeId="docId" articleType="3"></CommentBox>
                <RecommendBox style="margin-bottom: 16px"></RecommendBox>
            </ACol>
            <ACol :span="7">
                <UserInfoBox :userInfoProp="pageData.docDetail.docUserInfo" @onDoFollow="onDoFollow"></UserInfoBox>
                <AttachmentBox :userInfoProp="pageData.docDetail.docUserInfo"></AttachmentBox>
                <CatalogueBox :docContentRef="preview"></CatalogueBox>
                <RelatedComponent :userInfoProp="pageData.docDetail.docUserInfo"></RelatedComponent>
                <!-- <CourseBox style="margin-bottom: 20px;"></CourseBox> -->
            </ACol>
        </ARow>
    </div>
</template>
<script setup lang="ts">
const pageData = reactive({
    docDetail: {
        docInfo: { id: '', collectNumber: 0, praiseNumber: 0 }, // 文档信息
        docUserInfo: { focusThis: 0 }, // 文档用户信息
        isCollect: false, // 是否收藏
        isPraise: false // 是否点赞
    },
    content: '## 一、修饰符是什么 \n  \n 在程序世界里，修饰符是用于限定类型以及类型成员的声明的一种符号 \n  \n 在Vue中，修饰符处理了许多DOM事件的细节，让我们不再需要花大量的时间去处理这些烦恼的事情，而能有更多的精力专注于程序的逻辑处理 \n  \n vue中修饰符分为以下五种： \n 表单修饰符 \n 事件修饰符 \n 鼠标按键修饰符 \n 键值修饰符 \n v-bind修饰符 \n ## 二、修饰符的作用 \n ### 表单修饰符 \n \n 在我们填写表单的时候用得最多的是input标签，指令用得最多的是v-model',
    contentUrl: '' // 目录链接
})
// 文档内容元素
const preview = ref()
/**
 * 文档操作按钮点击回调
 * @param type number
 */
const handleClickButtonList = (type: number) => {
    console.log(type)
    switch (type) {
        case 1: // 点赞
            // handlePraise()
            break
        case 2: // 打赏
            break
        case 3: // 评论
            break
        case 4: // 收藏
            break
        case 5: // 分享
            break
    }
}
/**
 * 收藏回调
 */
const collectSuccess = () => {
    pageData.docDetail.isCollect = true
    pageData.docDetail.docInfo.collectNumber += 1
}
/**
 * 取消收藏成功回调
 */
const cancelCollect = () => {
    pageData.docDetail.isCollect = false
    pageData.docDetail.docInfo.collectNumber -= 1
}
/**
 * 关注用户回调
 */
const onDoFollow = () => {
    pageData.docDetail.docUserInfo.focusThis = pageData.docDetail.docUserInfo.focusThis === 1 ? 0 : 1
}
</script>
<style scoped lang="scss">
.detail-md-outer {
    background-color: #fff;
}
</style>
