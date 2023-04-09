import { createSessionStorage } from '@/utils/cache/index'

const ss = createSessionStorage()

export function getSession<T>(key: any) {
    return ss.get(key) as T
}

export function setSession(key: any, value: any) {
    return ss.set(key, value)
}
