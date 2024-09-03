<template>
    <IFilterCondition :conditionList="pageData.conditionList" :titleInfo="conditionTitle" @searchChange="searchChange">
    </IFilterCondition>
    <IPagenationContainer :total="pageData.total" :pageSize="pageData.searchParams.pageSize" @searchChange="searchChange">
        <template #list>
            <div ref="imgshow" class="imgshow clearfix">
                <div class="swipeboxEx">
                    <div v-for="(item, index) in pageData.records" :key="index" @click="handlePreviewComponent(item)" class="list" :style="{'height':item.imgHeightNew+'px','width':item.imgWidthNew+'px'}">
                        <a>
                            <img object-fit alt="图片加载失败" class="image" :src="getImagePath(item.coverPath)" />
                        </a>
                        <div class="photo-tag">
                            <h2 style="margin-left:12px;">
                                <a :title="item.title" class="text-o-e-2" target="_blank">{{ item.title }}</a>
                            </h2>
                        </div>
                        <div class="popup">
                            <div class="imgList-btn-item">
                                <a-popover>
                                    <template #content>
                                        <div v-for="(sitem,index) in tipShowList" :key="index" class="flex justify-start" style="margin:10px 25px 10px 0px">
                                            <span style="width:80px;text-align:right;color:#999999">{{ sitem[0] }}：</span><span v-if="item[sitem[1]]||item[sitem[1]]===0">{{ handleCardFunction(sitem,item) }}</span><span v-else style="color:#CCC">空</span>
                                        </div>
                                        <div class="flex justify-start" style="margin:10px 25px 10px 0px">
                                            <span style="width:80px;text-align:right;color:#999999">组织：</span><span>{{ !item.publishOpen?item.publishRangeName: defaultSettings.yunitName }}</span>
                                        </div>
                                    </template>
                                    <a>
                                        <InfoCircleOutlined />
                                    </a>
                                </a-popover>
                            </div>
                            <div class="imgList-btn-item">
                                <a title="下载"  @click="downloadStaticFile(item.imgPath)">
                                    <CloudDownloadOutlined />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </IPagenationContainer>
</template>

<script lang="ts" setup>
import { imageImage } from '@/assets/images'
import { useHomePageApi, coreApi, useHomeCoreApi, componentPublishApi } from '@/apis'
import { defaultSettings } from '@/settings/defaultSetting'
import { getImagePath } from '@/utils'
import { baseURL } from '@/plugins/axios'
import { CloudDownloadOutlined, InfoCircleOutlined } from '@ant-design/icons-vue'
const router = useRouter()
const imgshow = ref<HTMLElement>()
const conditionTitle = {
    image: imageImage,
    title: '图片',
    subTitle: '作品美不美就靠它了！',
    placeholder: '搜索感兴趣的图片'
}
const tipShowList = [
    ['数据ID', 'id'],
    ['文件MD5', 'fileMd5'],
    ['图片宽', 'imgWidth'],
    ['图片高', 'imgHeight'],
    ['图片格式', 'type'],
    ['体积大小', 'fileSize', 'formatSize'],
    ['发布时间', 'createTime']
]
const pageData = reactive<{ [x: string]: any }>({
    total: 0,
    records: [],
    currentPageRecords: [],
    searchParams: {
        pageNo: 1,
        pageSize: 20,
        sort: 0
    },
    conditionList: [],
    visible: false,
    showModalItem: {},
    currentWidth: 0
})

