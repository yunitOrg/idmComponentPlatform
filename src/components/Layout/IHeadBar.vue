<template>
    <div v-if="!isIndexPage" class="head-bar-container" style="margin: 55px 0 20px 0; padding: 0"></div>
    <div :style="{ top: pageData.isShowMenuLine ? '0' : '-55px' }" class="head-bar-container head-bar-container-fix" :class="[pageData.isShadow && 'head-bar-container-shadow']">
        <div class="flex justify-between align-center head-bar-container-main">
            <div class="flex align-center flex-1" :class="{ 'justify-between': !hiddenMenu }">
                <img alt="logo" title="logo" class="cursor-pointer header-logo" :src="yunitLogo" @click="handleJump({ routeName: 'index', title: 'logo' })" />
                <template v-if="hiddenMenu">
                    <div v-for="item in selectedItems" :key="item.routeName" class="nav-title">{{ item.title }}</div>
                </template>
                <template v-else>
                    <a-menu
                        v-model:selectedKeys="selectedKeys"
                        :style="{ opacity: pageData.menuOpacity, display: pageData.menuOpacity == 0 ? 'none' : 'block' }"
                        class="flex-1"
                        mode="horizontal"
                        @click="handleMenuClick">
                        <template v-for="item in menuNavList">
                            <a-sub-menu v-if="item.children" :key="item.routeName" :title="item.title" @titleClick="handleSubMenuClick(item.routeName)">
                                <a-menu-item v-for="subitem in item.children" :key="subitem.routeName">{{ subitem.title }}</a-menu-item>
                            </a-sub-menu>
                            <a-menu-item v-else :key="item.routeName">
                                {{ item.title }}
                            </a-menu-item>
                        </template>
                    </a-menu>
                </template>
            </div>
            <div class="flex justify-between align-center">
                <AInput
                    v-model:value="searchText"
                    :style="{ opacity: pageData.menuOpacity, display: pageData.menuOpacity == 0 ? 'none' : 'inline-flex' }"
                    class="header-top-search"
                    placeholder="请输入关键字..."
                    style="width: 260px"
                    @keyup.enter="handleSearch">
                    <template #suffix>
                        <search-outlined style="color: rgba(0, 0, 0, 0.45); font-size: 20px" @click="handleSearch" />
                    </template>
                </AInput>
                <div v-if="userStore.isUserLogined" class="login-status-box flex justify-center align-center">
                    <a-popover placement="bottom" overlayClassName="navbar-avatar-popover">
                        <a-avatar
                            :size="24"
                            class="cursor-pointer header-avatar"
                            :src="getImagePath(userStore.userInfo && userStore.userInfo.userphoto) || defaultSettings.userphoto" />
                        <AButton style="font-size: 16px" type="link" @click="handleJumpIndexPage"> 我的主页 </AButton>
                        <template #content>
                            <div class="navbar-avatar-popover-top">
                                <div class="flex align-end">
                                    <a-avatar :size="50" :src="getImagePath(userStore.userInfo && userStore.userInfo.userphoto) || defaultSettings.userphoto" />
                                    <div style="margin: 0 0 0 10px">
                                        <div class="popover-nickname">{{ userStore.userInfo && userStore.userInfo.nickname }}</div>
                                        <div class="popover-saying">{{ (userStore.userInfo && userStore.userInfo.saying) || '赶紧去说句话吧' }}</div>
                                    </div>
                                </div>
                                <div class="flex justify-around">
                                    <div class="flex flex-direction-column align-center">
                                        <span class="number">{{ (userStore.userInfo && userStore.userInfo.likeTotal) || '0' }}</span>
                                        <div class="title">获赞</div>
                                    </div>
                                    <div class="flex flex-direction-column align-center">
                                        <span class="number">{{ (userStore.userInfo && userStore.userInfo.fansTotal) || '0' }}</span>
                                        <div class="title">粉丝</div>
                                    </div>
                                    <div class="flex flex-direction-column align-center">
                                        <span class="number">{{ (userStore.userInfo && userStore.userInfo.componentTotal) || '0' }}</span>
                                        <div class="title">组件</div>
                                    </div>
                                </div>
                            </div>
                            <div class="create-entrance flex align-center cursor-pointer" @click="handleCreativeCenterClick">
                                <a-image :preview="false" :width="66" :src="createEntranceImage"></a-image>
                                <div class="flex align-center flex-1" style="margin: 0 0 0 10px">
                                    <div class="flex-1">
                                        <div class="create-text">
                                            创作者中心 <span class="user-level">Lv {{ userStore.userInfo && userStore.userInfo.level }}</span>
                                        </div>
                                        <div>查看详细</div>
                                    </div>
                                    <RightOutlined></RightOutlined>
                                </div>
                            </div>
                            <div
                                v-for="(item, index) in myActionList"
                                :key="index"
                                class="flex align-center hover-line cursor-pointer"
                                :class="[item.border && 'border']"
                                @click="handleClickActionBtn(item.action)">
                                <AImage :preview="false" :src="item.image"></AImage>
                                <span class="line-text">{{ item.text }}</span>
                            </div>
                        </template>
                    </a-popover>
                    <a-popover placement="bottomRight" overlayClassName="message-popover" @visibleChange="messageVisibleChange">
                        <a-badge :count="messageCount" style="margin: 0 10px">
                            <span class="message-btn cursor-pointer">消息</span>
                        </a-badge>
                        <template #content>
                            <div class="top-message-list-container">
                                <div class="flex justify-between title-tab">
                                    <div
                                        class="flex-1 text-center cursor-pointer"
                                        :class="[pageData.currentMessageActive === 1 && 'tab-active']"
                                        @click="handleMessageTabChange(1)">
                                        我的私信
                                    </div>
                                    <div
                                        class="flex-1 text-center cursor-pointer"
                                        :class="[pageData.currentMessageActive === 2 && 'tab-active']"
                                        @click="handleMessageTabChange(2)">
                                        通知消息
                                    </div>
                                </div>
                                <!-- 私信 -->
                                <div v-if="pageData.currentMessageActive === 1">
                                    <div class="tab-content common-scrollbar_style">
                                        <div v-if="pageData.messageLoading" class="flex justify-center align-center" style="height: 100%">
                                            <a-spin></a-spin>
                                        </div>
                                    </div>
                                    <div class="flex justify-between align-center tab-bottom">
                                        <div class="cursor-pointer"><svg-icon iconClass="edit"></svg-icon> 写信私信</div>
                                        <div class="cursor-pointer">查看全部私信</div>
                                    </div>
                                </div>
                                <!-- 通知 -->
                                <div v-if="pageData.currentMessageActive === 2">
                                    <div class="tab-content common-scrollbar_style">
                                        <AllMessage showLocation="navbar" size="mini" :messageList="pageData.messageList" @updateMessage="updateMessage"></AllMessage>
                                        <div v-if="pageData.messageLoading" class="flex justify-center align-center" style="height: 100%">
                                            <a-spin></a-spin>
                                        </div>
                                    </div>
                                    <div class="flex justify-between align-center tab-bottom">
                                        <div class="cursor-pointer"><svg-icon iconClass="settings"></svg-icon> 设置</div>
                                        <div class="cursor-pointer" @click="router.push({ name: 'message-list' })">查看全部通知</div>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </a-popover>
                    <a-popover placement="bottomRight">
                        <template #content>
                            <div class="want-send-top flex justify-between align-center" style="flex-wrap: wrap;">
                                <div
                                    v-for="(item, index) in sendListMap"
                                    :key="index"
                                    class="flex flex-direction-column justify-between align-center cursor-pointer"
                                    @click="handleSendClick(item)">
                                    <div class="want-send-top-icon flex justify-center align-center">
                                        <svg-icon :iconClass="item.icon" :style="{ width: item.iconSize + 'px', height: item.iconSize + 'px' }"></svg-icon>
                                    </div>
                                    <div>{{ item.text }}</div>
                                </div>
                            </div>
                            <div class="want-send-bottom" style="display:none">
                                <span class="font-weight-600">最新活动</span>
                                <div class="want-send-bottom-activity-list">
                                    <span v-for="(item, index) in activityList" :key="index" class="cursor-pointer">{{ '#' + item.title }}</span>
                                </div>
                                <div class="text-right more-activity cursor-pointer"><span>查看更多</span> <RightOutlined /></div>
                            </div>
                        </template>
                        <AButton type="primary" style="margin: 0 0 0 20px">
                            <div class="flex align-center">
                                <svg-icon iconClass="edit"></svg-icon>
                                <span style="margin: 0 0 0 5px">创作</span>
                            </div>
                        </AButton>
                    </a-popover>
                </div>
                <div v-else class="login-status-box flex justify-center align-center" @click="userStore.setLoginModal(true)">
                    <div class="login-reg-box flex justify-between align-center cursor-pointer">
                        <div>登录</div>
                        <div class="line">|</div>
                        <div>注册</div>
                    </div>
                </div>
            </div>
        </div>
        <CreateOrgModal v-model:visible="pageData.createOrgVisible"></CreateOrgModal>
    </div>
    <div v-if="isIndexPage" class="head-bar-container head-bar-container-shadow" style="margin: 54px 0 20px 0">
        <AInputSearch v-model:value="searchText" class="meddile-search" placeholder="全屏布局组件" @search="handleSearch">
            <template #enterButton>
                <AButton type="primary"> 搜一搜 </AButton>
            </template>
            <template #prefix>
                <svg-icon iconClass="search" style="color: #666; font-size: 16px"></svg-icon>
            </template>
        </AInputSearch>
        <div class="nav-box-list flex justify-around align-center">
            <div v-for="(item, index) in navBoxList" :key="index" class="flex flex-direction-column justify-center align-center cursor-pointer" @click="handleJump(item)">
                <AImage :width="45" :height="45" :preview="false" :src="item.image" />
                <div class="box-title">{{ item.title }}</div>
            </div>
        </div>
        <IScrollContainer :moveWidth="1075" :listLength="pageData.orgList.length" class="header-bar-org-container">
            <IOrgBox :class="{ 'idm-header-org-active': yunitOrg.id === pageData.currentOrg.id }" :componentProps="yunitOrg" @click="handleOrgBoxClick(yunitOrg)"></IOrgBox>
            <IOrgBox
                v-for="(item, index) in pageData.orgList"
                :key="index"
                :class="{ 'idm-header-org-active': item.id === pageData.currentOrg.id }"
                :componentProps="item"
                @click="handleOrgBoxClick(item)"></IOrgBox>
            <div class="add-org-box flex align-center cursor-pointer" @click="handleCreateOrg">
                <svg-icon iconClass="add" class="add-org-box-icon"></svg-icon>
                <div>创建或申请加入组织</div>
            </div>
        </IScrollContainer>
    </div>
