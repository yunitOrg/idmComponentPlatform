<template>
    <div class="idm-button-list-container">
        <div class="idm-button-list-box">
            <div :class="['idm-button-list-icon', 'cursor-pointer', 'flex', 'justify-center', 'align-center', isPraise && 'btn-active']" @click="handlePraise">
                <svg-icon iconClass="dianzan" style="font-size: 19px"></svg-icon>
                <span v-if="componentProp.praiseNumber" class="idm-button-list-num">{{ componentProp.praiseNumber }}</span>
            </div>
        </div>
        <div class="idm-button-list-box">
            <div class="idm-button-list-icon cursor-pointer flex justify-center align-center" @click="emits('handleClickButtonList', 2)">
                <svg-icon iconClass="dashang" style="font-size: 21px"></svg-icon>
                <span v-if="componentProp.playtourNumber" class="idm-button-list-num">{{ componentProp.playtourNumber }}</span>
            </div>
        </div>
        <div class="idm-button-list-box">
            <div class="idm-button-list-icon cursor-pointer flex justify-center align-center" @click="handleClickComment">
                <svg-icon iconClass="pinglun2" style="font-size: 19px"></svg-icon>
                <span v-if="componentProp.commentNumber" class="idm-button-list-num">{{ componentProp.commentNumber }}</span>
            </div>
        </div>
        <div class="idm-button-list-box">
            <div
                :class="['idm-button-list-icon', 'cursor-pointer', 'flex', 'justify-center', 'align-center', isCollect && 'btn-active']"
                style="font-size: 18px"
                @click="handleCollect">
                <svg-icon iconClass="shoucang" style="font-size: 21px"></svg-icon>
                <span v-if="componentProp.collectNumber" class="idm-button-list-num">{{ componentProp.collectNumber }}</span>
            </div>
        </div>
        <div class="idm-button-list-box">
            <div class="idm-button-list-icon cursor-pointer flex justify-center align-center" @click="emits('handleClickButtonList', 5)">
                <svg-icon iconClass="fenxiang" style="font-size: 18px"></svg-icon>
                <span v-if="componentProp.shareNumber" class="idm-button-list-num">{{ componentProp.shareNumber }}</span>
            </div>
        </div>
        <ChooseCollectionModal
            v-model:visible="pageData.chooseCollectionVisible"
            :sourceType="sourceType"
            :sourceId="sourceId"
            @handleCreateCollection="handleCreateCollection"
            @onSuccess="emits('collectSuccess')"></ChooseCollectionModal>
        <CreateCollectionModal v-model:visible="pageData.createCollectionVisible" @onSuccess="createCollection"></CreateCollectionModal>
    </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/store/modules/user'
const userStore = useUserStore()
const propData = defineProps({
    componentProp: {
        type: Object,
        default: () => {}
    },
    isPraise: {
        type: Boolean,
        default: false
    },
    isCollect: {
        type: Boolean,
        default: false
    },
    sourceType: {
        type: String,
        default: ''
    },
    sourceId: {
        type: String,
        default: ''
    }
})
const emits = defineEmits(['handleClickButtonList', 'cancelCollect', 'collectSuccess'])
const pageData = reactive({
    createCollectionVisible: false,
    chooseCollectionVisible: false,
    isCollect: false
})
const handleCollect = () => {
    if (userStore.isUserLogined) {
        if (propData.isCollect) {
            emits('cancelCollect')
        } else {
            pageData.chooseCollectionVisible = true
        }
    } else {
        userStore.setLoginModal(true)
    }
}
const handlePraise = () => {
    if (!userStore.isUserLogined) {
        return userStore.setLoginModal(true)
    }
    emits('handleClickButtonList', 1)
}
const handleCreateCollection = () => {
    pageData.chooseCollectionVisible = false
    pageData.createCollectionVisible = true
}
const createCollection = () => {
    pageData.createCollectionVisible = false
    pageData.chooseCollectionVisible = true
}
const handleClickComment = () => {
    const element = document.getElementById('comment-box-container')
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
    }
}
</script>

<style lang="scss" scoped>
.idm-button-list-container {
    position: sticky;
    top: 130px;
    .idm-button-list-box {
        margin: 0 0 20px 0;
    }
    .idm-button-list-icon {
        position: relative;
        width: 48px;
        height: 48px;
        background-color: #fff;
        border-radius: 50%;
        font-size: 16px;
        color: #8a919f;
        &:hover {
            color: #515767;
        }
    }
    .idm-button-list-num {
        position: absolute;
        left: 30px;
        top: 0;
        height: 17px;
        line-height: 17px;
        padding: 0 5px;
        border-radius: 9px;
        font-size: 11px;
        text-align: center;
        white-space: nowrap;
        background-color: #c2c8d1;
        color: #fff;
    }
    .btn-active {
        color: #1890ff !important;
    }
    .idm-button-list-text {
        font-size: 12px;
        color: #999999;
        margin: 5px 0 0 0;
        transform: scale(0.9);
    }
}
</style>
