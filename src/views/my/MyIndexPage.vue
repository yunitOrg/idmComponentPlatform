<template>
    <div class="userinfo-container">
        <div class="userinfo-container-left">
            <AAvatar :size="160" class="user-avatar" :src="defaultSettings.userphoto" alt="头像加载失败" />
            <div class="text-center cursor-pointer" style="padding: 6px 0 0 0"><span class="edit-btn" @click="router.push({ name: 'my-personalData' })">编辑个人资料</span></div>
        </div>
        <div class="userinfo-base">
            <div>
                <span class="nickname">{{ userStore.userInfo && userStore.userInfo.nickname }}</span>
                <span class="saying">{{ (userStore.userInfo && userStore.userInfo.saying) || '赶紧去说句话吧' }}</span>
            </div>
            <div class="userinfo-line flex align-center">
                <svg-icon iconClass="gongwen" style="margin: 0 0 0 2px" class="userinfo-icon"></svg-icon>
                <span class="intr-text">互联网</span>
                <span class="intr-text">上海梦创双杨股份有限公司</span>
                <span class="intr-text">开发经理</span>
            </div>
            <div class="userinfo-line flex align-center">
                <svg-icon iconClass="school" style="font-size: 20px; margin: 0 -2px 0 0" class="userinfo-icon"></svg-icon>
                <span class="intr-text">华南理工大学</span>
                <span class="intr-text">计算机技术</span>
                <span class="intr-text">男</span>
            </div>
            <div class="userinfo-line flex align-center userinfo-icon cursor-pointer" style="margin-bottom: 10px">
                <DownOutlined style="margin: 0 7px 0 12px"></DownOutlined>
                <span>查看详细资料</span>
            </div>
        </div>
        <ARow :gutter="[20, 20]">
            <ACol :span="18">
                <div class="idm-component-common-box index-page-tab-container">
                    <ATabs v-model:activeKey="pageData.activeKey" :tabBarStyle="{ padding: '0 20px' }" @change="tabsChange">
                        <ATabPane v-for="item in pageData.tabList" :key="item.key">
                            <template #tab>
                                {{ item.text }} <span class="tab-number" :style="{ color: pageData.activeKey === item.key ? '' : '#ccc' }">{{ item.num }}</span>
                            </template>
                            <template v-if="pageData.activeKey === 'org'">
                                <IOrgBox2 v-for="(items, index) in pageData.listData" :key="index" :componentProps="items"></IOrgBox2>
                            </template>
                        </ATabPane>
                    </ATabs>
                </div>
            </ACol>
            <ACol :span="6">
                <AboutUsBox></AboutUsBox>
            </ACol>
        </ARow>
    </div>
</template>

<script lang="ts" setup>
import { defaultSettings } from '@/settings/defaultSetting'
import { useUserStore } from '@/store/modules/user'
import { DownOutlined } from '@ant-design/icons-vue'
import { useHomeCoreApi } from '@/apis'
const userStore = useUserStore()
const router = useRouter()
const pageData = reactive({
    activeKey: 'trends',
    tabList: [
        {
            text: '我的动态',
            key: 'trends'
        },
        {
            text: '组织',
            key: 'org',
            num: 12
        },
        {
            text: '收藏',
            key: 'collect',
            num: 12
        },
        {
            key: 'follow',
            text: '关注'
        }
    ],
    listData: []
})
const tabsChange = (tabKey: any) => {
    switch (tabKey) {
        case 'org':
            handleGetOrgList()
            break
    }
}
const handleGetOrgList = () => {
    useHomeCoreApi.requestCoreMyOrgList().then((res) => {
        if (res.success) {
            // pageData.listData = res.result
        }
    })
}
</script>

<style lang="scss" scoped>
.userinfo-container {
    position: relative;
    .userinfo-container-left {
        position: absolute;
        top: -75px;
        left: 40px;
        .user-avatar {
            border: 8px solid #fff;
        }
        .edit-btn {
            color: #40a9ff;
            border: 1px solid #40a9ff;
            padding: 4px 12px;
            border-radius: 50px;
            font-size: 12px;
        }
    }
}
.userinfo-base {
    padding: 10px 20px 0 230px;
    background-color: #fff;
    border-radius: 0 0 5px 5px;
    overflow: hidden;
    min-height: 140px;
    .nickname {
        font-size: 22px;
        font-weight: 600;
    }
    .userinfo-line {
        margin: 10px 0 0 0;

        .intr-text {
            padding: 0 10px;
            border-right: 1px solid #ddd;
            &:last-child {
                border-right: 0;
            }
        }
    }
    .saying {
        color: #666666;
        margin: 0 0 0 10px;
    }
    .userinfo-icon {
        color: #999;
    }
}
.index-page-tab-container {
    margin: 16px 0 0 0;

    ::v-deep(.ant-tabs-tab-btn:hover) {
        .tab-number {
            transition: all 0.3s;
            color: #1890ff !important;
        }
    }
}
</style>