const formatSize = (size: number) => {
    if (size < 1024) {
        return size + 'B'
    } else if (size < 1024 * 1024) {
        return (size / 1024).toFixed(2) + 'KB'
    } else if (size < 1024 * 1024 * 1024) {
        return (size / 1024 / 1024).toFixed(2) + 'MB'
    } else if (size < 1024 * 1024 * 1024 * 1024) {
        return (size / 1024 / 1024 / 1024).toFixed(2) + 'GB'
    } else {
        return (size / 1024 / 1024 / 1024 / 1024).toFixed(2) + 'TB'
    }
}
const handleCardFunction = (item: any, fitem: any) => {
    if (item.length > 2) {
        switch (item[2]) {
            case 'formatSize':
                return formatSize(fitem[item[1]])
            case 'format01':
                return fitem[item[1]] === 1 ? '内容模板' : '布局模板'
        }
    }
    return fitem[item[1]]
}
const searchChange = (e: any = {}) => {
    pageData.searchParams = { ...pageData.searchParams, ...e }
    handleSearch()
}
const handleAllImage = () => {
    // 容器最小宽度为768，最大宽度为1230
    console.log('重新计算图片大小', pageData.currentWidth, pageData.currentPageRecords)
    // 根据当前容器宽度计算，高度不能超过300，默认按高度200来提取图片填充

    let newRecords: any[] = []
    let currentDataIndex = 0
    let prevDataIndex = 0
    let height = 200
    // 按30行计算
    for (let index = 0; index < 30; index++) {
        // 默认按高度200来提取图片填充
        const lsRecords = []
        let currentWidth = 0
        let isSurpassWidth = false
        for (let sindex = currentDataIndex; sindex < pageData.currentPageRecords.length; sindex++) {
            const element = pageData.currentPageRecords[sindex]
            const newWidth = element.imgWidth / (element.imgHeight / height)
            if (currentWidth + newWidth > pageData.currentWidth) {
                isSurpassWidth = true
            }
            currentWidth += newWidth + 20
            lsRecords.push(element)
            currentDataIndex++
            if (isSurpassWidth) {
                break
            }
        }
        if (lsRecords.length === 0) {
            break
        }
        // 多余的宽度，需要分摊到高度上
        const surplusWidth = (currentWidth - 20) - pageData.currentWidth
        height = pageData.currentWidth / (currentWidth - 20) * height
        if (height > 300) {
            // currentDataIndex = prevDataIndex
            height = 300
            // index = index - 1
            // continue
        }
        // 再次汇总宽度
        let newImgWidth = 0
        // 根据lsRecords重新计算高度，当高度值再次超过300，调整height的阈值为150重新计算高度
        for (let sindex = 0; sindex < lsRecords.length; sindex++) {
            const element = lsRecords[sindex]
            element.imgHeightNew = height
            element.imgWidthNew = element.imgWidth / (element.imgHeight / element.imgHeightNew)
            newImgWidth += element.imgWidthNew
        }
        if (newImgWidth !== (pageData.currentWidth - 20 * lsRecords.length) && lsRecords.length > 1) {
            lsRecords[lsRecords.length - 1].imgWidthNew = lsRecords[lsRecords.length - 1].imgWidthNew - (newImgWidth - (pageData.currentWidth - 20 * lsRecords.length))
        }
        // 进行记录上一次的currentDataIndex
        prevDataIndex = currentDataIndex
        // 需要恢复到200
        height = 200
        newRecords = newRecords.concat(lsRecords)
    }
    pageData.records = newRecords
}
const handleSearch = () => {
    useHomePageApi.requestHomeGetImageList(pageData.searchParams).then((res) => {
        if (res.success) {
            pageData.total = res.result.total
            // pageData.records = res.result.records
            pageData.currentPageRecords = res.result.records
            pageData.currentWidth = imgshow.value?.offsetWidth
            handleAllImage()
        }
    })
}
window.onresize = function () {
    if (imgshow.value?.offsetWidth !== pageData.currentWidth) {
        pageData.currentWidth = imgshow.value?.offsetWidth
        handleAllImage()
    }
}
const downloadStaticFile = async (url: any) => {
    if (!url) {
        return
    }
    componentPublishApi.downloadStaticFile(url)
}
const handlePreviewComponent = (data: any) => {
    if (data.id) {
        const { href } = router.resolve({
            name: 'index-image-detail',
            query: {
                id: data.id
            }
        })
        window.open(href, '_blank')
    }
}
handleSearch()
Promise.all([
    useHomeCoreApi.requestCoreMyOrgList()
]).then((res) => {
    const item1 = {
        defaultOptionNumber: 11,
        conditionName: '尺寸',
        showAllOption: true,
        allOptionName: '全部',
        conditionKey: 'size',
        resData: [
            {
                text: '特大',
                value: '4'
            },
            {
                text: '大',
                value: '3'
            },
            {
                text: '中',
                value: '2'
            },
            {
                text: '小',
                value: '1'
            }
        ]
    }
    const item2 = {
        defaultOptionNumber: 11,
        conditionName: '格式',
        showAllOption: true,
        allOptionName: '全部',
        conditionKey: 'type',
        resData: [
            {
                text: 'JPG',
                value: 'JPG'
            },
            {
                text: 'PNG',
                value: 'PNG'
            },
            {
                text: 'GIF',
                value: 'GIF'
            },
            {
                text: 'WEBP',
                value: 'WEBP'
            },
            {
                text: 'BMP',
                value: 'BMP'
            },
            {
                text: 'JPEG',
                value: 'JPEG'
            }
        ]
    }
    const item3 = {
        defaultOptionNumber: 11,
        conditionName: '范围',
        showAllOption: true,
        allOptionName: '全部',
        conditionKey: 'rang',
        resData: [
            {
                text: defaultSettings.yunitName,
                value: '0'
            }
        ]
    }
    if (res[0].result && res[0].result.length > 0) {
        item3.resData = [
            ...item3.resData,
            ...res[0].result.map((el: any) => ({
                text: el.orgname,
                value: el.id
            }))
        ]
    }
    pageData.conditionList = [item1, item2, item3]
})
</script>

