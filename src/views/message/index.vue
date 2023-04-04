<template>
    <div class="page-max-width">
        <ARow :gutter="[20, 20]">
            <ACol :span="4" :xs="24" :md="24" :lg="4">
                <div class="bg-white idm-component-common-box btn-container">
                    <div
                        v-for="(item, index) in btnList"
                        :key="index"
                        class="btn-box text-center cursor-pointer"
                        :class="[pageData.currentBtn.value === item.value && 'btn-active']"
                        @click="handleBtnClick(item)">
                        {{ item.label }}
                    </div>
                </div>
            </ACol>
            <ACol :span="20" :xs="24" :md="24" :lg="20">
                <div class="bg-white idm-component-common-box message-list-container">
                    <router-view></router-view>
                </div>
            </ACol>
        </ARow>
    </div>
</template>
<script lang="ts" setup>
const btnList = [
    {
        value: '',
        label: '全部消息'
    },
    {
        value: '0',
        label: '提到我的'
    },
    {
        value: '1,2',
        label: '评论与回复'
    },
    {
        value: '3',
        label: '新增粉丝'
    },

    {
        value: '4,5',
        label: '赞和收藏'
    },
    {
        value: '6,7',
        label: '邀请和申请'
    },
    {
        value: '11',
        label: '私信'
    },
    {
        value: '8,9',
        label: '赞赏与付费'
    },
    {
        value: '10',
        label: '系统通知'
    }
]
const router = useRouter()
const route = useRoute()

const pageData = reactive({
    currentBtn: {
        value: '0',
        label: '全部消息'
    },
    pageConfig: {
        pageSize: 20,
        pageNo: 1
    }
})
watch(
    () => route,
    (newV) => {
        const type = newV.query?.type
        if (type === undefined) {
            pageData.currentBtn = {
                value: '',
                label: '全部消息'
            }
        } else {
            const currentBtn = btnList.find((el) => el.value === type)
            if (currentBtn) pageData.currentBtn = currentBtn
        }
    },
    { immediate: true, deep: true }
)
const handleBtnClick = (item: any) => {
    pageData.currentBtn = item
    router.push({
        name: 'message-list',
        query: {
            type: item.value
        }
    })
}
</script>

<style lang="scss" scoped>
.bg-white {
    background-color: #fff;
}
.btn-container {
    padding: 10px 0 40px;
    position: sticky;
    top: 80px;
}
.btn-box {
    width: 80%;
    margin: 0 auto;
    padding: 9px 20px;
}
.btn-active {
    background-color: #e9f2fa;
    border-radius: 50px;
    color: #40a9ff;
}
.message-list-container {
    padding: 15px;
}
</style>
