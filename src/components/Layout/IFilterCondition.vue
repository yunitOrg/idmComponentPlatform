<template>
    <div class="ifilter-condition-container page-max-width">
        <div class="flex justify-between align-center condition-title-box">
            <div class="flex align-center">
                <AImage :preview="false" :width="50" :src="propData.titleInfo.image"></AImage>
                <div class="condition-title">{{ propData.titleInfo.title }}</div>
                <div class="condition-sub-title">{{ propData.titleInfo.subTitle }}</div>
            </div>
            <slot name="search">
                <AInputSearch v-model:value="pageData.searchText" size="large" class="meddile-search" :placeholder="propData.titleInfo.placeholder" @search="handleChange">
                    <template #enterButton>
                        <AButton type="primary">
                            <template #icon><SearchOutlined /></template>
                        </AButton>
                    </template>
                </AInputSearch>
            </slot>
        </div>
        <template v-if="propData.isShowList">
            <div
                v-for="(item, index) in pageData.conditionList"
                v-show="!propData.defaultConditionNumber || (propData.defaultConditionNumber && propData.defaultConditionNumber >= index + 1) || pageData.isOpenAllCondition"
                :key="index"
                class="icc-condition-box">
                <div class="icc-condition-item">{{ item.conditionName }}</div>
                <div v-if="item.showAllOption" class="icc-condition-item" :class="{ active: isNoActive(item) }" @click="closeAllSelected(item)">
                    {{ item.allOptionName }}
                </div>
                <div
                    v-for="(sitem, sindex) in item.resData || []"
                    v-show="!item.defaultOptionNumber || (item.defaultOptionNumber && item.defaultOptionNumber >= sindex + 1) || item.allActive"
                    :key="sindex"
                    class="icc-condition-item"
                    :class="{ active: sitem.active }"
                    @click="conditionActiveHandle(index, sitem, sindex)">
                    {{ sitem.text }}
                </div>
                <a
                    v-if="item.defaultOptionNumber && item.resData && item.resData.length > item.defaultOptionNumber"
                    class="icc-condition-item-more"
                    href="javascript:;"
                    @click="item.allActive = !item.allActive">
                    <span v-if="!item.allActive">
                        <span>更多</span>
                        <svg t="1634698919595" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2954">
                            <path
                                d="M483.072 714.496l30.165333 30.208 415.957334-415.829333a42.837333 42.837333 0 0 0 0-60.288 42.538667 42.538667 0 0 0-60.330667-0.042667l-355.541333 355.413333-355.242667-355.413333a42.496 42.496 0 0 0-60.288 0 42.837333 42.837333 0 0 0-0.085333 60.330667l383.701333 383.872 1.706667 1.749333z"
                                p-id="2955" />
                        </svg>
                    </span>
                    <span v-else>
                        <span>收起</span>
                        <svg t="1634699094211" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3197">
                            <path
                                d="M483.029333 286.165333l30.165334-30.208 415.957333 415.829334c16.426667 16.426667 16.64 43.648 0 60.288a42.538667 42.538667 0 0 1-60.330667 0.042666L513.28 376.746667l-355.242667 355.413333a42.496 42.496 0 0 1-60.288 0 42.837333 42.837333 0 0 1-0.085333-60.330667l383.701333-383.872 1.706667-1.749333z"
                                p-id="3198" />
                        </svg>
                    </span>
                </a>
            </div>
        </template>
    </div>
    <div v-if="propData.defaultConditionNumber && propData.defaultConditionNumber < pageData.conditionList.length" class="icc-condition-box-more">
        <a v-if="!pageData.isOpenAllCondition" href="javascript:;" @click="pageData.isOpenAllCondition = !pageData.isOpenAllCondition">
            全部条件
            <svg t="1634698919595" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2954">
                <path
                    d="M483.072 714.496l30.165333 30.208 415.957334-415.829333a42.837333 42.837333 0 0 0 0-60.288 42.538667 42.538667 0 0 0-60.330667-0.042667l-355.541333 355.413333-355.242667-355.413333a42.496 42.496 0 0 0-60.288 0 42.837333 42.837333 0 0 0-0.085333 60.330667l383.701333 383.872 1.706667 1.749333z"
                    p-id="2955" />
            </svg>
        </a>
        <a v-else href="javascript:;" @click="pageData.isOpenAllCondition = !pageData.isOpenAllCondition">
            收起
            <svg t="1634699094211" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3197">
                <path
                    d="M483.029333 286.165333l30.165334-30.208 415.957333 415.829334c16.426667 16.426667 16.64 43.648 0 60.288a42.538667 42.538667 0 0 1-60.330667 0.042666L513.28 376.746667l-355.242667 355.413333a42.496 42.496 0 0 1-60.288 0 42.837333 42.837333 0 0 1-0.085333-60.330667l383.701333-383.872 1.706667-1.749333z"
                    p-id="3198" />
            </svg>
        </a>
    </div>
</template>

<script lang="ts" setup>
import { SearchOutlined } from '@ant-design/icons-vue'

const emits = defineEmits(['searchChange'])

