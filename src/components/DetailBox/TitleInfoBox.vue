<template>
    <div class="idm-component-common-box title-info-box">
        <!-- 顶部基本信息 -->
        <div class="flex justify-between align-center">
            <div class="flex align-end">
                <span class="package-title">{{ type === 'codePackage' ? codePackageProp.title : (componentProp.comTitle || componentProp.title ) }}</span>
                <span v-if="showSplit" class="package-sp">/</span>
                <span v-if="showClassname" class="package-classname">{{ type === 'codePackage' ? codePackageProp.classname : componentProp.comClassname }}</span>
                <span v-if="showcomLangue" class="package-langue"> {{ type === 'codePackage' ? codePackageProp.codeLangue : (componentProp.comLangue || componentProp.typeCN) }}</span>
                <span v-if="showVersion" class="package-version">{{ currentVersion }}</span>
            </div>
            <div v-if="showComType">
                <div v-if="type === 'component'" class="component-type">{{ componentProp.comType }}</div>
            </div>
        </div>
        <!--ID-->
        <div v-if="showIdText" class="package-id-text">
            <span>{{ showIdText }}：</span>
            <span class="id-text">{{ codePackageProp.idmId || codePackageProp.businessId || codePackageProp.fileMd5 }}</span>
        </div>

        <!-- 阅读 -->
        <div class="package-sub-intr">
            <span>{{ (componentProp && componentProp.userNickname) || codePackageProp.userNickname }}</span>
            <span style="margin: 0 15px">{{ codePackageProp?codePackageProp.createTime:componentProp.createTime }}</span>
            <span>阅读</span>
            <span style="margin: 0 5px">{{ type === 'codePackage' ? codePackageProp.readNumber : componentProp.readNumber }}</span>
        </div>
        <!-- 标签 -->
        <div v-if="codePackageProp.tags&&codePackageProp.tags.length>0" class="flex align-center" style="margin: 20px 0 0 0">
            <span v-for="(item, index) in codePackageProp.tags && codePackageProp.tags.split(',')" :key="index" class="tag-box"> {{ item }}</span>
        </div>
        <!-- 组件包信息 -->
        <div v-if="type === 'component'" class="flex justify-between align-center codepackage-info">
            <div class="flex-1" style="margin: 0 50px 0 0">
                <div class="package-title-2">{{ codePackageProp.title }} （{{ codePackageProp.classname }}）</div>
                <div class="package-remark text-o-e-2">{{ codePackageProp.currentRemark || defaultSettings.introduction }}</div>
            </div>
            <div class="cursor-pointer" @click="handleGoCodePackageDetail">进入组件包详情 <span>></span></div>
        </div>
        <div v-else-if="(type === 'page'||type === 'custom')&&componentProp.subjectId" class="flex justify-between align-center codepackage-info">
            <div class="flex-1" style="margin: 0 50px 0 0">
                <div class="package-title-2">{{ componentProp.ownerTypeCN }} {{ componentProp.ownerType!="platform"?"（"+componentProp.productName+"）":"" }}</div>
                <div class="package-remark text-o-e-2">专题相关展示，包含了页面、模板、业务组件等等</div>
            </div>
            <div class="cursor-pointer" @click="handleGoSubjectPage">进入专题详情 <span>></span></div>
        </div>
        <!--图片-->
        <div v-if="showImage" style="width:100%;margin-top:20px">
            <a-image :src="getImagePath(codePackageProp.imgPath)" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { defaultSettings } from '@/settings/defaultSetting'
import { getImagePath } from '@/utils'
const propData = defineProps({
    showSplit: {
        type: Boolean,
        default: true
    },
    showClassname: {
        type: Boolean,
        default: true
    },
    showcomLangue: {
        type: Boolean,
        default: true
    },
    showVersion: {
        type: Boolean,
        default: true
    },
    showIdText: {
        type: String,
        default: ''
    },
    showImage: {
        type: Boolean,
        default: false
    },
    showComType: {
        type: Boolean,
        default: true
    },
    type: {
        type: String,
        default: 'component'
    },
    componentProp: {
        type: Object,
        default: () => {}
    },
    codePackageProp: {
        type: Object,
        default: () => {}
    }
})
const router = useRouter()
const route = useRoute()
const currentVersion = computed(() => {
    if (route.query.version) return route.query.version
    return propData.codePackageProp.currentVersion
})
const handleGoCodePackageDetail = () => {
    const { href } = router.resolve({
        name: 'index-componentPackage-detail',
        query: {
            codepackageId: propData.codePackageProp.id,
            version: propData.codePackageProp.currentVersion
        }
    })
    window.open(href, '_blank')
}
const handleGoSubjectPage = () => {
    const { href } = router.resolve({
        name: 'index-resourcesubjectdetail',
        query: {
            id: propData.componentProp.subjectId
        }
    })
    window.open(href, '_blank')
}
</script>

<style lang="scss" scoped>
.title-info-box {
    padding: 25px;
    background: #fff;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.05);
    .package-title {
        font-weight: 600;
        color: #333333;
        font-size: 32px;
    }
    .package-sp {
        font-weight: 600;
        margin: 0 10px 8px;
        color: #999;
        font-size: 22px;
        vertical-align: text-bottom;
    }
    .package-classname {
        font-weight: 600;
        color: #1890ff;
        font-size: 22px;
        margin-bottom: 5px;
    }
    .package-langue {
        color: #f79600;
        font-size: 12px;
        border-radius: 4px;
        padding: 0 5px;
        margin: 0px 10px 10px;
        border: 1px solid #f79600;
        vertical-align: text-bottom;
        white-space: nowrap;
    }
    .package-version {
        color: #666666;
        font-size: 12px;
        border-radius: 4px;
        padding: 0 5px;
        margin: 0 10px 10px 0;
        border: 1px solid #ccc;
        white-space: nowrap;
    }
    .package-sub-intr {
        margin-top: 20px;
        color: #999;
    }
    .tag-box {
        margin-right: 10px;
        border: 1px solid #ddd;
        color: #40a9ff;
        border-radius: 3px;
        padding: 0 8px;
    }
    .component-type {
        border: 1px solid #40a9ff;
        color: #40a9ff;
        border-radius: 5px;
        padding: 0 8px;
    }
    .codepackage-info {
        margin: 30px 0 0 0;
        padding: 8px 16px;
        background-color: rgb(247, 247, 247);
        border-radius: 3px;
        color: #999;
        .package-title-2 {
            color: #333333;
            font-size: 16px;
        }
        .package-remark {
            font-size: 12px;
            margin: 3px 0 0 0;
        }
    }
    .package-id-text{
        font-size: 20px;
        color: #999999;
        margin: 20px 0;
        .id-text{
            color: #40a9ff;
        }
    }
}
</style>
