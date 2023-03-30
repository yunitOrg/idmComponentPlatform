<template>
    <div class="pagenation-container">
        <div class="page-max-width">
            <div class="flex justify-between pagenation-container-title">
                <div>
                    <AButton class="sort-btn" :type="pageData.currentSort === 'new' ? 'primary' : 'text'" shape="round" size="small" @click="handleSortChange('new')">
                        最新
                    </AButton>
                    <AButton class="sort-btn" :type="pageData.currentSort === 'hot' ? 'primary' : 'text'" shape="round" size="small" @click="handleSortChange('hot')">
                        最热
                    </AButton>
                </div>
                <div class="flex align-center">
                    <div class="page-number">{{ pageData.current }}/{{ Math.ceil(propData.total / propData.pageSize) }}</div>
                    <div class="page-arrow left-arrow flex align-center cursor-pointer" @click="handleTopChange(1)"><LeftOutlined></LeftOutlined></div>
                    <div class="page-arrow right-arrow flex align-center cursor-pointer" @click="handleTopChange(2)"><RightOutlined></RightOutlined></div>
                </div>
            </div>
            <slot name="list"></slot>
            <div class="text-center padding-20">
                <a-pagination v-model:current="pageData.current" :defaultPageSize="propData.pageSize" :total="propData.total" @change="handleChange()" />
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { LeftOutlined, RightOutlined } from '@ant-design/icons-vue'
const propData = defineProps({
    pageSize: {
        type: Number,
        default: 10
    },
    total: {
        type: Number,
        default: 0
    }
})
const pageData = reactive({
    current: 1,
    currentSort: 'new'
})
const emits = defineEmits(['searchChange'])
const handleChange = () => {
    emits('searchChange', {
        sort: pageData.currentSort === 'new' ? '0' : '1',
        pageSize: propData.pageSize,
        pageNo: pageData.current
    })
}
const handleTopChange = (type: number) => {
    if (type === 1) {
        if (pageData.current === 1) return
        pageData.current -= 1
    } else {
        if (pageData.current >= Math.ceil(propData.total / propData.pageSize)) return
        pageData.current += 1
    }
    emits('searchChange', {
        sort: pageData.currentSort === 'new' ? '0' : '1',
        pageSize: propData.pageSize,
        pageNo: pageData.current
    })
}
const handleSortChange = (value: string) => {
    if (pageData.currentSort === value) return
    pageData.currentSort = value
    handleChange()
}
</script>
<style lang="scss" scoped>
.pagenation-container {
    background-color: #fff;
    .pagenation-container-title {
        padding: 20px 0;
    }
    .sort-btn {
        letter-spacing: -2px;
        margin: 0 5px;
    }
    .page-arrow {
        padding: 0 5px;
        background-color: #f9f4f4;
        margin: 0 0 0 5px;
        font-size: 10px;
        color: #999;
        height: 20px;
    }
    .page-number {
        color: #999;
        font-size: 12px;
    }
    .left-arrow {
        border-radius: 20px 0 0 20px;
    }
    .right-arrow {
        border-radius: 0 20px 20px 0;
    }
    .padding-20 {
        padding: 20px 0;
    }
}
</style>
