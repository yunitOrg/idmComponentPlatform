<template>
    <IFilterCondition :titleInfo="conditionTitle" :isShowList="false">
        <template #search>
            <div>
                <AInput v-model:value="pageData.searchText" class="meddile-search" :placeholder="conditionTitle.placeholder" @keyup.enter="handleGetLeftOrgList">
                    <template #suffix>
                        <AImage :preview="false" class="cursor-pointer" :src="searchImage" @click.prevent="handleGetLeftOrgList"></AImage>
                    </template>
                </AInput>
                <AButton type="primary" shape="round" class="create-org-button" style="margin: 0 0 0 15px" @click="handleCreateOrg">创建新组织</AButton>
            </div>
        </template>
    </IFilterCondition>
    <div class="page-max-width">
        <ARow :gutter="[20, 20]">
            <ACol :span="18">
                <IOrgBox2 v-for="(item, index) in pageData.leftData.records" :key="index" :componentProps="item" @handleApplyOrg="handleApplyOrg"></IOrgBox2>
                <a-empty v-if="!pageData.isFirst && pageData.leftData.records && pageData.leftData.records.length === 0" description="暂无组织" />
                <div class="text-center padding-20 bg-white">
                    <a-pagination
                        v-model:current="pageData.leftPageConfig.pageNo"
                        :defaultPageSize="pageData.leftPageConfig.pageSize"
                        :total="pageData.leftData.total"
                        @change="handleGetLeftOrgList" />
                </div>
            </ACol>
            <ACol :span="6">
                <div v-if="userStore.isUserLogined" class="userinfo-box idm-component-common-box bg-white">
                    <div class="box-top flex">
                        <a-avatar :size="45" class="cursor-pointer" :src="getImagePath(userStore.userInfo && userStore.userInfo.userphoto) || defaultSettings.userphoto" />
                        <div style="margin: 0 0 0 20px">
                            <div class="text-o-e-1">{{ userStore.userInfo && userStore.userInfo.nickname }}</div>
                            <div class="text-o-e-1 color-999">{{ (userStore.userInfo && userStore.userInfo.saying) || defaultSettings.saying }}</div>
                        </div>
                    </div>
                    <div class="box-bottom flex justify-around">
                        <div class="text-center">
                            <div class="org-number">{{ pageData.joinedOrgCount }}</div>
                            <div class="color-999 font-12">我的组织</div>
                        </div>
                        <div class="text-center">
                            <div class="org-number">{{ pageData.joinedOrgCountAsAdmin }}</div>
                            <div class="color-999 font-12">我管理的</div>
                        </div>
                    </div>
                </div>
                <div class="org-right-list bg-white">
                    <div class="flex justify-between org-right-list-title">
                        <span>新组织</span>
                        <span class="cursor-pointer color-999" @click="handleGetMoreRightOrgList"><svg-icon iconClass="refresh"></svg-icon> 换一换</span>
                    </div>
                    <div v-for="(item, index) in pageData.rightData.records" :key="index" class="org-right-list-box flex align-center">
                        <AImage :preview="false" :width="36" :height="36" :src="getImagePath(item.orgphoto)"></AImage>
                        <div class="flex-1" style="margin: 0 0 0 10px">
                            <div class="text-o-e-1">{{ item.orgname }}</div>
                            <div class="text-o-e-1 create-time">{{ item.createTime }}创建</div>
                        </div>
                        <a v-if="item.joinStatus != '1'" class="apply-button" @click="handleApplyOrg(item)">+加入</a>
                        <a v-else class="apply-button color-999">已加入</a>
                    </div>
                    <div
                        v-if="!pageData.isRightFirst && pageData.rightData.records && pageData.rightData.records.length === 0"
                        style="padding: 10px 0; color: #666"
                        class="text-center empty-text">
                        暂无新组织
                    </div>
                </div>
            </ACol>
        </ARow>
    </div>
    <CreateOrgModal v-model:visible="pageData.createOrgVisible" @onClose="createModalClose"></CreateOrgModal>
    <ApplyJoinOrgModal v-model:visible="pageData.applyOrgVisible" :orgInfo="pageData.currentOrg"></ApplyJoinOrgModal>
</template>

