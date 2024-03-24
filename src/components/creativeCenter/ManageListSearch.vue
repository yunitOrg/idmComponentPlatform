<template>
    <div class="manage-list-search">
        <div class="date">
            <a-date-picker v-model:value="state.date" placeholder="请选择年 - 月" picker="month" />
        </div>
        <div v-if="props.showRange" class="range">
            <AsyncSelect
                v-model:value="state.range"
                placeholder="请选择发布范围"
                :fieldNames="{label: 'orgname', value: 'id'}"
                :request="getPublishRangeList"
            />
        </div>
        <div class="keyWord">
            <a-input v-model:value="state.keyWord" placeholder="请输入关键词" />
        </div>
        <div class="btn-container">
            <a-button type="primary" @click="handleSearch">搜索</a-button>
            <a-button @click="handleReset">重置</a-button>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { useHomeCoreApi } from '@/apis'
const props = defineProps({
    showRange: {
        type: Boolean,
        default: true
    },
    onSearch: {
        type: Function,
        default() {
            return () => {}
        }
    },
    onReset: {
        type: Function,
        default() {
            return () => {}
        }
    }
})
const state = reactive({
    keyWord: '',
    date: '',
    range: ''
})
const getPublishRangeList = async () => {
    const res = await useHomeCoreApi.requestCoreMyOrgList()
    if (res.success) {
        const arr: any[] = res.result
        arr.unshift({ orgname: '公开', id: 0 })
        return res
    }
    return res
}
const handleSearch = () => {
    props.onSearch(state)
}
const handleReset = () => {
    state.keyWord = ''
    state.date = ''
    state.range = ''
    props.onReset(state)
}
</script>
<style lang="scss" scoped>
.manage-list-search {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  .range,.keyWord {
    width: 200px;
    margin-left: 20px;
  }
  .btn-container {
    margin-left: 30px;
    display: flex;
    width: 140px;
    justify-content: space-between;
  }
}
</style>
