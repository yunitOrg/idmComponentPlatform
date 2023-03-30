<template>
    <a-select
        v-model:value="state.value"
        style="width: 100%"
        allow-clear
        show-arrow
        :show-search="asyncSearch"
        :label-in-value="labelInValue"
        :mode="mode"
        :options="state.data"
        :placeholder="placeholder"
        :filter-option="!asyncSearch"
        @search="(value: string) => asyncSearch && getOptions(value)"
        @change="handleChange"
    >
        <template v-if="state.loading" #notFoundContent>
            <a-spin size="small" />
        </template>
    </a-select>
</template>
<script lang="ts" setup>
import { debounce } from 'lodash-es'
import { selectProps, SelectValue } from 'ant-design-vue/es/select'
const props = defineProps({
    ...selectProps(),
    asyncSearch: {
        type: Boolean,
        default: false
    },
    fieldNames: {
        type: Object,
        default() {
            return undefined
        }
    },
    request: {
        type: Function,
        default() {
            return undefined
        }
    }
})
const state = reactive({
    data: [],
    value: undefined as SelectValue,
    loading: false
})
const emit = defineEmits(['update:value'])
watch(() => props.value, () => {
    state.value = props.value
}, { deep: true, immediate: true })
onMounted(() => {
    getOptions('')
})

const getOptions = debounce(async (text: string) => {
    if (!props.request) return
    state.data = []
    state.loading = true
    const res = await props.request(text)
    state.loading = false
    const labelField = props.fieldNames ? props.fieldNames.label : 'label'
    const valueField = props.fieldNames ? props.fieldNames.value : 'value'
    if (res.success) {
        state.data = res.result?.map((item: any) => ({
            ...item,
            label: item[labelField],
            value: item[valueField]
        }))
    }
}, 500)
const handleChange = (value: any) => {
    emit('update:value', value)
}
</script>

<style lang="scss" scoped>
</style>
