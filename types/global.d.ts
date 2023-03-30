declare module globalThis {
    var IDM: IDM
    var sessionStorage: Object
    var localStorage: Object
}

declare type Recordable<T = any> = Record<string, T>;
declare type Nullable<T> = T | null;
