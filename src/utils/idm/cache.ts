export class IDMCache {
    size: number = 0
    limit: number = 0
    head: any = null
    tail: any = null
    _keyman: any = {}
    constructor(maxLength: number) {
        this.size = 0
        this.limit = maxLength
        // eslint-disable-next-line no-void
        this.head = this.tail = void 0
        this._keyman = {}
    }

    put(key: string, value: any) {
        const entry = {
            key,
            value,
            older: null
        }
        this._keyman[key] = entry
        if (this.tail) {
            this.tail.newer = entry
            entry.older = this.tail
        } else this.head = entry
        this.tail = entry
        if (this.size === this.limit) this.shift()
        else this.size++
        return value
    }

    shift() {
        const entry = this.head
        if (entry) {
            this.head = this.head.newer
            // eslint-disable-next-line no-void
            this.head.older = entry.newer = entry.older = this._keyman[entry.key] = void 0
            delete this._keyman[entry.key]
            this.size--
        }
    }

    get(key: string) {
        const entry = this._keyman[key]
        // eslint-disable-next-line no-void
        if (entry === void 0) return
        if (entry === this.tail) return entry.value
        if (entry.newer) {
            // 处理 newer 指向
            if (entry === this.head) this.head = entry.newer
            entry.newer.older = entry.older
        }
        if (entry.older) entry.older.newer = entry.newer
        // eslint-disable-next-line no-void
        entry.newer = void 0
        entry.older = this.tail
        if (this.tail) this.tail.newer = entry
        this.tail = entry
        return entry.value
    }
}

// 创建一个LRU缓存池
export default function cachePool(maxLength: number) {
    if (maxLength === null || maxLength === undefined) {
        console.error('请设置缓存大小')
        return
    }
    return new IDMCache(maxLength)
}