</template>

<script lang="ts" setup>
import { yunitLogo, logo1, createEntranceImage } from '@/assets/images'
import { defaultSettings } from '@/settings/defaultSetting'
import type { MenuProps } from 'ant-design-vue'
import IOrgBox from '@/components/ListBox/IOrgBox.vue'
import { SearchOutlined, RightOutlined } from '@ant-design/icons-vue'
import { useUserStore } from '@/store/modules/user'
import { useDetailLayoutStore } from '@/store/modules/detailLayout'

import { isUrl } from '@/utils/is'
import { useHomeCoreApi, useUserApi } from '@/apis'
import { getImagePath } from '@/utils'
import emitter from '@/utils/bus'
import AllMessage from '@/views/message/list/AllMessage.vue'
import { sendListMap, navBoxList, myActionList } from '@/settings/navbarSettings'
import { throttle } from 'lodash-es'
const detailLayoutStore = useDetailLayoutStore()
const userStore = useUserStore()
const propData = defineProps({
    navList: {
        type: Array<MenuItem>,
        default: () => []
    }
})
const messageCount = computed(() => {
    if (userStore?.userInfo?.messageCount) {
        return Number(userStore.userInfo.messageCount)
    }
    return 0
})

const activityList = [
    {
        title: '活动一二三四'
    },
    {
        title: '活动一二三'
    }
]
const router = useRouter()
const route = useRoute()
const selectedKeys = ref<string[]>(['index'])
const searchText = ref<string>('')
const pageData = reactive<{ [x: string]: any }>({
    isScrollTop: true,
    currentOrg: { id: '' },
    createOrgVisible: false,
    orgList: [],
    isShadow: false,
    menuOpacity: 0,
    isShowMenuLine: true,
    currentMessageActive: 2,
    messageList: [],
    messageLoading: false
})
// yunit默认
const yunitOrg = reactive({
    orgphoto: logo1,
    companyName: '公司',
    orgname: '云IT · 社区',
    userCount: 0,
    id: ''
})
const selectedItems: any = computed(() => {
    const arr: any = []
    selectedKeys.value.forEach((key) => {
        const item = propData.navList.find((item) => item.routeName === key)
        item && arr.push(item)
    })
    return arr
})
const menuNavList: any = computed(() => propData.navList.filter((item) => !item.hiddenInMenu))
const hiddenMenu: any = computed(() => {
    const hiddenMenuList = propData.navList.filter((item) => item.hiddenInMenu)
    const hiddenKeys = hiddenMenuList ? hiddenMenuList.map((item: any) => item.routeName) : []
    return selectedKeys.value.some((key: string) => hiddenKeys.indexOf(key) !== -1)
})

