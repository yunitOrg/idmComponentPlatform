import { settings } from './idmSettings'
import { indexCodePackageImage, indexComponentImage, indexYunQuanImage, indexSchoolImage, indexHotImage } from '@/assets/images'
export default {
    componentPackage: {
        moreText: '全部',
        leftImage: indexCodePackageImage,
        moreRouteName: 'index-componentPackage'
    },
    componentMarket: {
        moreText: '全部',
        leftImage: indexComponentImage,
        moreRouteName: 'index-componentMarket'
    },
    yunQuan: {
        moreText: '全部',
        leftImage: indexYunQuanImage,
        moreRouteName: 'index-yunquan'
    },
    iSchool: {
        iconClass: 'school',
        leftImage: indexSchoolImage,
        moreRouteName: 'index-iSchool'
    },
    hotTalk: {
        moreText: '全部',
        leftImage: indexHotImage,
        moreRouteName: 'index-yunquan'
    },
    headNavList: <Array<MenuItem>>[
        {
            title: '首页',
            routeName: 'index'
        },
        {
            title: '组件包',
            routeName: 'index-componentPackage'
        },
        {
            title: '组件市场',
            routeName: 'index-componentMarket'
        },
        {
            title: 'i学院',
            routeName: 'index-iSchool'
        },
        {
            title: '云圈',
            routeName: 'index-yunquan'
        },
        {
            title: '组织',
            routeName: 'index-org'
        },
        {
            title: 'IDM',
            routeName: settings.url
        },
        {
            title: '创作中心',
            routeName: 'index-creativeCenter',
            hiddenInMenu: true
        }
    ]
}