<style lang="scss" scoped>
.imgshow{
    padding: 20px 0;
    margin-right: -20px;
    .swipeboxEx{
        overflow: initial;
        position: relative;
        width: 100%;
        overflow: hidden;
        margin: 0 auto;
    }
    .list{
        position: relative;
        display: block;
        overflow: hidden;
        float: left;
        margin: 4px;
        width: calc(33.333% - 8px);
        height: 300px;
        border-radius: 6px;
        box-shadow: 0 2px 10px 0 rgba(61, 64, 75, .2);
        margin: 0 20px 20px 0;
        a{
            display: block;
            height: 100%;
            .image{
                width: 100%;
                height: 100%;
                vertical-align: top;
                border-radius: 6px;
            }
        }

        .photo-tag {
            position: absolute;
            right: 10px;
            left: 0px;
            bottom: -190px;
            width: 100%;
            height: 50px;
            line-height: 55px;
            -webkit-transition: all .2s ease-in;
            transition: all .2s ease-in;
        }

        &.ad_type .photo-tag {
            padding-top: 0;
        }

        .photo-tag a {
            color: #edf0f2;
            font-size: 14px;
        }

        .photo-tag h2 {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }

        .photo-tag .photo-tag-text {
            margin-left: 10px;
            line-height: 43px;
        }

        &:hover .photo-tag {
            bottom: 0px;
            background: -moz-linear-gradient(top, rgba(0,0,0,0) 0%, rgba(0,0,0,0.65) 100%);
            background: -webkit-linear-gradient(top, rgba(0,0,0,0) 0%,rgba(0,0,0,0.65) 100%);
            background: linear-gradient(to bottom, rgba(0,0,0,0) 0%,rgba(0,0,0,0.65) 100%);
            filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#00000000', endColorstr='#a6000000',GradientType=0 );
            width: 100%
        }
        .popup {
            position: absolute;
            top: 5px;
            right: 5px;
            width: 34px;
            height: auto;
            background: rgba(0,0,0,0.3);
            border-radius: 4px;
            backdrop-filter: blur(3px);
            z-index: 2;
            opacity: 0;
            transition: opacity 0.2s;
        }
        &:hover{
            .popup {
                opacity: 1;
            }
        }

        .imgList-btn-item {
            position: relative;
            width: 100%;
            height: 34px;
            text-align: center;
            line-height: 34px;
            color: #fff;
            a{
                color: #fff;
                font-size: 16px;
                text-align: center;
            }
        }

        .imgList-btn-item:first-child::after {
            content: "";
            position: absolute;
            bottom: 0;
            left: 50%;
            width: 13px;
            height: 1px;
            background: rgba(221,221,221,0.4);
            transform: translateX(-50%);
        }
    }
}
.clearfix:after {
    content: '.';
    clear: both;
    display: block;
    height: 0;
    visibility: hidden;
    font-size: 0;
    line-height: 0;
}
</style>
