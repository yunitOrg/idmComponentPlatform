import { createVNode } from 'vue-demi'
import { HomeOutlined, BookOutlined } from '@ant-design/icons-vue'
export default {
    navList: <Array<MenuItem>>[
        // {
        //     title: '首页',
        //     routeName: 'index-creativeCenter',
        //     key: 'home',
        //     icon: createVNode(HomeOutlined)
        // },
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
                },
                {
                    title: '页面管理',
                    routeName: 'index-creativeCenter-pageManageList'
                },
                {
                    title: '模板管理',
                    routeName: 'index-creativeCenter-templateComponentManageList'
                },
                {
                    title: '业务组件',
                    routeName: 'index-creativeCenter-bComponentManageList'
                },
                {
                    title: '图片管理',
                    routeName: 'index-creativeCenter-imageManageList'
                },
                {
                    title: '公告管理',
                    routeName: 'index-creativeCenter-noticeManageList'
                }
            ]
        },
        {
            title: '我的资源',
            key: 'myResource',
            icon: createVNode(BookOutlined),
            children: [
                {
                    title: '文章教程模板',
                    routeName: 'index-creativeCenter-templateManageList'
                }
            ]
        }
    ]
}
