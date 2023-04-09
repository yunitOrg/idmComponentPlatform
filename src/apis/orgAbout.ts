import { http } from '@/plugins/axios'
enum Apis {
    // 发验证码
    orgGetOpenOrgList = '/core/org/getOpenOrgList',
    orgGetUserOrgNumber = '/core/org/getUserOrgNumber',
    // 同意加入组织
    agreeJoinOrg = '/core/org/agreeJoinOrg',
    // 拒绝加入组织
    rejectJoinOrg = '/core/org/rejectJoinOrg',
    // 审批加入组织
    approveJoinOrgAdmin = '/core/org/approveJoinOrgAdmin',
    // 审批加入组织-列表内
    approveJoinOrgAdminList = '/core/org/approveJoinOrgAdminList',
    // 发送邀请加入组织
    sendInviteJoinOrgUrl = '/core/org/sendInviteJoinOrg',
    // 查看组织下成员
    requestGetOrgUserListUrl = '/core/org/getOrgUserList',
    // 移除成员
    requestRemoveOrgUserUrl = '/core/org/removeOrgUser',
    // 设置成员的类型
    requestChangeOrgUserTypeUrl = '/core/org/changeOrgUserType',
    // 我的组织-分页列表查询
    requestMyOrgListUrl= '/core/org/getMyOrgList'
}

export default {
    requestOrgGetOpenOrgList: (params: Pagitation | Object) => http.get({ url: Apis.orgGetOpenOrgList, params }),
    requestOrgorgGetUserOrgNumber: () => http.get({ url: Apis.orgGetUserOrgNumber }),
    requestAgreeJoinOrg: (data: Object) => http.postForm({ url: Apis.agreeJoinOrg, data }),
    requestRejectJoinOrg: (data: Object) => http.postForm({ url: Apis.rejectJoinOrg, data }),
    requestApproveJoinOrgAdmin: (data: Object) => http.postForm({ url: Apis.approveJoinOrgAdmin, data }),
    requestApproveJoinOrgAdminList: (data: Object) => http.postForm({ url: Apis.approveJoinOrgAdminList, data }),
    requestSendInviteJoinOrg: (data: Object) => http.postForm({ url: Apis.sendInviteJoinOrgUrl, data }),
    requestGetOrgUserList: (params: any) => http.get({ url: Apis.requestGetOrgUserListUrl, params }),
    requestRemoveOrgUser: (data: Object) => http.postForm({ url: Apis.requestRemoveOrgUserUrl, data }),
    requestChangeOrgUserType: (data: Object) => http.postForm({ url: Apis.requestChangeOrgUserTypeUrl, data }),
    requestMyOrgList: (params: any) => http.get({ url: Apis.requestMyOrgListUrl, params })
}
