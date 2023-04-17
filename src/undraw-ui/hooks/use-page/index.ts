// 分页
export const usePage = (pageNum: number, pageSize: number, arr: any[]) => {
    const skipNum = (pageNum - 1) * pageSize
    const newArr = skipNum + pageSize >= arr.length ? arr.slice(skipNum, arr.length) : arr.slice(skipNum, skipNum + pageSize)
    return newArr
}
