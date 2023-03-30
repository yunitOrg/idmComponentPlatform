<template>
    <div class="page-max-width">
        <ARow :gutter="[20, 20]">
            <ACol :span="18" :xs="24" :md="24" :lg="18">
                <!-- component-package -->
                <ICommonBoxContainer id="component-package-container" class="margin-bottom-16" :component-props="pageConfig.componentPackage">
                    <template #list>
                        <ARow :gutter="[20, 20]">
                            <ACol v-for="item, index in pageData.codePackageList" :key="index" :span="12">
                                <IComponentPackageBox :componentProps="item" />
                            </ACol>
                        </ARow>
                    </template>
                </ICommonBoxContainer>
                <!-- component-market -->
                <ICommonBoxContainer class="margin-bottom-16" :component-props="pageConfig.componentMarket">
                    <template #list>
                        <ARow :gutter="[20, 20]">
                            <ACol v-for="item, index in pageData.componentList" :key="index" :span="8">
                                <IComponentMarketBox :componentProps="item" />
                            </ACol>
                        </ARow>
                    </template>
                </ICommonBoxContainer>
                <!-- i-school -->
                <ICommonBoxContainer class="margin-bottom-16" :component-props="pageConfig.iSchool">
                    <template #list>
                        <ARow :gutter="[20, 20]">
                            <ACol v-for="item in 8" :key="item" :span="6">
                                <ISchoolBox />
                            </ACol>
                        </ARow>
                    </template>
                </ICommonBoxContainer>
                <!-- hot-talk -->
                <ICommonBoxContainer class="margin-bottom-16" :component-props="pageConfig.hotTalk">
                    <template #list>
                        <ARow :gutter="[20, 20]">
                            <ACol v-for="item in 3" :key="item" :span="8">
                                <IHotTalkBox />
                            </ACol>
                        </ARow>
                    </template>
                </ICommonBoxContainer>
            </ACol>
            <ACol :span="6" :xs="0" :md="0" :lg="6">
                <ICommonBoxContainer :component-props="pageConfig.yunQuan">
                    <template #list>
                        <IYunQuanBox v-for="item in 6" :key="item" />
                    </template>
                </ICommonBoxContainer>
            </ACol>
        </ARow>
    </div>
</template>

<script lang="ts" setup>
import configObject from '@/settings/indexPageConfig'
import { useHomePageApi } from '@/apis'
import emitter from '@/utils/bus'
const pageConfig = reactive(configObject)
const pageData = reactive({
    codePackageList: [],
    componentList: []
})
const handleGetListByOrgId = (org: any = {}) => {
    useHomePageApi
        .requestHomeGetIndexPageData({
            orgId: org.id
        })
        .then((res) => {
            pageData.codePackageList = res.result.codePackageList
            pageData.componentList = res.result.componentList
        })
}
handleGetListByOrgId()
emitter.on('orgChange', (org) => {
    handleGetListByOrgId(org)
})
</script>

<style lang="scss" scoped>
.margin-bottom-16 {
    margin-bottom: 16px;
}
</style>
