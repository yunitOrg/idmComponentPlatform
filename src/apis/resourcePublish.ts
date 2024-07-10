import { http, baseURL } from '@/plugins/axios'
import { AxiosProgressEvent } from 'axios'

enum Apis {
    // 获取我的指定页面ID的数据
    requestDistInfoUrl = '/publish/resource/getMyPageInfo',
    // 预览图片&下载文件
    componentStaticUrl = '/publish/component/static',
    requestChangeStatusUrl = '/publish/resource/statusChange',
    requestSavePageUrl = '/publish/resource/save/page',
    // 获取zipPath中的页面结构数据
    requestZipInfoUrl = '/publish/resource/getZipPathInfo',
    // 获取我的指定模板/业务组件ID的数据
    requestCustomDistInfoUrl = '/publish/resource/getMyCustomComponentInfo',
    // 保存模板/业务组件的数据
    requestSaveCustomComponentUrl = '/publish/resource/save/customComponent',
    // 获取我的图片信息的数据
    requestImageDistInfoUrl = '/publish/resource/getMyImageInfo',
    // 获取zipPath中的页面结构数据
    requestImageInfoUrl = '/publish/resource/getImageInfo',
    // 保存模板/业务组件的数据
    requestSaveImageUrl = '/publish/resource/save/image',
    // 获取公告数据
    requestNoticeDistInfoUrl = '/publish/resource/getMyNoticeInfo',
    // 保存公告数据
    requestSaveNoticeUrl = '/publish/resource/save/notice',
    // 获取我的页面列表数据
    getMyPageListUrl = '/creative/resource/getMyPageList',
    // 获取我的页面列表数据
    requestPageVersionListUrl = '/creative/resource/getPageVersionList',
    // 页面删除
    requestDeleteChangePageUrl = '/creative/resource/deleteChangePage',
    // 模板/业务组件删除
    requestDeleteChangeCustomComponentUrl = '/creative/resource/deleteChangeCustomComponent',
    // 获取我的模板/业务组件列表数据
    getMyCustomComponentListUrl = '/creative/resource/getMyCustomComponentList',
    // 获取我的图片列表数据
    getMyImageListUrl = '/creative/resource/getMyImageList',
    // 获取我的公告列表数据
    getMyNoticeListUrl = '/creative/resource/getMyNoticeList',
    // 公告删除
    requestDeleteChangeNoticeUrl = '/creative/resource/deleteChangeNotice',
    // 图片删除
    requestDeleteChangeImageUrl = '/creative/resource/deleteChangeImage',
    // 保存核心框架
    requestSaveIdmCoreUrl = '/publish/resource/save/idmcore',
    // 获取idmcore列表数据
    getIdmCoreListUrl = '/creative/resource/getIdmCoreList',
    // 核心框架删除
    requestDeleteIdmCoreUrl = '/creative/resource/deleteIdmCore'
}

export default {
    requestDistInfo(params: object) {
        return http.get({ url: Apis.requestDistInfoUrl, params })
    },
    requestZipInfo(params: object) {
        return http.get({ url: Apis.requestZipInfoUrl, params })
    },
    requestImageInfo(params: object) {
        return http.get({ url: Apis.requestImageInfoUrl, params })
    },
    requestChangeStatus: (data: object) => http.postForm({ url: Apis.requestChangeStatusUrl, data }),
    requestSavePage(data: object) {
        return http.post({ url: Apis.requestSavePageUrl, data })
    },
    requestCustomDistInfo(params: object) {
        return http.get({ url: Apis.requestCustomDistInfoUrl, params })
    },
    requestSaveCustomComponent(data: object) {
        return http.post({ url: Apis.requestSaveCustomComponentUrl, data })
    },
    requestImageDistInfo(params: object) {
        return http.get({ url: Apis.requestImageDistInfoUrl, params })
    },
    requestSaveImage(data: object) {
        return http.post({ url: Apis.requestSaveImageUrl, data })
    },
    requestNoticeDistInfo(params: object) {
        return http.get({ url: Apis.requestNoticeDistInfoUrl, params })
    },
    requestSaveNotice(data: object) {
        return http.post({ url: Apis.requestSaveNoticeUrl, data })
    },
    getMyPageList: (params: Object) => http.get({ url: Apis.getMyPageListUrl, params }),
    getMyCustomComponentList: (params: Object) => http.get({ url: Apis.getMyCustomComponentListUrl, params }),
    requestPageVersionList: (params: object) => http.get({ url: Apis.requestPageVersionListUrl, params }),
    getMyImageList: (params: Object) => http.get({ url: Apis.getMyImageListUrl, params }),
    getMyNoticeList: (params: Object) => http.get({ url: Apis.getMyNoticeListUrl, params }),
    requestDeleteChangePage: (data: object) => http.postForm({ url: Apis.requestDeleteChangePageUrl, data }),
    requestDeleteChangeCustomComponent: (data: object) => http.postForm({ url: Apis.requestDeleteChangeCustomComponentUrl, data }),
    requestDeleteChangeImage: (data: object) => http.postForm({ url: Apis.requestDeleteChangeImageUrl, data }),
    requestDeleteChangeNotice: (data: object) => http.postForm({ url: Apis.requestDeleteChangeNoticeUrl, data }),
    requestSaveIdmCore: (data: object) => http.post({ url: Apis.requestSaveIdmCoreUrl, data }),
    getIdmCoreList: (params: Object) => http.get({ url: Apis.getIdmCoreListUrl, params }),
    requestDeleteIdmCore: (data: object) => http.postForm({ url: Apis.requestDeleteIdmCoreUrl, data }),
    componentStaticUrl: baseURL + Apis.componentStaticUrl
}
