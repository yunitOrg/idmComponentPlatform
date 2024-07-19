import { http } from '@/plugins/axios'
enum Apis {
    // 点赞组件包
    codepackagePraise = '/core/homeaction/codepackage/praise',
    // 取消点赞组件包
    codepackageUnPraise = '/core/homeaction/codepackage/unpraise',
    // 点赞组件
    componentPraise = '/core/homeaction/component/praise',
    // 取消点赞组件
    componentUnPraise = '/core/homeaction/component/unpraise',
    // 点赞图片
    imagePraise = '/core/homeaction/image/praise',
    // 取消点赞图片
    imageUnPraise = '/core/homeaction/image/unpraise',
    // 点赞页面
    pagePraise = '/core/homeaction/page/praise',
    // 取消点赞页面
    pageUnPraise = '/core/homeaction/page/unpraise',
    // 点赞业务组件/模板
    customPraise = '/core/homeaction/custom/praise',
    // 取消业务组件/模板
    customUnPraise = '/core/homeaction/custom/unpraise'
}

export default {
    requestCodepackagePraise: (data: Object) => http.postForm({ url: Apis.codepackagePraise, data }),
    requestCodepackageUnPraise: (data: Object) => http.postForm({ url: Apis.codepackageUnPraise, data }),
    requestComponentPraise: (data: Object) => http.postForm({ url: Apis.componentPraise, data }),
    requestComponentUnPraise: (data: Object) => http.postForm({ url: Apis.componentUnPraise, data }),
    requestImagePraise: (data: Object) => http.postForm({ url: Apis.imagePraise, data }),
    requestImageUnPraise: (data: Object) => http.postForm({ url: Apis.imageUnPraise, data }),
    requestPagePraise: (data: Object) => http.postForm({ url: Apis.pagePraise, data }),
    requestPageUnPraise: (data: Object) => http.postForm({ url: Apis.pageUnPraise, data }),
    requestCustomPraise: (data: Object) => http.postForm({ url: Apis.customPraise, data }),
    requestCustomUnPraise: (data: Object) => http.postForm({ url: Apis.customUnPraise, data })
}