const propData = defineProps({
    defaultConditionNumber: {
        type: Number,
        default: 3
    },
    isShowList: {
        type: Boolean,
        default: true
    },
    titleInfo: {
        type: Object,
        default: () => ({
            image: '',
            title: '',
            subTitle: '',
            placeholder: '请输入关键字搜索'
        })
    },
    conditionList: {
        type: Array<IFilterConditionItem>,
        default: () => [
            {
                defaultOptionNumber: 10,
                conditionName: '语言',
                showAllOption: true,
                allOptionName: '全部',
                resData: [
                    {
                        text: 'Vue',
                        value: 'Vue'
                    },
                    {
                        text: 'React',
                        value: 'React'
                    },
                    {
                        text: 'JavaScript',
                        value: 'JavaScript'
                    },
                    {
                        text: 'JQuery',
                        value: 'JQuery'
                    },
                    {
                        text: '其他',
                        value: '其他'
                    }
                ]
            },
            {
                defaultOptionNumber: 10,
                conditionName: '标签',
                showAllOption: true,
                allOptionName: '全部',
                resData: [
                    {
                        text: '布局',
                        value: 'Vue'
                    },
                    {
                        text: '卡片',
                        value: 'React'
                    },
                    {
                        text: '列表',
                        value: 'JavaScript'
                    },
                    {
                        text: '按钮',
                        value: 'JQuery'
                    },
                    {
                        text: 'Vue',
                        value: 'Vue'
                    },
                    {
                        text: 'React',
                        value: 'React'
                    },
                    {
                        text: 'JavaScript',
                        value: 'JavaScript'
                    },
                    {
                        text: 'JQuery',
                        value: 'JQuery'
                    },
                    {
                        text: '其他',
                        value: '其他'
                    }
                ]
            },
            {
                defaultOptionNumber: 10,
                conditionName: '范围',
                showAllOption: true,
                allOptionName: '全部',
                resData: [
                    {
                        text: '云IT·社区',
                        value: 'Vue'
                    },
                    {
                        text: 'DreamWeb门户',
                        value: 'React'
                    },
                    {
                        text: 'IDM开源组织',
                        value: 'JavaScript'
                    },
                    {
                        text: '精品组件开发团队',
                        value: 'JQuery'
                    },
                    {
                        text: '其他',
                        value: '其他'
                    }
                ]
            }
        ]
    }
})

const pageData = reactive<{ isOpenAllCondition: boolean; conditionList: Array<IFilterConditionItem>; searchText: string }>({
    isOpenAllCondition: false,
    conditionList: [],
    searchText: ''
})
watch(
    () => propData.conditionList,
    (newV) => {
        pageData.conditionList = newV
    },
    { deep: true, immediate: true }
)

const isNoActive = (item: IFilterConditionItem) => {
    let result = true
    item &&
        item.resData &&
        item.resData.forEach((item) => {
            if (item.active) {
                result = false
            }
        })
    return result
}
const conditionActiveHandle = (index: number, item: DistDataItem, sindex: number) => {
    pageData.conditionList[index]?.isMultiple !== true &&
        pageData.conditionList[index] &&
        pageData.conditionList[index]?.resData &&
        pageData.conditionList[index]?.resData.forEach((sitem, ssindex: number) => {
            if (ssindex !== sindex) {
                sitem.active = false
            }
        })
    item.active = !item.active
    handleChange()
}
const closeAllSelected = (item: IFilterConditionItem) => {
    item &&
        item.resData &&
        item.resData.forEach((sitem) => {
            sitem.active = false
        })
    handleChange()
}
const handleChange = () => {
    const selectObject: any = {}
    pageData.conditionList.forEach((item) => {
        const newValue: { text: string; value: string; active?: boolean }[] = []
        if (item && item.resData) {
            item.resData.forEach((sitem: DistDataItem) => {
                if (sitem.active) {
                    newValue.push(sitem)
                }
            })
        }
        if (newValue.length > 0) {
            selectObject[item.conditionKey] = newValue[0].value
        } else {
            selectObject[item.conditionKey] = ''
        }
    })
    emits('searchChange', {
        searchTxt: pageData.searchText,
        ...selectObject
    })
}
</script>
<style lang="scss" scoped>
.ifilter-condition-container {
    position: relative;
    padding: 0px 0 12px 0;
    .icc-condition-box {
        padding-left: 60px;
        padding-right: 50px;
        position: relative;
        display: flex;
        flex-wrap: wrap;
        margin-top: 15px;
        .icc-condition-item {
            padding: 3px 10px;
            margin-right: 10px;
            margin-bottom: 5px;
            transition: all linear 0.3s;
            cursor: pointer;
            color: #666;
            &:first-child {
                color: #000;
                cursor: default;
                position: absolute;
                left: 0;
                padding-left: 0;
                max-width: 96px;
                font-weight: 600;
            }
            &.active,
            &:not(:first-child):hover {
                background-color: #e9f2fa;
                color: #1890ff;
                border-radius: 4px;
            }
        }
        .icc-condition-item-more {
            position: absolute;
            right: 0px;
            top: 3px;
            svg {
                fill: currentColor;
                width: 12px;
                max-height: 12px;
                vertical-align: -1px;
            }
        }
    }
    .condition-title-box {
        padding: 0 0 10px;
        .meddile-search {
            width: 320px;
        }
        .condition-title {
            font-size: 25px;
            font-weight: 600;
            margin: 0 15px;
        }
        .condition-sub-title {
            font-size: 14px;
            color: #666;
        }
    }
}

.icc-condition-box-more {
    text-align: center;
    margin-top: 10px;
    svg {
        fill: currentColor;
        width: 12px;
        max-height: 12px;
        vertical-align: -1px;
    }
}
</style>
