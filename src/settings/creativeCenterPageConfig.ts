
import { createVNode } from 'vue-demi'
import { HomeOutlined, BookOutlined } from '@ant-design/icons-vue'
export default {
    navList: <Array<MenuItem>>[
        {
            title: '首页',
            routeName: 'index-creativeCenter',
            key: 'home',
            icon: createVNode(HomeOutlined)
        },
        {
            title: '创作',
            key: 'create',
            icon: createVNode(BookOutlined),
            children: [
                {
                    title: '发组件',
                    routeName: '/componentPublish'
                },
                {
                    title: '传组件包',
                    routeName: '/componentPackagePublish'
                },
                {
                    title: '发教程',
                    routeName: '/coursePublish'
                }
            ]
        },
        {
            title: '我的内容',
            key: 'myContent',
            icon: createVNode(BookOutlined),
            children: [
                {
                    title: '组件包管理',
                    routeName: 'index-creativeCenter-componentPackageManageList'
                },
                {
                    title: '组件管理',
                    routeName: 'index-creativeCenter-componentManageList'
                },
                {
                    title: '教程管理',
                    routeName: 'index-creativeCenter-courseManageList'
                }
            ]
        }
    ]
}
