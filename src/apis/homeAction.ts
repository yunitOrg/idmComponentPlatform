import { http } from '@/plugins/axios'
enum Apis {
    // 点赞组件包
    codepackagePraise = '/core/homeaction/codepackage/praise',
    // 取消点赞组件包
    codepackageUnPraise = '/core/homeaction/codepackage/unpraise',
    // 点赞组件
    componentPraise = '/core/homeaction/component/praise',
    // 取消点赞组件
    componentUnPraise = '/core/homeaction/component/unpraise'
}

export default {
    requestCodepackagePraise: (data: Object) => http.postForm({ url: Apis.codepackagePraise, data }),
    requestCodepackageUnPraise: (data: Object) => http.postForm({ url: Apis.codepackageUnPraise, data }),
    requestComponentPraise: (data: Object) => http.postForm({ url: Apis.componentPraise, data }),
    requestComponentUnPraise: (data: Object) => http.postForm({ url: Apis.componentUnPraise, data })
}
