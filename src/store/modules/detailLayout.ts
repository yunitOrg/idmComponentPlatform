import { defineStore } from 'pinia'
import { store } from '@/store'
interface AppState {
    mdTitleTop: string
}

export const useDetailLayoutStore = defineStore({
    id: 'detailLayout',
    state: (): AppState => ({
        // 用户信息
        mdTitleTop: '0px'
    }),
    actions: {
        setMdTitleTop(top: string) {
            this.mdTitleTop = top
        }
    }
})

// Need to be used outside the setup
export function useDetailLayoutStoreWithOut() {
    return useDetailLayoutStore(store)
}
