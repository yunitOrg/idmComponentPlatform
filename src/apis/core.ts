import { http } from '@/plugins/axios'

enum Apis {
    // 根据分组cd获取常量Master表信息
    requestWebInfoListByGroupUrl = '/core/webinfo/listByGroup',
    // 邀请加入组织信息获取
    getInviteInfo = '/core/getInviteInfo',
    // 受邀请申请加入组织(已登录)
    applyJoinOrgByInvite = '/core/applyJoinOrgByInvite',
    // 搜索组件结果
    searchComponent = 'core/searchComponent'
}

export default {
    requestWebInfoListByGroup(params: object) {
        return http.get({ url: Apis.requestWebInfoListByGroupUrl, params })
    },
    requestGetInviteInfo: (params: Object) => http.get({ url: Apis.getInviteInfo, params }),
    requestApplyJoinOrgByInvite: (data: Object) => http.postForm({ url: Apis.applyJoinOrgByInvite, data }),
    requestSearchComponent: (params: Object) => http.get({ url: Apis.searchComponent, params })
}
