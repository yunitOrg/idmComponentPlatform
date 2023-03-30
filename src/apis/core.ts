import { http } from '@/plugins/axios'

enum Apis {
    // 根据分组cd获取常量Master表信息
    requestWebInfoListByGroupUrl = '/core/webinfo/listByGroup'
}

export default {
    requestWebInfoListByGroup(params: object) {
        return http.get({ url: Apis.requestWebInfoListByGroupUrl, params })
    }
}
