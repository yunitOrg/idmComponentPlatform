<template>
    <div class="page-max-width my-page-container">
        <div class="my-index-page-top">
            <img :src="getImagePath(pageData.userInfo.centerBackground) || defaultBgImage" object-fit="cover" class="cover-bg" alt="封面加载失败" />
            <a-upload v-if="isSelfPage" accept="image/*" :showUploadList="false" :beforeUpload="() => false" @change="handleFileChange">
                <div class="edit-btn edit-background cursor-pointer"><svg-icon iconClass="camera" style="margin: 0 3px -3px 0; font-size: 18px"></svg-icon> 编辑封面图片</div>
            </a-upload>
        </div>

        <div class="userinfo-container">
            <div class="userinfo-container-left">
                <AAvatar :size="160" class="user-avatar" :src="getImagePath(pageData.userInfo.userphoto) || defaultSettings.userphoto" alt="头像加载失败" />
                <div class="text-center cursor-pointer" style="padding: 6px 0 0 0">
                    <span v-if="isSelfPage" class="edit-btn" @click="editPersonInfo()">编辑个人资料</span>
                </div>
            </div>
            <div class="userinfo-base">
                <div>
                    <span class="nickname">{{ pageData.userInfo.nickname }}</span>
                    <span class="saying">{{ pageData.userInfo.saying || '赶紧去说句话吧' }}</span>
                </div>
                <div class="userinfo-line flex align-center">
                    <svg-icon iconClass="gongwen" style="margin: 0 0 0 2px" class="userinfo-icon"></svg-icon>
                    <span v-if="pageData.userInfo.businessName" class="intr-text">{{ pageData.userInfo.businessName }}</span>
                    <span v-if="getItemValue(pageData.userInfo.businessId, pageData.jobList)" class="intr-text">{{
                        getItemValue(pageData.userInfo.businessId, pageData.jobList)
                    }}</span>
                    <span v-for="(job, index) in getArrData(pageData.userInfo.jobInfo)" :key="index" class="intr-text">{{ job }}</span>
                </div>
                <div class="userinfo-line flex align-center">
                    <svg-icon iconClass="school" style="font-size: 20px; margin: 0 -2px 0 0" class="userinfo-icon"></svg-icon>
                    <span v-for="(school, index) in getArrData(pageData.userInfo.schoolinfo)" :key="index" class="intr-text">{{ school }}</span>
                    <img class="intr-text" style="padding: 0; margin: 0 0 0 10px; width: 16px" :preview="false" :src="pageData.userInfo.gender == 1 ? memberMale : memberfemale" />
                </div>
                <div v-if="pageData.isShowMore && pageData.userInfo.introduce" class="userinfo-line flex align-center">
                    <svg-icon iconClass="settings" style="font-size: 16px; margin: 0 -2px 0 2px" class="userinfo-icon"></svg-icon>
                    <span class="intr-text">{{ pageData.userInfo.introduce }}</span>
                </div>
                <div
                    v-if="pageData.userInfo.introduce"
                    class="userinfo-line flex align-center userinfo-icon cursor-pointer"
                    style="margin-bottom: 10px"
                    @click="pageData.isShowMore = !pageData.isShowMore">
                    <DownOutlined :class="[pageData.isShowMore && 'arrow-revert']" style="margin: 0 7px 0 12px"></DownOutlined>
                    <span v-if="pageData.isShowMore">收起</span>
                    <span v-else>查看更多</span>
                </div>
            </div>
            <ARow :gutter="[20, 20]">
                <ACol :span="18">
                    <div class="idm-component-common-box index-page-tab-container">
                        <ATabs v-model:activeKey="pageData.activeKey" :tabBarStyle="{ padding: '0 20px' }" @change="tabsChange">
                            <ATabPane v-for="item in currentTabList" :key="item.key">
                                <template #tab>
                                    {{ item.text }} <span class="tab-number" :style="{ color: pageData.activeKey === item.key ? '' : '#ccc' }">{{ item.num }}</span>
                                </template>
                                <a-spin :spinning="pageData.loading">
                                    <template v-if="pageData.listData && pageData.listData.length">
                                        <div v-if="pageData.activeKey === 'org'">
                                            <IOrgBox2
                                                v-for="(orgItem, index) in pageData.listData"
                                                :key="index"
                                                :componentProps="orgItem"
                                                style-type="2"
                                                show-invite
                                                show-manage
                                                :show-join="false"
                                                @handle-org-invite="handleModalBtnClick(orgItem, 'orgInviteModalVisible')"
                                                @handle-member-manage="handleModalBtnClick(orgItem, 'orgMemberModalVisible')"
                                                @handle-org-manage="handleModalBtnClick(orgItem, 'orgManageModalVisible')" />
                                        </div>
                                        <div v-if="item.pagination" style="text-align: center; margin: 20px 0">
                                            <a-pagination
                                                v-model:current="pageData.pageNo"
                                                v-model:page-size="pageData.pageSize"
                                                show-size-changer
                                                :total="pageData.total"
                                                @change="handlePageChange" />
                                        </div>
                                    </template>
                                    <a-empty v-else />
                                </a-spin>
                            </ATabPane>
                        </ATabs>
                    </div>
                </ACol>
                <ACol :span="6">
                    <AboutUsBox></AboutUsBox>
                </ACol>
            </ARow>
        </div>
    </div>
    <OrgInviteModal v-model:visible="pageData.orgInviteModalVisible" :itemData="pageData.orgItemData" />
    <OrgMemberModal v-model:visible="pageData.orgMemberModalVisible" :itemData="pageData.orgItemData" />
    <OrgManageModal v-model:visible="pageData.orgManageModalVisible" :itemData="pageData.orgItemData" />
    <IVueCropper v-if="pageData.isCropperImageShow" :isCropperImageShow="pageData.isCropperImageShow" :file="pageData.fileData" @closeCropper="closeCropper"></IVueCropper>
