import { SmsData, LoginData } from './../../apis/user'
import { defineStore } from 'pinia'
import { store } from '@/store'
import { useUserApi } from '@/apis'
import { message } from '@/plugins/globalComponents'
import { setToken as setTokenLs } from '@/utils/auth/'
interface UserState {
    userInfo: Nullable<YunitUser>
    token?: string
    isRouterGetedUserInfo: boolean
    isVisibleLoginModal: boolean
}

export const useUserStore = defineStore({
    id: 'user',
    state: (): UserState => ({
        // 用户信息
        userInfo: null,
        // token
        token: undefined,
        // 路由获取过用户信息
        isRouterGetedUserInfo: false,
        // 登录框显示
        isVisibleLoginModal: false
    }),
    getters: {
        isUserLogined(): boolean {
            return this.userInfo !== null
        }
    },
    actions: {
        setLoginModal(isShow: boolean) {
            this.isVisibleLoginModal = isShow
        },
        setToken(token: string) {
            setTokenLs(token)
            this.token = token
        },
        setUserInfo(userInfo: Nullable<YunitUser>) {
            this.userInfo = userInfo
        },
        handleSendCode(SmsData: SmsData) {
            return useUserApi.requestCoreSms(SmsData)
        },
        async handleUserLogin(loginData: LoginData) {
            const res = await useUserApi.requestCoreLogin(loginData)
            message[res.success ? 'success' : 'error'](res.message)
            if (res.success) {
                this.setToken(res.result.token)
                this.setUserInfo(res.result.userInfo)
                return true
            }
            return false
        },
        async handleGetUserInfo() {
            const res = await useUserApi.requestGetUserInfo()
            if (res.success) this.setUserInfo(res.result)
            else this.setUserInfo(null)
            return true
        },
        async handleUserLogout() {
            try {
                await useUserApi.requestCoreLogout()
            } finally {
                this.setToken('')
                this.setUserInfo(null)
                window.location.reload()
            }
        }
    }
})

// Need to be used outside the setup
export function useUserStoreWithOut() {
    return useUserStore(store)
}
