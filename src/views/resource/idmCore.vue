<template>
    <div class="idm-core-header-box">
        <div class="idm-logo">
            <img :src="logoGreenImage">
            <div>IDM-Core</div>
        </div>
        <div class="sub-title">一个组件标准化、可视化拖拽低代码的框架</div>
        <div class="idm-nav-btn-box">
            <AButton size="large" @click="openWin('https://yunit-code.github.io/zh/')">官方文档</AButton>
            <AButton size="large" @click="downloadStaticFile(null)" type="primary" style="width:130px">下载最新版</AButton>
            <AButton size="large" @click="openWin('https://yunit-code.github.io/idm/index.html#/develop/test')">快速体验
            </AButton>
        </div>
        <div class="nav-version-box">
            最新版本 ： <span>{{ pageData.records.length>0?pageData.records[0].version:'暂无' }}</span><a @click="pageData.visible=true">免责声明</a>
        </div>
    </div>
    <div class="idm-core-content-outbox">
        <div class="idm-core-content-box">
            <div v-if="userStore.userInfo&&userIdRole.includes(userStore.userInfo.id)" style="text-align:right">
                <AButton size="large" type="primary" @click="upnew">上传新版本</AButton>
            </div>
            <div class="version-card">
                <h3 id="jie-shao">介绍</h3>
                <p>IDM-Core 遵循 <a href="https://semver.org/lang/zh-CN/" target="_blank">Semver</a> 语义化版本规范。</p>
                <p><strong>发布节奏</strong></p>
                <ul>
                    <li>修订号：每周发布，包含新特性和问题修复。</li>
                    <li>次版本号：每隔一至二个月发布，包含新特性和较大的功能更新，向下兼容。</li>
                    <li>主版本号：发布时间不定，包含不兼容更新。</li>
                </ul>
            </div>
            <div v-for="item in pageData.records" :key="item.id" class="version-card">
                <div v-if="userStore.userInfo&&userIdRole.includes(userStore.userInfo.id)" class="version-edit">
                    <AButton @click="edit(item)">修改</AButton>
                    <AButton @click="handleDeleteClick(item.id)">删除</AButton>
                </div>
                <h3 :id="`v${item.version}`">v{{ item.version }}</h3>
                <p><code>{{ item.updateDate }}</code></p>
                <p v-if="item.features"><strong>Features</strong></p>
                <ul v-if="item.features">
                    <li v-for="(sitem,sindex) in item.features.split('\n')" :key="sindex">{{ sitem }}</li>
                </ul>
                <p v-if="item.bugfixes"><strong>Bug Fixes</strong></p>
                <ul v-if="item.bugfixes">
                    <li v-for="(sitem,sindex) in item.bugfixes.split('\n')" :key="sindex">{{ sitem }}</li>
                </ul>
                <h3 class="download-core">下载：<a href="javascript:;" @click="downloadStaticFile(item.zipPath)" >{{ item.zipFilename }}</a></h3>
            </div>
        </div>
    </div>
    <a-modal v-model:visible="pageData.editVisible" destroyOnClose :confirmLoading="pageData.confirmLoading" :keyboard="false" :maskClosable="false" wrapClassName="idmcore-modal" width="1000px" ok-text="保存" title="IDM版本维护" @ok="onOk">
        <a-form ref="formRef" :model="formState" layout="vertical" name="form_in_modal">
            <a-form-item name="id" hidden />
            <a-form-item name="updateDate" label="更新日期" :rules="[{ required: true, message: '请按YYYY-MM-DD格式输入更新日期!' }]">
                <a-input v-model:value="formState.updateDate" placeholder="请按YYYY-MM-DD格式输入"/>
            </a-form-item>
            <a-form-item name="features" label="Features（多个按回车换行）">
                <a-textarea :autosize="{ minRows: 2, maxRows: 6 }" v-model:value="formState.features" />
            </a-form-item>
            <a-form-item name="bugfixes" label="BugFixes（多个按回车换行）">
                <a-textarea :autosize="{ minRows: 2, maxRows: 6 }" v-model:value="formState.bugfixes" />
            </a-form-item>
            <a-form-item
                name="zipPath"
                extra="支持文件后缀： .zip"
                label="上传框架包(版本自动识别)"
                :rules="[{ required: true, message: '必填!' }]"
            >
                <IFileUpload
                    v-model:value="formState.zipPath"
                    :paramsData="{upFileType: 'other'}"
                />
            </a-form-item>
        </a-form>
    </a-modal>
    <a-modal v-model:visible="pageData.visible" destroyOnClose wrapClassName="idmcore-modal" width="1200px" title="免责声明" :footer="null">
        <h1>IDM 《免责声明》</h1>
        <div style="color:#999;font-size:16px">
            任何用户在使用由 IDM 技术开发团队（以下简称「本团队」）研发的系列开源界面组件库（以下简称「IDM」）前，请您仔细阅读并透彻理解本声明。您可以选择不使用 IDM ，若您一旦使用 IDM
            ，您的使用行为即被视为对本声明全部内容的认可和接受。
        </div>
        <ol>
            <li>IDM 是一款开源的可视化拖拽低代码的框架，主要用于更高效地开发应用系统。且 IDM 并不具备「互联网接入、网络数据存储、通讯传输以及窃取用户隐私」中的任何一项与用户数据等信息相关的动态功能，IDM 仅是
                前端框架或素材类的本地资源。</li>
            <li>您承诺秉着合法、合理的原则使用 IDM ，不利用 IDM 进行任何违法、侵害他人合法利益等恶意的行为，亦不将 IDM 运用于任何违反我国法律法规的 Web 平台。</li>
            <li>任何单位或个人因下载使用 IDM 而产生的任何意外、疏忽、合约毁坏、诽谤、版权或知识产权侵犯及其造成的损失 (包括但不限于直接、间接、附带或衍生的损失等)，本团队不承担任何法律责任。</li>
            <li>用户明确并同意本声明条款列举的全部内容，对使用 IDM 可能存在的风险和相关后果将完全由用户自行承担，本团队不承担任何法律责任。</li>
            <li>任何单位或个人在阅读本免责声明后，应在《MIT 开源许可证》所允许的范围内进行合法的发布、传播和使用 IDM
                等行为，若违反本免责声明条款或违反法律法规所造成的法律责任(包括但不限于民事赔偿和刑事责任），由违约者自行承担。</li>
            <li>本团队对 IDM 拥有知识产权（包括但不限于商标权、专利权、著作权、商业秘密等），上述产品均受到相关法律法规的保护。</li>
            <li>任何单位或个人不得在未经本团队书面授权的情况下对 IDM 本身申请相关的知识产权。</li>
            <li>如果本声明的任何部分被认为无效或不可执行，则该部分将被解释为反映本团队的初衷，其余部分仍具有完全效力。不可执行的部分声明，并不构成我们放弃执行该声明的权利。</li>
            <li>本团队有权随时对本声明条款及附件内容进行单方面的变更，并以消息推送、网页公告等方式予以公布，公布后立即自动生效，无需另行单独通知；若您在本声明内容公告变更后继续使用的，表示您已充分阅读、理解并接受修改后的声明内容。
            </li>
        </ol>
    </a-modal>
</template>

<script lang="ts" setup>
import { createVNode } from 'vue'
import { logoGreenImage } from '@/assets/images'
import { resourcePublish, componentPublishApi } from '@/apis'
import { defaultSettings } from '@/settings/defaultSetting'
import { Modal, message } from 'ant-design-vue'
import { baseURL } from '@/plugins/axios'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import { getImagePath } from '@/utils'
import { useUserStore } from '@/store/modules/user'
const userStore = useUserStore()
const formRef = ref()
const pageData = reactive<{ [x: string]: any }>({
    total: 0,
    records: [],
    searchParams: {
        pageNo: 1,
        pageSize: 20,
        sort: 0
    },
    conditionList: [],
    visible: false,
    editVisible: false,
    confirmLoading: false
})
const userIdRole = ['ff8080818761913c018761913c620000', 'ff8080818761913c018769996e140012']
const formState = reactive({
    id: '',
    updateDate: '',
    features: '',
    bugfixes: '',
    zipPath: []
})

const downloadStaticFile = async (url: any) => {
    if (!url) {
        url = pageData.records.length > 0 ? pageData.records[0].zipPath : url
    }
    if (!url) {
        return
    }
    componentPublishApi.downloadStaticFile(url)
}

const handleDeleteClick = async (data: any) => {
    const title = '确定要删除当前版本吗？'
    const content = ''
    const answer = await showConfirm(title, content)
    if (answer) {
        resourcePublish.requestDeleteIdmCore({ id: data }).then((res) => {
            if (res.success) {
                message.success('删除成功！')
                handleSearch()
            } else {
                message.error(res.message || '删除失败！')
            }
        }).catch(() => {
            message.error('请求失败！')
        })
    }
}
const onOk = async () => {
    pageData.confirmLoading = true
    formRef.value.validateFields().then(async (values: any) => {
        console.log('表单数据: ', values)
        const res = await resourcePublish.requestSaveIdmCore({
            ...formState,
            zipPath: formState.zipPath[0]?.url || '',
            zipFilename: formState.zipPath[0]?.name || ''
        })

        if (res.success) {
            message.success('保存成功！')
            formRef.value.resetFields()
            pageData.editVisible = false
        } else {
            message.error('保存失败！' + res.message)
        }
        pageData.confirmLoading = false
        handleSearch()
    }).catch((info: any) => {
        console.log('Failed:', info)
        message.error('表单校验失败，请检查！')
        pageData.confirmLoading = false
    })
}
const edit = (data: any) => {
    pageData.editVisible = true
    nextTick(() => {
        formRef.value.resetFields()
        formState.id = data.id
        formState.updateDate = data.updateDate
        formState.features = data.features
        formState.bugfixes = data.bugfixes
        formState.zipPath = [{
            url: data.zipPath,
            name: data.zipFilename
        }]
    })
}
const upnew = () => {
    pageData.editVisible = true
    nextTick(() => {
        formRef.value.resetFields()
        formState.id = ''
        formState.updateDate = ''
        formState.features = ''
        formState.bugfixes = ''
        formState.zipPath = []
    })
}
const openWin = (url: string) => {
    window.open(url, '_blank')
}
const handleSearch = () => {
    resourcePublish.getIdmCoreList({}).then((res) => {
        if (res.success) {
            pageData.records = res.result
        }
    })
}
handleSearch()

const showConfirm = (title: string, content: string) => {
    return new Promise((resolve) => {
        Modal.confirm({
            icon: createVNode(ExclamationCircleOutlined),
            title,
            content,
            cancelText: '取消',
            okText: '确定',
            onOk() {
                resolve(true)
            },
            onCancel() {
                resolve(false)
            }
        })
    })
}
</script>

<style lang="scss">
.idmcore-modal{
    ol{
        padding-left: 1.5em;
        margin-top: 10px;
    }
    li{
        font-size: 16px;
        line-height: 1.6;
        list-style: decimal;
        padding: 5px 0;
        &::marker {
            unicode-bidi: isolate;
            font-variant-numeric: tabular-nums;
            text-transform: none;
            text-indent: 0px !important;
            text-align: start !important;
            text-align-last: start !important;
        }
    }
}
.idm-core-header-box{
    background-color: #F7F8FA;
    text-align: center;
    .idm-logo{
        color: #2E9C6A;
        font-size: 40px;
        font-weight: 700;
        img{
            width: 120px;
            margin: 20px auto;
        }
    }
    .sub-title{
        font-size: 18px;
        color: #666666;
        margin-top: 10px;
        margin-bottom: 10px;
    }
    .idm-nav-btn-box{
        margin: 20px 0;
        button{
            margin: 0 10px;
        }
        .ant-btn:not(.ant-btn-danger):hover,
        .ant-btn:not(.ant-btn-danger):focus {
            color: #2E9C6A;
            border-color: #2E9C6A;
            &.ant-btn-primary:hover{
                color: #FFFFFF;
            }
        }
        .ant-btn-primary{
            background-color: #2E9C6A;
            border-color: #2E9C6A;
            color: #FFFFFF;
        }
    }
    .nav-version-box{
        color: #999;
        font-size: 16px;
        span{
            color: #2E9C6A;
        }
        a{
            margin-left: 100px;
            color: #999;
        }
        padding-bottom: 30px;
    }
}
.idm-core-content-outbox{
    background-color: #FFFFFF;
    padding-top: 10px;
}
.idm-core-content-box{
    max-width: 1230px;
    margin: auto;
    .version-card{
        position: relative;
        background: #ffffff;
        margin: 20px auto;
        padding: 20px 30px;
        box-shadow:0 0 15px rgba($color: #C6C6C6, $alpha: 0.5);
        border-radius: 10px;
        min-height: 100px;
        color: #333;
        font-size: 16px;
        p{
            color: #34495e;
            font-size: 14px;
            line-height: 26px;
            code{
                display: inline;
                margin: 2px 3px;
                padding: 2px 5px;
                background-color: #f0f2f5;
                box-shadow: none;
            }
        }
        strong{
            display: block;
            margin: 12px 0;
            font-weight: 500;
            font-size: 15px;
        }
        ul{
            list-style: none;
            padding: 0;
            margin: 0;
        }
        li{
            position: relative;
            margin: 5px 0 5px 10px;
            padding-left: 15px;
            color: #34495e;
            font-size: 14px;
            line-height: 22px;
            &::before{
                position: absolute;
                top: 0;
                left: 0;
                box-sizing: border-box;
                width: 6px;
                height: 6px;
                margin-top: 8px;
                border: 1px solid #666;
                border-radius: 50%;
                content: '';
            }
        }
        .download-core{
            margin: 20px 0;

        }
        .version-edit{
            position: absolute;
            top: 20px;
            right: 20px;
            button{
                margin-left: 10px;
            }
        }
    }
}
</style>
