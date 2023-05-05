import { http, baseURL } from '@/plugins/axios'
import { AxiosProgressEvent } from 'axios'

enum Apis {
    // 上传组件代码包
    requestUploadDistUrl = '/publish/component/upload',
    requestDistInfoUrl = '/publish/component/getMyCodepackageInfo',
    requestSaveCodepackageUrl = '/publish/component/save/codepackage',
    // 自动创建组件
    requestAutocreateUrl = '/publish/component/autocreate',
    // 预览图片&下载文件
    componentStaticUrl = '/publish/component/static',
    // 获取组件详情
    requestComInfoUrl = '/publish/component/getMyComponentInfo',
    // 组件保存
    requestSaveComUrl = '/publish/component/save/component',
    // 获取所有组件包
    requestMyAllCodePackageListUrl = '/publish/component/getMyAllCodePackageList',
    // 获取指定组件包版本
    requestCodePackageVersionListUrl = '/publish/component/getCodePackageVersionList',
    // 获取指定组件版本
    requestComponentVersionListUrl = '/publish/component/getComponentVersionList',
    // 更改组件状态
    requestChangeComponentStatusUrl = '/publish/component/statusChangeComponent',
    requestChangeStatusUrl = '/publish/component/statusChange',
    // 组件包删除
    requestDeleteChangeUrl = '/publish/component/deleteChange',
    // 组件删除
    requestDeleteChangeComponentUrl = '/publish/component/deleteChangeComponent',
    // 获取指定组件包的所有已经注册的组件
    requestCodePackageAllComponentListUrl = '/publish/component/getCodePackageAllComponentList'
}

export default {
    requestUploadDist(data: UploadFileParams, onProgress?: (progressEvent: AxiosProgressEvent) => void, signal?: any) {
        return http.uploadFile({ url: Apis.requestUploadDistUrl, onUploadProgress: onProgress, signal }, data, { isReturnResponse: true })
    },
    requestDistInfo(params: object) {
        return http.get({ url: Apis.requestDistInfoUrl, params })
    },
    requestSaveCodepackage(data: object) {
        return http.post({ url: Apis.requestSaveCodepackageUrl, data })
    },
    requestComponentStatic: (url: string) => http.get({ url: Apis.componentStaticUrl + url }),
    // 下载文件
    downloadStaticFile: (filePath: string) => http.downloadFile(Apis.componentStaticUrl + filePath),
    requestAutocreate: (data: object) => http.postForm({ url: Apis.requestAutocreateUrl, data }),
    requestComInfo: (params: object) => http.get({ url: Apis.requestComInfoUrl, params }),
    requestSaveCom: (data: object) => http.post({ url: Apis.requestSaveComUrl, data }),
    requestMyAllCodePackageList: () => http.get({ url: Apis.requestMyAllCodePackageListUrl }),
    requestCodePackageVersionList: (params: object) => http.get({ url: Apis.requestCodePackageVersionListUrl, params }),
    requestComponentVersionList: (params: object) => http.get({ url: Apis.requestComponentVersionListUrl, params }),
    requestChangeComponentStatus: (data: object) => http.postForm({ url: Apis.requestChangeComponentStatusUrl, data }),
    requestChangeStatus: (data: object) => http.postForm({ url: Apis.requestChangeStatusUrl, data }),
    requestDeleteChange: (data: object) => http.postForm({ url: Apis.requestDeleteChangeUrl, data }),
    requestDeleteChangeComponent: (data: object) => http.postForm({ url: Apis.requestDeleteChangeComponentUrl, data }),
    requestCodePackageAllComponentList: (params: object) => http.get({ url: Apis.requestCodePackageAllComponentListUrl, params }),

    componentStaticUrl: baseURL + Apis.componentStaticUrl
}
