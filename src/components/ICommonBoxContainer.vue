<template>
    <div class="idm-common-box-container">
        <div class="idm-common-box-top flex justify-between align-center">
            <div class="idm-common-box-top-left flex align-center">
                <a-image :preview="false" :src="componentProps.leftImage"></a-image>
            </div>
            <div class="idm-common-box-top-right cursor-pointer flex align-center" @click="handleJumpMore">
                <span>{{ componentProps.moreText }}</span>
                <svg-icon iconClass="right-arrow"></svg-icon>
            </div>
        </div>
        <slot name="list" />
    </div>
</template>
<script lang="ts" setup>
const propData = defineProps({
    componentProps: {
        type: Object,
        default() {
            return {
                leftImage: '',
                moreText: '全部',
                topColor: 'red',
                moreRouteName: ''
            }
        }
    }
})
const router = useRouter()
const handleJumpMore = () => {
    router.push({
        name: propData.componentProps.moreRouteName
    })
}
</script>

<style lang="scss" scoped>
.idm-common-box-container {
    background-color: #fff;
    border-radius: 3px;
    padding: 15px 20px;
}

.idm-common-box-top {
    margin-bottom: 15px;
}

.idm-common-box-top-left-icon {
    font-size: 16px;
    padding: 2px;
    border-radius: 50%;
    color: #ffffff;
    margin: 2px 0 0 0;
    height: 20px;
}

.idm-common-box-top-left-text {
    font-size: 16px;
    font-weight: 600;
    font-style: italic;
    margin: 0 0 0 10px;
    position: relative;
    top: 0;
    left: 0;
    color: #000000;
}

.idm-common-box-top-left-circle {
    position: absolute;
    top: 3px;
    left: 0;
    width: 12px;
    height: 12px;
    border-radius: 50%;
}
</style>
