import { http } from '@/plugins/axios'
enum Apis {
    // 发验证码
    orgGetOpenOrgList = '/core/org/getOpenOrgList',
    orgGetUserOrgNumber = '/core/org/getUserOrgNumber',
}

export default {
    requestOrgGetOpenOrgList: (params: Pagitation | Object) => http.get({ url: Apis.orgGetOpenOrgList, params }),
    requestOrgorgGetUserOrgNumber: () => http.get({ url: Apis.orgGetUserOrgNumber })
}
