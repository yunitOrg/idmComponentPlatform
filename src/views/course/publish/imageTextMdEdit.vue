<template>
    <div class="imagetext-mdedit-header">
        <div class="back-title">
            <LeftOutlined />
            <span>教程管理</span>
        </div>
        <a-input v-model:value="state.title" size="large" show-count :maxlength="100" />
        <a-button key="back" size="large" @click="saveMd">保存草稿</a-button>
        <a-button key="submit" size="large" type="primary" @click="handleOk">发布教程</a-button>
        <a-avatar :size="40" class="cursor-pointer header-avatar" :src="getImagePath(userStore.userInfo && userStore.userInfo.userphoto) || defaultSettings.userphoto" />
    </div>
    <v-md-editor
        v-model:model-value="state.mdContent"
        :toolbar="customToolbarConfig"
        height="calc(100vh - 70px)"
        default-show-toc
        toc-nav-position-right
        left-toolbar="undo redo clear | h bold italic strikethrough quote | emoji ul ol table hr | link image code | import export save | template"
        @upload-image="handleUploadImage" />
    <a-modal
        v-model:visible="modal.visiable"
        width="800px"
        cancelText="取消"
        okText="添加到正文"
        :okButtonProps="{
            danger: true
        }"
        @ok="modalHandleOk">
        <template #title>
            <div class="imagetext-mdedit-modal-title">模板库</div>
        </template>
        <div class="imagetext-mdedit-template-list">
            <div v-for="(item, index) in modal.templateList" :key="index" class="template-item" @click="() => (modal.activeId = item.id)">
                <div class="template-item-tit">{{ item.title }}</div>
                <img :src="getImagePath(item.imgSrc) || defaultCatalog" />
                <div class="template-item-time">更新于 {{ item.updateTime }}</div>
                <div v-show="modal.activeId === item.id" class="template-mask"><CheckOutlined style="font-size: 80px; color: #fff" /></div>
            </div>
        </div>
    </a-modal>
</template>
<script lang="ts" setup>
import { getImagePath } from '@/utils'
import { LeftOutlined, CheckOutlined } from '@ant-design/icons-vue'
import { useUserStore } from '@/store/modules/user'
import { defaultSettings } from '@/settings/defaultSetting'
import { defaultCatalog } from '@/assets/images'
const modal = reactive({
    visiable: false,
    activeId: '101',
    templateList: [
        {
            id: '101',
            title: '学习计划模板实例',
            imgSrc: '',
            updateTime: '08月13日'
        },
        {
            id: '102',
            title: '系列文章模板',
            imgSrc: '',
            updateTime: '08月13日'
        },
        {
            id: '103',
            title: 'bug记录模板',
            imgSrc: '',
            updateTime: '08月13日'
        }
    ]
})
const customToolbarConfig = {
    template: {
        title: '模板',
        icon: 'iconfont icon-moban',
        action: (editor: any) => {
            console.log(editor)
            modal.visiable = true
        }
    },
    export: {
        title: '导出',
        icon: 'iconfont icon-daochu',
        action: (editor: any) => {
            console.log(editor, state.mdContent)
        }
    },
    import: {
        title: '导入',
        icon: 'iconfont icon-daoru',
        action: (editor: any) => {
            console.log(editor)
        }
    }
}
const state = reactive({
    mdContent: '',
    title: '',
    modalVisible: false
})

const userStore = useUserStore()

function saveMd() {}

function handleOk() {}

function modalHandleOk() {
    state.mdContent = '### 学习计划\n提示:这里可以添加学习目标\n### 学习内容:\n提示:这里可以添加要学的内容\n### 学习时间:\n提示:这里可以添加计划学习的时间'
    modal.visiable = false
}

function handleUploadImage(event:any, insertImage:any, files:any) {
    console.log(files)
    // 这里做自定义图片上传
    // let result = await proxy.Request({
    //     url: '/file/Image',
    //     dataType: 'file',
    //     params: {
    //         file: files[0],
    //         type: 1
    //     }
    // })
    // if (!result) {
    //     return
    // }
    // const url = proxy.globaInfo.imageUrl + result.data.fileName
    insertImage({
        // url,
        desc: '博客图片'
        // width: 'auto',
        // height: 'auto',
    })
}

// function openTemplate() {
//     console.log('打开模板')

// }
</script>
<style lang="scss" scoped>
.imagetext-mdedit-header {
    display: flex;
    height: 70px;
    align-items: center;
    padding: 0 20px;
    .back-title {
        white-space: nowrap;
        font-size: 20px;
        margin-right: 10px;
        span {
            margin-right: 10px;
        }
    }
    .ant-btn {
        margin-left: 20px;
    }
    .header-avatar {
        margin-left: 20px;
    }
}
</style>
<style lang="scss">
.imagetext-mdedit-modal-title {
    text-align: center;
    font-size: 20px;
    font-weight: bold;
}
.imagetext-mdedit-template-list {
    display: flex;
    flex-wrap: wrap;
    height: 40vh;
    overflow-y: auto;
    overflow-x: hidden;
    &::-webkit-scrollbar {
        width: 3px;
        height: 3px;
    }
    &::-webkit-scrollbar-thumb {
        min-height: 28px;
        border-radius: 4px;
        background-color: #cccccc;
    }
    &::-webkit-scrollbar-track-piece,
    &::-webkit-scrollbar-corner {
        background-color: transparent;
    }
    .template-item {
        position: relative;
        width: calc(50% - 20px);
        border: 1px solid #eee;
        padding: 14px 10px;
        margin: 0 10px;
        margin-bottom: 20px;
        border-radius: 5px;
        cursor: pointer;
        .template-item-tit {
            font-size: 16px;
        }
        img {
            width: 100%;
            height: 190px;
        }
        .template-item-time {
            font-size: 14px;
            color: #999;
        }
        .template-mask {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.3);
            z-index: 1;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }
}
</style>
