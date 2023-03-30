import { http, baseURL } from '@/plugins/axios'
enum Apis {
    // 首页获取组织下的所有栏目数据
    homeGetIndexPageData = '/core/home/getIndexPageData',
    // 代码包-分页列表查询
    homeGetCodePackageList = '/core/home/getCodePackageList',
    // 组件-分页列表查询
    homeGetComponentList = '/core/home/getComponentList',
    // 获取组件的详情
    homeGetComponentDetail = '/core/home/getComponentDetail',
    // 获取组件包的详情
    homeGetCodepackageDetail = '/core/home/getCodepackageDetail',
    // 创作中心-组件包管理列表
    requestMyCodePackageListUrl = '/core/home/getMyCodePackageList',
    // 创作中心-组件管理列表
    requestMyComponentListUrl = '/core/home/getMyComponentList'
}

export default {
    requestHomeGetCodePackageList: (params: CodePackage | Pagitation) => http.get({ url: Apis.homeGetCodePackageList, params }),
    requestHomeGetIndexPageData: (params: { orgId?: string }) => http.get({ url: Apis.homeGetIndexPageData, params }),
    requestHomeGetComponentList: (params: Object) => http.get({ url: Apis.homeGetComponentList, params }),
    requestHomeGetCodepackageDetail: (params: Object) => http.get({ url: Apis.homeGetCodepackageDetail, params }),
    requestHomeGetComponentDetail: (params: Object) => http.get({ url: Apis.homeGetComponentDetail, params }),
    handlePreviewComponent: (url: string) => window.open(baseURL + url, '_blank'),
    requestMyCodePackageList: (params: Object) => http.get({ url: Apis.requestMyCodePackageListUrl, params }),
    requestMyComponentList: (params: Object) => http.get({ url: Apis.requestMyComponentListUrl, params })
}