<script lang="ts" setup>
import { orgImage, searchImage } from '@/assets/images'
import { defaultSettings } from '@/settings/defaultSetting'
import { useOrgAboutApi } from '@/apis'
import { getImagePath } from '@/utils'
import { useUserStore } from '@/store/modules/user'
const userStore = useUserStore()

const conditionTitle = {
    image: orgImage,
    title: '组织',
    subTitle: '想要内部共享？快来新建组织吧',
    placeholder: '搜索我的组织或申请加入的组织'
}
const pageData = reactive<{ [x: string]: any }>({
    searchText: '',
    createOrgVisible: false,
    applyOrgVisible: false,
    currentOrg: {},
    joinedOrgCount: 0,
    joinedOrgCountAsAdmin: 0,
    leftPageConfig: {
        pageNo: 1,
        pageSize: 5
    },
    rightPageConfig: {
        pageNo: 1,
        pageSize: 10
    },
    leftData: {
        total: 0,
        records: []
    },
    rightData: {
        total: 0,
        records: []
    },
    isFirst: true,
    isRightFirst: true
})
const handleGetLeftOrgList = () => {
    useOrgAboutApi
        .requestOrgGetOpenOrgList({
            searchTxt: pageData.searchText,
            pageNo: pageData.leftPageConfig.pageNo,
            pageSize: pageData.leftPageConfig.pageSize
        })
        .then((res) => {
            pageData.leftData = res.result
        })
        .finally(() => {
            pageData.isFirst = false
        })
}
const handleGetRightOrgList = () => {
    useOrgAboutApi
        .requestOrgGetOpenOrgList({
            pageNo: pageData.rightPageConfig.pageNo,
            pageSize: pageData.rightPageConfig.pageSize,
            sort: 0
        })
        .then((res) => {
            pageData.rightData = res.result
        })
        .finally(() => {
            pageData.isRightFirst = false
        })
}
const handleGetMoreRightOrgList = () => {
    if (pageData.rightData.total < pageData.rightPageConfig.pageNo * pageData.rightPageConfig.pageSize) {
        pageData.rightPageConfig.pageNo = 1
    } else {
        pageData.rightPageConfig.pageNo++
    }
    handleGetRightOrgList()
}
const handleCreateOrg = () => {
    if (userStore.isUserLogined) {
        pageData.createOrgVisible = true
    } else {
        userStore.setLoginModal(true)
    }
}
const createModalClose = () => {
    pageData.rightPageConfig.pageNo = 1
    pageData.leftPageConfig.pageNo = 1
    handleGetLeftOrgList()
    handleGetRightOrgList()
}
const handleApplyOrg = (e: any) => {
    if (userStore.isUserLogined) {
        pageData.currentOrg = e
        pageData.applyOrgVisible = true
    } else {
        userStore.setLoginModal(true)
    }
}
useOrgAboutApi.requestOrgorgGetUserOrgNumber().then((res) => {
    pageData.joinedOrgCount = res.result.joinedOrgCount
    pageData.joinedOrgCountAsAdmin = res.result.joinedOrgCountAsAdmin
})
handleGetLeftOrgList()
handleGetRightOrgList()
</script>
<style lang="scss" scoped>
.meddile-search {
    width: 320px;
    border-radius: 50px;
    border-color: #1890ff;
    background-color: #fff;
}
.create-org-button {
    background-image: linear-gradient(to right, rgb(115, 188, 255), rgb(3, 134, 255));
    border: 0;
}
.bg-white {
    background-color: #fff;
}
.padding-20 {
    padding: 10px 0;
    margin: 0 0 10px;
}
.color-999 {
    color: #999;
}
.userinfo-box {
    margin-bottom: 16px;
    .box-top {
        padding: 20px;
        border-bottom: 1px solid #f1f1f1;
    }
    .box-bottom {
        padding: 5px;
    }
    .font-12 {
        font-size: 12px;
    }
    .org-number {
        font-size: 20px;
    }
}
.org-right-list {
    border-radius: 3px;
    .org-right-list-title {
        padding: 12px;
        border-bottom: 1px solid #f1f1f1;
    }
    .apply-button {
        font-size: 12px;
    }
    .org-right-list-box {
        padding: 12px;
    }
    .create-time {
        font-size: 12px;
        color: #999;
    }
}
</style>
