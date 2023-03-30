import { defineStore } from 'pinia'
import { store } from '@/store'
interface AppState {
    isAppMounted: boolean
}

export const useAppStore = defineStore({
    id: 'app',
    state: (): AppState => ({
        // 用户信息
        isAppMounted: false
    }),
    actions: {
        setAppMounted(isMounted: boolean) {
            this.isAppMounted = isMounted
        }
    }
})

// Need to be used outside the setup
export function useAppStoreWithOut() {
    return useAppStore(store)
}