const isIndexPage = computed(() => {
    return route.name === 'index'
})
const isDetailPage = computed(() => {
    const routerName = route.name as string
    return routerName.indexOf('detail') > -1
})
let beforeScrollTop = document.documentElement.scrollTop
const handleScroll = () => {
    const afterScrollTop = document.documentElement.scrollTop
    // 菜单显示
    handleMenuShow(afterScrollTop)
    // 导航显示
    handleNavbarShow(afterScrollTop)
}
const handleNavbarShow = (afterScrollTop: number) => {
    const upDown = afterScrollTop - beforeScrollTop
    if (upDown === 0) return false
    beforeScrollTop = afterScrollTop
    const isUpDown = upDown > 0 ? 'down' : 'up' // 判断往上还是往下
    if (afterScrollTop >= 300 && isDetailPage.value) {
        if (isUpDown === 'down') {
            pageData.isShowMenuLine = false
            detailLayoutStore.setMdTitleTop('0px')
        } else {
            pageData.isShowMenuLine = true
            detailLayoutStore.setMdTitleTop('55px')
        }
    }
}
const handleMenuShow = (afterScrollTop: number) => {
    if (!isIndexPage.value) {
        pageData.isShadow = true
        pageData.menuOpacity = 1
        if (afterScrollTop < 160) {
            pageData.isShowMenuLine = true
        }
        return
    }
    // 334 210
    if (afterScrollTop > 334) {
        pageData.isShadow = true
        pageData.menuOpacity = 1
    } else if (afterScrollTop <= 354 && afterScrollTop >= 160) {
        pageData.menuOpacity = (afterScrollTop - 210) / (354 - 160)
        pageData.isShadow = false
    } else {
        pageData.menuOpacity = 0
        pageData.isShadow = false
    }
}
// 获取消息列表
const handleFetchMessageList = () => {
    useUserApi
        .requestMyMessageList({
            pageSize: 20,
            pageNo: 1
        })
        .then((res) => {
            if (res.success) {
                pageData.messageList = res.result.records
            }
        })
        .finally(() => {
            pageData.messageLoading = false
        })
}
// 消息tabs change
const handleMessageTabChange = (type: number) => {
    pageData.messageLoading = true
    pageData.currentMessageActive = type
    if (type === 2) handleFetchMessageList()
}

