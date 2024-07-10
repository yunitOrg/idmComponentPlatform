import { codeImage, componentImage, schoolImage, yunQuanImage, idmImage2, orgImage, personImage, orgIcon2, logoutImage, settingImage, accesskeyImage } from '@/assets/images'

import { settings } from '@/settings/idmSettings'
export const sendListMap = [
    {
        text: '发组件',
        icon: 'lifang',
        iconSize: 26,
        type: 'window',
        url: '/componentPublish'
    },
    {
        text: '发圈子',
        icon: 'quan',
        iconSize: 26,
        url: ''
    },
    {
        text: '组件包',
        icon: 'upload',
        iconSize: 32,
        type: 'window',
        url: '/componentPackagePublish'
    },
    {
        text: '发教程',
        icon: 'tushu',
        iconSize: 26,
        type: 'window',
        url: '/coursePublish'
    },
    {
        text: '建组织',
        icon: 'jianzhu',
        iconSize: 24,
        url: 'index-org'
    },
    {
        text: '发页面',
        icon: 'yemian',
        iconSize: 26,
        type: 'window',
        url: '/resourcePublish?type=page'
    },
    {
        text: '发模板',
        icon: 'moban',
        iconSize: 26,
        type: 'window',
        url: '/resourcePublish?type=template'
    },
    {
        text: '业务组件',
        icon: 'yewuzujian',
        iconSize: 26,
        type: 'window',
        url: '/resourcePublish?type=bcomponent'
    },
    {
        text: '发图片',
        icon: 'tupian',
        iconSize: 26,
        type: 'window',
        url: '/resourcePublish?type=rimage'
    },
    {
        text: '发公告',
        icon: 'gonggao',
        iconSize: 26,
        type: 'window',
        url: '/noticePublish'
    }
]

export const navBoxList: Array<MenuItem> = [
    {
        title: '组件包',
        image: codeImage,
        routeName: 'index-componentPackage'
    },
    {
        title: '组件市场',
        image: componentImage,
        routeName: 'index-componentMarket'
    },
    {
        title: 'i学院',
        image: schoolImage,
        routeName: 'index-iSchool'
    },
    {
        title: '云圈',
        image: yunQuanImage,
        routeName: 'index-yunquan'
    },
    {
        title: '组织',
        image: orgImage,
        routeName: 'index-org'
    },
    {
        title: 'IDM',
        image: idmImage2,
        routeName: 'index-idmcore'
    }
]
export const myActionList = [
    {
        action: 'myOrg',
        text: '我的组织',
        image: orgIcon2
    },
    {
        action: 'personInfo',
        image: personImage,
        text: '个人资料'
    },
    {
        action: 'AccessKeyManage',
        image: accesskeyImage,
        text: 'AccessKey管理'
    },
    {
        action: 'setting',
        image: settingImage,
        text: '账号设置'
    },
    {
        action: 'logout',
        border: true,
        image: logoutImage,
        text: '安全退出'
    }
]