</template>

<script lang="ts" setup>
import { defaultBgImage, memberMale, memberfemale } from '@/assets/images'
import { message } from 'ant-design-vue'
import { defaultSettings } from '@/settings/defaultSetting'
import { useUserStore } from '@/store/modules/user'
import { DownOutlined } from '@ant-design/icons-vue'
import { useUserApi, coreApi, useOrgAboutApi } from '@/apis'
import { getImagePath } from '@/utils'
import { useRouter } from 'vue-router'
const userStore = useUserStore()
const route = useRoute()
const router = useRouter()
const propData = defineProps({
    userId: {
        type: String,
        default: ''
    }
})
const isSelfPage = computed(() => propData.userId === userStore.userInfo?.id)
const pageData = reactive<{ [x: string]: any }>({
    activeKey: 'trends',
    tabList: [
        {
            text: isSelfPage ? '我的动态' : '他的动态',
            key: 'trends'
        },
        {
            text: '组织',
            key: 'org',
            num: userStore.userInfo ? userStore.userInfo.orgTotal : '',
            pagination: true
        },
        {
            text: '收藏',
            key: 'collect',
            num: 0
        },
        {
            key: 'follow',
            text: '关注'
        }
    ],
    listData: [],
    total: 0,
    pageNo: 1,
    pageSize: 10,
    loading: false,
    orgInviteModalVisible: false,
    orgMemberModalVisible: false,
    orgManageModalVisible: false,
    orgItemData: {},
    userInfo: {
        centerBackground: '',
        userphoto: '',
        nickname: '',
        saying: '',
        businessName: '',
        jobInfo: '',
        schoolinfo: '',
        gender: 1
    },
    jobList: [],
    isShowMore: false,
    isCropperImageShow: false,
    fileData: null
})
const editPersonInfo = () => {
    router.push({
        name: 'PersonInfo'
    })
}
const closeCropper = async (e: any) => {
    console.log('关闭', e)
    pageData.isCropperImageShow = false
    if (e.type === 1) {
        const res = await useUserApi.uploadFileApi({
            file: e.file,
            data: {
                upFileType: 'image'
            }
        })
        if (res.success) {
            const { filePath } = res.result
            const res1 = await useUserApi.editUserInfoApi({
                centerBackground: filePath
            })
            if (!res1.success) message.error(res1.message || '修改背景图失败')
            pageData.userInfo.centerBackground = filePath
        }
    }
}
const getItemValue = (id: string, arr: Array<any>) => {
    const item = arr.find((el) => el.id === id)
    if (item) return item.itemValue
    return ''
}

const getArrData = (dataStr: string) => {
    let arr = []
    if (dataStr) {
        try {
            arr = JSON.parse(dataStr)
        } catch (error) {}
    }
    return arr
}

const currentTabList = computed(() => {
    if (!isSelfPage.value) {
        return pageData.tabList.filter((item: any) => item.key !== 'org')
    }
    return pageData.tabList
})

watch(
    () => route,
    (newV) => {
        if (newV.query.tab) {
            pageData.activeKey = newV.query.tab as string
        }
        if (userStore.userInfo?.id === propData.userId) {
            pageData.userInfo = userStore.userInfo
        } else {
            useUserApi
                .requestGetUserInfo({
                    user_id: propData.userId
                })
                .then((res) => {
                    pageData.userInfo = res.result
                })
        }
    },
    { immediate: true, deep: true }
)
const handleFileChange = async (e: any) => {
    pageData.fileData = e.file
    pageData.isCropperImageShow = true
}
const resetPagination = () => {
    pageData.listData = []
    pageData.total = 0
    pageData.pageNo = 1
    pageData.pageSize = 10
}
const tabsChange = () => {
    resetPagination()
    getListData()
}
const getListData = () => {
    switch (pageData.activeKey) {
        case 'org':
            handleGetOrgList()
            break
    }
}
const handleGetOrgList = () => {
    pageData.loading = true
    const params = {
        pageNo: pageData.pageNo,
        pageSize: pageData.pageSize,
        joinStatus: 1
    }
    useOrgAboutApi
        .requestMyOrgList(params)
        .then((res) => {
            if (res.success) {
                pageData.listData = res.result.records
                pageData.total = res.result.total
            } else {
                message.error(res.message || '获取列表失败！')
            }
            pageData.loading = false
        })
        .catch(() => {
            message.error('请求失败！')
            pageData.loading = false
        })
}
const handlePageChange = () => {
    getListData()
}
const handleModalBtnClick = (itemData: any, key: string) => {
    pageData.orgItemData = itemData
    pageData[key] = true
}
coreApi.requestWebInfoListByGroup({ groupCd: 'job' }).then((res: any) => {
    if (res.success) {
        pageData.jobList = res.result
    }
})

onUpdated(() => {
    getListData()
})
</script>

<style lang="scss" scoped>
.my-page-container {
    padding: 0 0 20px;
}
.my-index-page-top {
    position: relative;
    width: 100%;
    height: 260px;
    border-radius: 5px 5px 0 0;
    overflow: hidden;
    .cover-bg {
        position: absolute;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    .edit-btn {
        position: absolute;
        top: 10px;
        right: 10px;
        color: rgba($color: #fff, $alpha: 0.8);
        z-index: 1;
        font-size: 12px;
        border: 1px solid rgba($color: #fff, $alpha: 0.8);
        border-radius: 50px;
        padding: 5px 10px;
    }
    .edit-background:hover {
        color: #a5abb1;
        border-color: #a5abb1;
    }
}
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

        .arrow-revert {
            transform: rotate(180deg);
        }
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