// 消息弹出事件
const messageVisibleChange = (visible: boolean) => {
    if (visible) {
        handleMessageTabChange(pageData.currentMessageActive)
    }
}

// 更新消息
const updateMessage = (index: number) => {
    pageData.messageList[index].readStatus = 1
    userStore.handleGetUserInfo()
}
watch(
    () => route.name,
    (newV) => {
        const arr = newV?.toString().split('-')
        if (arr && arr.length > 2) {
            selectedKeys.value = [arr.slice(0, -1).join('-')]
        } else {
            selectedKeys.value = [newV as string]
        }
        nextTick(() => {
            handleScroll()
        })
        pageData.currentOrg = yunitOrg
    },
    {
        immediate: true
    }
)

const reload: any = inject('reload')
const handleJumpIndexPage = async () => {
    await router.push({ name: 'indexPage', params: { userId: userStore.userInfo && userStore.userInfo.id } })
    reload()
}
nextTick(() => {
    const thScroll = throttle(handleScroll, 200)
    document?.addEventListener('scroll', thScroll)
    handleScroll()
})

const handleCreateOrg = () => {
    router.push({
        name: 'index-org'
    })
}
const handleJump = (menuItem?: MenuItem) => {
    if (isUrl(menuItem?.routeName)) {
        return window.open(menuItem?.routeName, '_blank')
    }
    if (menuItem?.routeName) {
        router.push({
            name: menuItem.routeName
        })
    }
}
// 菜单点击
const handleMenuClick: MenuProps['onClick'] = (e) => {
    let menuItem = menuNavList.value.find((el: MenuItem) => el.routeName === e.key)
    if (!menuItem) {
        menuNavList.value.forEach((item: MenuItem) => {
            if (item.children && item.children.length > 0) {
                item.children.forEach((child: MenuItem) => {
                    if (child.routeName === e.key) {
                        menuItem = child
                    }
                })
            }
        })
    }
    handleJump(menuItem)
}
// 菜单点击
const handleSubMenuClick: MenuProps['onClick'] = (key: any) => {
    let menuItem = menuNavList.value.find((el: MenuItem) => el.routeName === key)
    if (!menuItem) {
        menuNavList.value.forEach((item: MenuItem) => {
            if (item.children && item.children.length > 0) {
                item.children.forEach((child: MenuItem) => {
                    if (child.routeName === key) {
                        menuItem = child
                    }
                })
            }
        })
    }
    handleJump(menuItem)
}
// 搜索
const handleSearch = () => {
    console.log(searchText.value)
}
// 发布跳转
const handleSendClick = (item: any) => {
    if (item.type === 'window') {
        window.open(item.url)
    } else {
        router.push({
            name: item.url
        })
    }
}
// 点击创作者中心
const handleCreativeCenterClick = () => {
    // router.push({
    //     name: 'index-creativeCenter'
    // })
    window.open('/creativeCenter')
}
useHomeCoreApi.requestCoreMyOrgList().then((res) => {
    if (res.success) {
        pageData.orgList = res.result
    }
})
useHomeCoreApi.requestCoreAllUserTotal().then((res) => {
    yunitOrg.userCount = res.result
})
const handleOrgBoxClick = (item: any) => {
    pageData.currentOrg = item
    emitter.emit('orgChange', item)
}
const handleClickActionBtn = (action: string) => {
    switch (action) {
        case 'logout':
            userStore.handleUserLogout()
            break
        case 'myOrg':
            router.push({
                name: 'indexPage',
                params: {
                    userId: userStore.userInfo?.id
                },
                query: {
                    tab: 'org'
                }
            })
            break
        case 'setting':
            router.push({
                name: 'AccountPassword'
            })
            break
        case 'personInfo':
            router.push({
                name: 'PersonInfo'
            })
            break
        case 'AccessKeyManage':
            router.push({
                name: 'AccessKeyManage'
            })
            break
    }
}
</script>

