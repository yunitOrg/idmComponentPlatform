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
    requestMyComponentListUrl = '/core/home/getMyComponentList',
    // 页面-分页列表查询
    homeGetPageListUrl = '/core/home/getPageList',
    // 模板/业务组件-分页列表查询
    homeGetCustomComponentListUrl = '/core/home/getCustomComponentList',
    // 公告-分页列表查询
    homeGetNoticeListUrl = '/core/home/getNoticeList',
    // 图片-分页列表查询
    homeGetImageListUrl = '/core/home/getImageList',
    // 资源专题-分页列表查询
    homeGetResourceSubjectListUrl = '/core/home/getResourceSubjectList',
    // 获取主题的详情
    homeGetSubjectDetail = '/core/home/getSubjectDetail',
    // 获取图片的详情
    homeGetImageDetail = '/core/home/getImageDetail',
    // 获取页面的详情
    homeGetPageDetail = '/core/home/getPageDetail',
    // 获取对应结构的组件包、组件数据
    homeGetSchemaComponentList = '/core/home/getSchemaComponentList',
    // 获取业务组件/模板的详情
    homeGetCustomDetail = '/core/home/getCustomDetail',
}

export default {
    requestHomeGetCodePackageList: (params: CodePackage | Pagitation) => http.get({ url: Apis.homeGetCodePackageList, params }),
    requestHomeGetIndexPageData: (params: { orgId?: string }) => http.get({ url: Apis.homeGetIndexPageData, params }),
    requestHomeGetComponentList: (params: Object) => http.get({ url: Apis.homeGetComponentList, params }),
    requestHomeGetCodepackageDetail: (params: Object) => http.get({ url: Apis.homeGetCodepackageDetail, params }),
    requestHomeGetComponentDetail: (params: Object) => http.get({ url: Apis.homeGetComponentDetail, params }),
    handlePreviewComponent: (url: string) => window.open(baseURL + url, '_blank'),
    requestMyCodePackageList: (params: Object) => http.get({ url: Apis.requestMyCodePackageListUrl, params }),
    requestMyComponentList: (params: Object) => http.get({ url: Apis.requestMyComponentListUrl, params }),
    requestHomeGetPageList: (params: CodePackage | Pagitation) => http.get({ url: Apis.homeGetPageListUrl, params }),
    requestHomeGetCustomComponentList: (params: CodePackage | Pagitation) => http.get({ url: Apis.homeGetCustomComponentListUrl, params }),
    requestHomeGetNoticeList: (params: CodePackage | Pagitation) => http.get({ url: Apis.homeGetNoticeListUrl, params }),
    requestHomeGetImageList: (params: CodePackage | Pagitation) => http.get({ url: Apis.homeGetImageListUrl, params }),
    requestHomeResourceSubjectList: (params: CodePackage | Pagitation) => http.get({ url: Apis.homeGetResourceSubjectListUrl, params }),
    requestHomeGetSubjectDetail: (params: Object) => http.get({ url: Apis.homeGetSubjectDetail, params }),
    requestHomeGetImageDetail: (params: Object) => http.get({ url: Apis.homeGetImageDetail, params }),
    requestHomeGetPageDetail: (params: Object) => http.get({ url: Apis.homeGetPageDetail, params }),
    requestHomeGetSchemaComponent: (params: Object) => http.get({ url: Apis.homeGetSchemaComponentList, params }),
    requestHomeGetCustomDetail: (params: Object) => http.get({ url: Apis.homeGetCustomDetail, params })
}
