<template>
    <div class="AccessKeyManage_app page-max-width">
        <div class="title flex_between">
            <div class="title_left">
                AccessKey管理
            </div>
            <div class="title_right flex_end">
                <div class="pointer" @click="backHome()">
                    <span>返回我的主页 > </span>
                </div>
            </div>
        </div>
        <div class="form">
            <div class="row flex_between">
                <div class="row_left">AccessKey ID</div>
                <div class="row_right flex_between">
                    <div>{{ userInfo.id }}</div>
                    <div class="action_button">
                        <span class="pointer" @click="copyToClipboard(userInfo.id)">复制</span>
                    </div>
                </div>
            </div>
            <div class="row flex_between">
                <div class="row_left">AccessKey Secret</div>
                <div class="row_right flex_between">
                    <div>{{ userInfo.accesskeySecret || '未生成' }}</div>
                    <div class="action_button">
                        <span class="pointer" @click="copyToClipboard(userInfo.accesskeySecret)">复制</span>
                        <span class="pointer" @click="changeAccessKeyInfoConfirm({ isreset: true })">重新生成</span>
                    </div>
                </div>
            </div>
            <div class="row flex_between">
                <div class="row_left">状态</div>
                <div class="row_right flex_between">
                    <div>{{ !userInfo.accesskeyOpen ? '已启用' : '未启用' }}</div>
                    <div class="action_button">
                        <span class="pointer" @click="changeAccessKeyInfo({ isChangeOpen: true })">{{ !userInfo.accesskeyOpen ? '禁用' : '启用' }}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex_between" style="align-items: flex-end;">
            <div class="title_left sub-title">
                授权范围
            </div>
            <a-checkbox v-model:checked="pageState.checkAll" :indeterminate="pageState.indeterminate" @change="onCheckAllChange">
                全选
            </a-checkbox>
        </div>
        <div class="role-rang-box">
            <a-checkbox-group v-model:value="pageState.checkedList">
                <div v-for="(item, index) in pageState.rangList" :key="index" class="row flex_between">
                    <div class="flex_between">
                        <img :src="getImagePath(item['orgphoto'])" />
                        <div>
                            <div>{{ item['orgname'] }}</div>
                            <div class="remark-font">{{ item['userCount'] }}人</div>
                        </div>
                    </div>
                    <div class="remark-font">企业：{{ item['companyName'] }}</div>
                    <div>
                        <a-checkbox :value="item['id']"></a-checkbox>
                    </div>
                </div>
            </a-checkbox-group>
        </div>
        <div class="role-rang-btn-box">
            <a-button type="primary" size="large" @click="saveAccessKeyRang">保存授权范围</a-button>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { useUserStore } from '@/store/modules/user'
import { isEmail, isPhone } from '@/utils/is'
import { getImagePath } from '@/utils'
import { message } from '@/plugins/globalComponents'
import { useUserApi, useOrgAboutApi } from '@/apis'
import { useRouter } from 'vue-router'
import type { SmsData } from '@/apis/user'
import { Modal } from 'ant-design-vue'
const router = useRouter()
const userStore = useUserStore()
const { userInfo } = toRefs<any>(userStore)
const pageState = reactive({
    indeterminate: false,
    checkAll: false,
    rangList: [],
    checkedList: [],
    loading: false,
    total: 0
})
const onCheckAllChange = (e: any) => {
    Object.assign(pageState, {
        checkedList: e.target.checked ? pageState.rangList.map((item: any) => item.id) : [],
        indeterminate: false
    })
}
watch(
    () => pageState.checkedList,
    val => {
        pageState.indeterminate = !!val.length && val.length < pageState.rangList.length
        pageState.checkAll = val.length === pageState.rangList.length
    }
)

const changeAccessKeyInfoConfirm = (data: { [x: string]: any }) => {
    if (confirm(data.isreset ? '重新生成将会使得用原有AccessKey的所有接入端失效，需要使用最新生成的才有效，确定要重新生成AccessKey吗？' : '确定要执行操作吗？')) {
        changeAccessKeyInfo(data)
    }
}
const changeAccessKeyInfo = (data: { [x: string]: any }) => {
    useUserApi.resetAccessKeyApi(data).then((res) => {
        if (res.success) {
            message.success(res.message)
            userStore.handleGetUserInfo()
        } else {
            message.error(res.message)
        }
    }).catch((err) => {
        console.log(err)
    })
}
const saveAccessKeyRang = () => {
    changeAccessKeyInfo({
        accesskeyRang: pageState.checkedList.join(',')
    })
}
const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(function () {
        message.success('复制成功')
    }).catch(function () {
        message.error('复制失败')
    })
}
pageState.loading = true
const params = {
    pageNo: 1,
    pageSize: 200,
    joinStatus: 1
}
useOrgAboutApi
    .requestMyOrgList(params)
    .then((res) => {
        if (res.success) {
            pageState.rangList = res.result.records
            pageState.total = res.result.total
            pageState.checkedList = (userInfo.value?.accesskeyRang && userInfo.value?.accesskeyRang.split(',')) || []
        } else {
            message.error(res.message || '获取列表失败！')
        }
        pageState.loading = false
    })
    .catch(() => {
        message.error('请求失败！')
        pageState.loading = false
    })

const backHome = () => {
    router.push({
        name: 'indexPage',
        params: {
            userId: userInfo.value.id
        }
    })
}
</script>
<style lang="scss" scoped>
.AccessKeyManage_app {
    padding: 30px 40px;
    margin-bottom: 20px !important;
    border-radius: 5px;
    background: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

    .title_left {
        font-size: 24px;
        font-weight: 600;
        color: #333;

        &.sub-title {
            font-size: 18px;
            margin-top: 20px;
        }
    }

    .title {
        .title_right {
            text-align: right;
            font-size: 14px;
            color: #8590A6;
        }
    }

    .form {
        .row {
            height: 73px;
            padding: 0 0 0 5px;
            font-size: 13px;
            color: #333;
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);

            .row_right {
                .status_text {
                    color: #999;
                }

                .action_button {
                    text-align: right;
                    width: 150px;
                    color: #007fff;

                    &>span {
                        margin-right: 10px;
                    }
                }
            }
        }
    }

    .role-rang-box {
        margin-top: 15px;

        >div {
            width: 100%;
        }

        .row {
            border-radius: 5px;
            box-shadow: 0 0px 5px rgba(0, 0, 0, 0.15);
            padding: 8px 20px 8px 10px;
            margin-bottom: 15px;

            img {
                width: 40px;
                height: 40px;
                border-radius: 5px;
                margin-right: 10px;
            }

            .remark-font {
                font-size: 13px;
                color: #999999;
            }
        }
    }

    .role-rang-btn-box {
        padding: 20px;
        text-align: center;
    }
}
</style>
<style lang="scss">
.changeEmailPop {
    .row {
        margin-bottom: 20px;

        .label {
            white-space: nowrap;
        }

        .ant-input-affix-wrapper {
            height: 42px;
        }
    }

    .notice {
        margin: 10px 0 20px 0;
        color: #999;
    }

    .button_block {
        margin: 30px 0 20px 0;
    }

    .link {
        text-align: center;
        color: #007fff;
    }

    .idm-component-login-box-get-code {
        span {
            color: #007fff;
        }
    }
}

.changePasswordPop {
    .row {
        margin-bottom: 15px;

        .ant-input-affix-wrapper {
            height: 42px;
        }

        &>.ant-input {
            height: 42px;
        }
    }

    .button_block {
        margin-top: 30px;
    }

    .idm-component-login-box-get-code {
        span {
            color: #007fff;
        }
    }
}
</style>
