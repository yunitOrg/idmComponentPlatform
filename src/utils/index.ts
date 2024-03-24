import { isObject, isUrl } from '@/utils/is'

/**
 * 深度合并对象
 * @param src 源对象
 * @param target 目标对象
 * @returns
 */
export function deepMerge<T = any>(src: any = {}, target: any = {}): T {
    let key: string
    for (key in target) {
        src[key] = isObject(src[key]) ? deepMerge(src[key], target[key]) : (src[key] = target[key])
    }
    return src
}

/**
 * 转换image路径
 * @param url
 * @returns
 */

export function getImagePath(url: string | null = '') {
    if (url === null || url === '') return ''
    const baseUrl = import.meta.env.VITE_BASE_URL
    // 已经加了
    if (url.indexOf(baseUrl) > -1 || isUrl(url)) return url
    // 本地
    if (url.indexOf('/src/assets') > -1) return url
    return baseUrl + url
}

/**
 * 转换文件大小显示单位
 * @param limit
 * @returns
 */
export function transformSize(limit?: number): string {
    if (!limit) return '0B'
    let size = ''
    if (limit < 0.1 * 1024) {
        // 小于0.1KB，则转化成B
        size = limit.toFixed(2) + 'B'
    } else if (limit < 0.1 * 1024 * 1024) {
        // 小于0.1MB，则转化成KB
        size = (limit / 1024).toFixed(2) + 'KB'
    } else if (limit < 0.1 * 1024 * 1024 * 1024) {
        // 小于0.1GB，则转化成MB
        size = (limit / (1024 * 1024)).toFixed(2) + 'MB'
    } else {
        // 其他转化成GB
        size = (limit / (1024 * 1024 * 1024)).toFixed(2) + 'GB'
    }

    const sizeStr = size + '' // 转成字符串
    const index = sizeStr.indexOf('.') // 获取小数点处的索引
    const dou = sizeStr.substr(index + 1, 2) // 获取小数点后两位的值
    if (dou === '00') {
        // 判断后两位是否为00，如果是则删除00
        return sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2)
    }
    return size
}

// 获取文件url
export function createObjectURL(blob: any) {
    if (window.URL) {
        return window.URL.createObjectURL(blob)
    } else if (window.webkitURL) {
        return window.webkitURL.createObjectURL(blob)
    } else {
        return ''
    }
}

// file:文件流(一般指后端返回的流)； fileType:文件类型/MIME类型；fileName:文件名称
export function downloadFile(file: any, fileName: string) {
    const url = window.URL.createObjectURL(file)
    const a = document.createElement('a')
    a.style.display = 'none'
    a.href = url
    a.setAttribute('download', fileName)
    document.body.appendChild(a)
    a.click() // 执行下载
    window.URL.revokeObjectURL(a.href)
    document.body.removeChild(a)
}

// file:文件流(一般指后端返回的流)； fileType:文件类型/MIME类型；fileName:文件名称
export function timestampToTime(timestamp: number) {
    const date = new Date(timestamp)
    const year = date.getFullYear()
    const month = ('0' + (date.getMonth() + 1)).slice(-2)
    const day = ('0' + date.getDate()).slice(-2)
    const hours = ('0' + date.getHours()).slice(-2)
    const minutes = ('0' + date.getMinutes()).slice(-2)
    const seconds = ('0' + date.getSeconds()).slice(-2)
    return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds
}
