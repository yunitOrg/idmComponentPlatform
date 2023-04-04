import { TOKEN_KEY } from '@/enums/cacheEnum'
import { createLocalStorage } from '@/utils/cache/index'

const ls = createLocalStorage({ hasEncrypt: true })
/**
 * 获取token
 */
export function getToken() {
    return getAuthCache<string>(TOKEN_KEY)
}

export function setToken(token: string) {
    return setAuthCache(TOKEN_KEY, token)
}

export function getAuthCache<T>(key: any) {
    return ls.get(key) as T
}

export function setAuthCache(key: any, value: any) {
    return ls.set(key, value)
}
