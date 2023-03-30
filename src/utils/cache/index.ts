import { createStorage as create, CreateStorageParams } from './storageCache'
import { DEFAULT_CACHE_TIME } from '@/settings/encryptionSetting'

export type Options = Partial<CreateStorageParams>

const createOptions = (storage: Storage, options: Options = {}): Options => {
    return {
        // No encryption in debug mode
        hasEncrypt: false,
        storage,
        ...options
    }
}

export const createStorage = (storage: Storage = globalThis.sessionStorage, options: Options = {}) => {
    return create(createOptions(storage, options))
}

export const createSessionStorage = (options: Options = {}) => {
    return createStorage(globalThis.sessionStorage, { ...options, timeout: DEFAULT_CACHE_TIME })
}

export const createLocalStorage = (options: Options = {}) => {
    return createStorage(globalThis.localStorage, { ...options, timeout: DEFAULT_CACHE_TIME })
}