<style lang="scss" scoped>
.head-bar-container {
    background-color: #fff;
    overflow: hidden;
    margin-bottom: 15px;
    padding: 10px 0;
    .head-bar-container-main {
        transition: height 0.3s ease-in;
        max-width: 1280px;
        flex: 1;
        margin: 0 auto;
        .nav-title {
            font-size: 16px;
            color: rgba(0, 0, 0, 0.85);
            line-height: 100%;
            margin-left: 20px;
        }
    }
    ::v-deep(.ant-menu-horizontal) {
        margin: 0 0 0 20px;
        font-size: 16px;
        border-color: transparent;
        line-height: 100%;
        height: 100%;
    }
    ::v-deep(.ant-menu-item) {
        padding: 0 15px !important;
    }
    ::v-deep(.ant-menu-item::after),::v-deep(.ant-menu-submenu::after),::v-deep(.ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-submenu-selected::after) {
        bottom: 35px !important;
    }
    .input-bgcolor {
        background-color: rgb(243, 245, 246);
    }
    ::v-deep(.ant-input-affix-wrapper) {
        @extend .input-bgcolor;
        input {
            @extend .input-bgcolor;
        }
    }
    ::v-deep(.ant-btn-link) {
        color: #333;
    }
    .login-status-box {
        margin-left: 50px;
        .message-btn {
            margin: 0 10px;
            font-size: 16px;
        }
        .header-avatar {
            margin: 0 0 4px 0;
        }
    }
    .login-reg-box {
        background: rgba(30, 128, 255, 0.05);
        border: 1px solid rgba(30, 128, 255, 0.3);
        border-radius: 4px;
        padding: 6px 15px;
        color: #007fff;
        font-size: 14px;
        font-weight: 400;
        margin-right: 10px;
        overflow: hidden;
        .line {
            margin: 0 10px;
            color: rgba(30, 128, 255, 0.3);
        }
    }
}
.head-bar-container-fix {
    position: fixed;
    width: 100%;
    z-index: 600;
    top: 0;
    box-shadow: none;
    transition: all 0.3s;
}
.head-bar-container-shadow {
    box-shadow: 0 2px 6px 0 rgba($color: #000000, $alpha: 0.06);
}
.want-send-top {
    width: 400px;
    // border-bottom: 1px solid #ccc;
    padding: 5px;
    margin: 0 0 10px 0;
    font-size: 14px;
    color: #333;
    .flex-direction-column{
        width: 20%;
        margin-bottom: 10px;
        margin-top:10px;
        &:hover{
            .want-send-top-icon{
                background-color: #ebecee;
                box-shadow: 0 2px 6px 0 rgba($color: #000000, $alpha: 0.1);
            }
        }
    }
    .want-send-top-icon {
        transition: all 0.3s;
        width: 55px;
        height: 55px;
        background-color: #F7F8FA;
        border-radius: 50%;
        margin: 0 0 5px 0;
        color: #888;
    }
}
.want-send-bottom {
    .want-send-bottom-activity-list {
        margin: 5px 0 0 0;
        span {
            margin: 0 20px 0 0;
        }
    }
    .more-activity {
        color: #999;
        span {
            margin: 0 -3px 0 0;
        }
    }
}
.meddile-search {
    width: 400px;
    display: block;
    margin: 0 auto;
    border-radius: 50px;
    ::v-deep(.ant-input-affix-wrapper) {
        border-color: #1890ff;
        background-color: #fff;
        border-top-left-radius: 50px !important;
        border-bottom-left-radius: 50px !important;
    }
    ::v-deep(.ant-input-search-button) {
        border-radius: 0 50px 50px 0 !important;
    }
}
.nav-box-list {
    font-size: 14px;
    margin: 20px auto 10px;
    ::v-deep(.ant-image) {
        transition: all 0.3s;
    }
    > div:hover {
        ::v-deep(.ant-image) {
            transform: scale(1.1);
        }
    }
    .box-title {
        margin: 4px 0 0 0;
        font-size: 16px;
        color: #666;
    }
}
.header-bar-org-container {
    width: 1190px;
    height: 96px;
    margin: 0 auto;
}
.add-org-box {
    width: 254px;
    margin: 5px 5px 5px 5px;
    border-radius: 3px;
    padding: 26px 20px;
    box-shadow: 0 0 7px #ddd;
    color: #999;
    font-size: 16px;
    .add-org-box-icon {
        font-size: 20px;
        color: #ccc;
        margin: 0 10px 0 0;
    }
}
.top-message-list-container {
    width: 520px;
    .title-tab {
        border-bottom: 1px solid #ccc;
        padding: 10px 0;
        font-size: 16px;
        > div {
            border-right: 1px solid #ccc;
        }
        div {
            padding: 5px 0;
            &:last-child {
                border-right: 0;
            }
        }
        .tab-active {
            color: #40a9ff;
        }
    }
    .tab-content {
        padding: 10px;
        height: 300px;
        overflow-x: hidden;
        overflow-y: auto;
    }
    .tab-bottom {
        border-top: 1px solid #ccc;
        padding: 10px;
        color: #666;
    }
}
</style>

<style lang="scss">
.ant-menu{
    font-size: 16px;
}
.navbar-avatar-popover {
    width: 290px;
    .ant-popover-inner-content {
        padding: 0;
        .create-entrance {
            color: #797979;
            padding: 20px;
            border-top: 1px solid #eee;
            border-bottom: 1px dashed #eee;
            font-size: 14px;
            .create-text {
                color: #333;
                font-weight: 600;
            }
            .user-level {
                color: #0c80ec;
                font-size: 17px;
                margin: 0 0 0 5px;
            }
        }

        .hover-line {
            padding: 10px 25px;
            font-size: 15px;
            .line-text {
                margin: 2px 0 0 8px;
            }
            &.border {
                border-top: 1px solid #eee;
            }
            &:nth-child(2) {
                padding-top: 15px;
            }
            &:last-of-type {
                padding-bottom: 20px;
            }
        }
    }
    .navbar-avatar-popover-top {
        padding: 15px 20px 20px;
        border-bottom: 1px solid #eee;

        .popover-nickname {
            font-size: 18px;
        }
        .popover-saying {
            font-size: 12px;
            color: #ccc;
        }
        .number {
            font-weight: 600;
            font-size: 18px;
            margin: 15px 0 0 0;
        }
        .title {
            font-size: 14px;
        }
    }
}
.message-popover {
    .ant-popover-inner-content {
        padding: 0;
    }
}
</style>
