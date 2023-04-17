<template>
    <div class="idm-component-package-box cursor-pointer" @click="handleItemClick">
        <div class="flex justify-between align-center">
            <div class="flex align-center">
                <div class="package-name">{{ componentProps.title }}</div>
                <div class="package-class-name">（{{ componentProps.classname }}）</div>
            </div>
            <div class="flex align-center">
                <span class="package-class-origin">{{ componentProps.userNickname }}</span>
                <a-avatar :size="15" :src="getImagePath(componentProps.userPhoto) || defaultSettings.userphoto" />
            </div>
        </div>
        <div class="package-class-describe text-o-e-2">
            {{ componentProps.currentRemark || defaultSettings.introduction }}
        </div>
        <div class="bottom-line">
            <a-row :gutter="[16, 0]">
                <a-col :span="8">
                    <div class="package-class-time text-o-e">{{ componentProps.updateTime }}</div>
                </a-col>
                <a-col :span="5">
                    <div class="package-class-language text-o-e">{{ componentProps.codeLangue }}</div>
                </a-col>
                <a-col :span="3">
                    <div class="package-class-like text-o-e"><svg-icon iconClass="xin" class="idm-component-package-icon"></svg-icon>{{ componentProps.praiseNumber }}</div>
                </a-col>
                <a-col :span="8">
                    <div class="package-class-team text-o-e" :title="componentProps.publishRangeName || defaultSettings.yunitName">
                        <svg-icon iconClass="renqun" class="idm-component-package-icon"></svg-icon>{{ componentProps.publishRangeName || defaultSettings.yunitName }}
                    </div>
                </a-col>
            </a-row>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { IComponentPackageData } from './mock/mockData'
import { defaultSettings } from '@/settings/defaultSetting'
import { getImagePath } from '@/utils'
const router = useRouter()
const propData = defineProps({
    componentProps: {
        type: Object,
        default: () => IComponentPackageData
    }
})
const handleItemClick = () => {
    router.push({
        name: 'index-componentPackage-detail',
        query: {
            codepackageId: propData.componentProps.id,
            version: propData.componentProps.currentVersion
        }
    })
}
</script>

<style lang="scss" scoped>
.idm-component-package-box {
    background: rgb(249, 250, 250);
    padding: 10px;

    .package-name,
    .package-class-name {
        color: #000;
        font-weight: 600;
        font-size: 14px;
    }

    .package-class-origin {
        color: #666;
        font-size: 12px;
        margin-right: 5px;
    }

    .package-class-describe {
        color: #555;
        font-size: 12px;
        margin: 10px 0;
    }

    .bottom-line {
        color: #999;
        font-size: 12px;
    }

    .package-class-language::before {
        display: inline-block;
        margin: 0 5px -2px 0;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: rgb(255, 221, 0);
        content: ' ';
    }
    &:hover{
        background-color: rgb(232, 243, 255);
    }
}

.idm-component-package-icon {
    color: #999;
    margin: 2px 2px 0 0;
}
</style>
