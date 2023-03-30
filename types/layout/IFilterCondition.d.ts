interface DistDataItem {
    text: string
    value: string
    active?: boolean
}
interface IFilterConditionItem {
    [x: string]: any
    conditionName: string
    defaultOptionNumber: number
    showAllOption: boolean
    allOptionName: string
    allActive: boolean
    isMultiple: boolean
    resData: Array<DistDataItem>
}
