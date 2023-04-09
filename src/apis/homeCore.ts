import { http } from '@/plugins/axios'
enum Apis {
    // 获取我的所有组织
    coreMyOrgList = '/core/myOrgList',
    // 创建组织
    coreRegisterOrg = '/core/registerOrg',
    // 获取所有平台用户总数
    coreAllUserTotal = '/core/allUserTotal',
    // 申请加入组织
    coreApplyJoinOrg = 'core/applyJoinOrg',
    // 搜索用户
    searchUserUrl = '/core/searchUser'
}

export default {
    requestCoreMyOrgList: () => http.get({ url: Apis.coreMyOrgList }),
    requestCoreRegisterOrg: (data: Object) => http.post({ url: Apis.coreRegisterOrg, data }),
    requestCoreAllUserTotal: () => http.get({ url: Apis.coreAllUserTotal }),
    requestCoreApplyJoinOrg: (data: Object) =>
        http.postForm({
            url: Apis.coreApplyJoinOrg,
            data
        }),
    requestSearchUser: (params: any) => http.get({ url: Apis.searchUserUrl, params })
}
