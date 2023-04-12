import { http } from '@/plugins/axios'
enum Apis {
    // 发验证码
    coreSmsUrl = '/core/sms',
    // 登录
    coreLogin = '/core/login',
    // 登出
    coreLogout = '/core/logout',
    // 重置密码
    coreResetPwd = '/core/resetPwd',
    // 用户信息
    userGetUserInfo = '/core/user/getUserAllInfo',
    // 验证码
    randomImage = '/core/randomImage/',
    // 创建收藏夹
    createCollectFolder = '/core/user/createCollectFolder',
    // 我的收藏夹列表
    myCollectFolderList = '/core/user/myCollectFolderList',
    // 收藏操作
    userCollect = '/core/user/collect',
    // 取消收藏操作
    userUnCollect = '/core/user/uncollect',
    // 关注用户
    followUser = '/core/user/followUser',
    // 取消关注用户
    unFollowUser = '/core/user/unFollowUser',
    // 我的消息列表查询
    getMyMessageList = '/core/user/getMyMessageList',
    // 设置消息为已读
    setMyMessageRead = '/core/user/setMyMessageRead',
    // 校验手机号-邮箱的验证码
    checkAccountCaptcha = '/core/user/checkAccountCaptcha',
    // 修改手机号-邮箱
    resetAccountInfo = '/core/user/resetAccountInfo'
}
export interface SmsData {
    mobile?: string
    email?: string
    checkKey?: string
    captcha?: string
    smsmode?: 0 | 1 | 2
}

export interface LoginData {
    username: string
    password?: string
    captcha: string
    checkKey?: string
}

export default {
    /**
     *
     * @param params mobile、email、smsmode
     * smsmode 0 .登录模板、1.注册模板、2.忘记密码模板
     * mobile与email如果同时存在则优先发送邮件模式。
     * @returns
     */
    requestCoreSms: (data: SmsData) => http.post({ url: Apis.coreSmsUrl, data }),
    // 登录
    requestCoreLogin: (data: LoginData) => http.post({ url: Apis.coreLogin, data }),
    // 登出
    requestCoreLogout: () => http.post({ url: Apis.coreLogout }),
    // 重置密码
    requestCoreResetPwd: (data: any) => http.postForm({ url: Apis.coreResetPwd, data }),
    // 获取用户信息
    requestGetUserInfo: (params?: any) => http.get({ url: Apis.userGetUserInfo, params }),
    // 获取验证码
    requestRandomImage: (key: string) => http.get({ url: Apis.randomImage + key }),
    requestCreateCollectFolder: (data: any) =>
        http.postForm({
            url: Apis.createCollectFolder,
            data
        }),
    requestMyCollectFolderList: () => http.get({ url: Apis.myCollectFolderList }),
    requestUserCollect: (data: any) => http.postForm({ url: Apis.userCollect, data }),
    requestUserUnCollect: (data: any) => http.postForm({ url: Apis.userUnCollect, data }),
    requestFollowUser: (data: any) => http.postForm({ url: Apis.followUser, data }),
    requestUnFollowUser: (data: any) => http.postForm({ url: Apis.unFollowUser, data }),
    requestMyMessageList: (params: any) => http.get({ url: Apis.getMyMessageList, params }),
    requestSetMyMessageRead: (data: any) => http.postForm({ url: Apis.setMyMessageRead, data }),
    checkAccountCaptchaApi: (data: any) => http.postForm({ url: Apis.checkAccountCaptcha, data }),
    resetAccountInfoApi: (data: any) => http.postForm({ url: Apis.resetAccountInfo, data })
}
