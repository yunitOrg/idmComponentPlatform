import { http } from '@/plugins/axios'
enum Apis {
    // 发验证码
    orgGetOpenOrgList = '/core/org/getOpenOrgList',
    orgGetUserOrgNumber = '/core/org/getUserOrgNumber',
    // 同意加入组织
    agreeJoinOrg = '/core/org/agreeJoinOrg',
    // 拒绝加入组织
    rejectJoinOrg = '/core/org/rejectJoinOrg',
    // 拒绝加入组织
    approveJoinOrgAdmin = '/core/org/approveJoinOrgAdmin'
}

export default {
    requestOrgGetOpenOrgList: (params: Pagitation | Object) => http.get({ url: Apis.orgGetOpenOrgList, params }),
    requestOrgorgGetUserOrgNumber: () => http.get({ url: Apis.orgGetUserOrgNumber }),
    requestAgreeJoinOrg: (data: Object) => http.postForm({ url: Apis.agreeJoinOrg, data }),
    requestRejectJoinOrg: (data: Object) => http.postForm({ url: Apis.rejectJoinOrg, data }),
    requestApproveJoinOrgAdmin: (data: Object) => http.postForm({ url: Apis.approveJoinOrgAdmin, data })
}
