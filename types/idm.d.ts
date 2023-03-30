interface IDMCache {
    put: (key: string, value: any) => any
    shift: () => void
    get: (key: string) => any
}

interface IDMExpress {
    replace: (expressStr: string, data: any, isFlag?: boolean) => string
}
interface IDM {
    isUnDef: (obj: any) => boolean
    cachePool: (maxLength: number) => IDMCache | undefined
    express: IDMExpress
}
