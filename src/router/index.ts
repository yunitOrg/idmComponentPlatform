import { createRouter as _createRouter, createWebHistory, createMemoryHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import type { App } from 'vue'
import { useUserStoreWithOut } from '@/store/modules/user'
import { getToken } from '@/utils/auth'
const userStore = useUserStoreWithOut()
const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: () => import('@/views/index.vue'),
        children: [
            {
                path: '',
                name: 'index',
                meta: {
                    keepAlive: false
                },
                component: () => import('@/views/index/List.vue')
            },
            {
                path: 'componentPackage',
                meta: {
                    title: '组件包'
                },
                name: 'index-componentPackage',
                component: () => import('@/views/componentPackage/List.vue')
            },
            {
                path: 'componentPackageDetail',
                name: 'index-componentPackage-detail',
                meta: {
                    title: '组件包详情'
                },
                component: () => import('@/views/componentPackage/Detail.vue')
            },
            {
                path: 'componentPackagePublish',
                name: 'index-componentPackagePublish',
                meta: {
                    title: '组件包发布'
                },
                component: () => import('@/views/componentPackage/Publish.vue')
            },
            {
                path: 'componentPublish',
                name: 'index-componentPublish',
                meta: {
                    title: '组件发布'
                },
                component: () => import('@/views/component/Publish.vue')
            },
            {
                path: 'componentMarket',
                meta: {
                    title: '组件市场'
                },
                name: 'index-componentMarket',
                component: () => import('@/views/componentMarket/List.vue')
            },
            {
                path: 'componentMarketDetail',
                name: 'index-componentMarket-detail',
                meta: {
                    title: '组件详情'
                },
                component: () => import('@/views/componentMarket/Detail.vue')
            },
            {
                path: 'iSchool',
                meta: {
                    title: 'i学院'
                },
                name: 'index-iSchool',
                component: () => import('@/views/iSchool/List.vue')
            },
            {
                path: 'imageTextDetail',
                meta: {
                    title: '图文详情'
                },
                name: 'index-iSchool-imageTextDetail',
                component: () => import('@/views/iSchool/detail/ImageText.vue')
            },
            {
                path: 'eBookDetail',
                meta: {
                    title: '电子书详情'
                },
                name: 'index-iSchool-eBookDetail',
                component: () => import('@/views/iSchool/detail/eBook.vue')
            },
            {
                path: 'videoDetail',
                meta: {
                    title: '视频详情'
                },
                name: 'index-iSchool-videoDetail',
                component: () => import('@/views/iSchool/detail/video.vue')
            },
            {
                path: 'yunquan',
                meta: {
                    title: '云圈'
                },
                name: 'index-yunquan',
                component: () => import('@/views/yunquan/List.vue')
            },
            {
                path: 'org',
                meta: {
                    title: '组织'
                },
                name: 'index-org',
                component: () => import('@/views/org/List.vue')
            },
            {
                path: 'indexPage/:userId',
                name: 'indexPage',
                meta: {
                    title: '个人主页'
                },
                props: true,
                component: () => import('@/views/my/indexPage.vue')
            },
            {
                path: 'AccountPassword',
                meta: {
                    title: '账号密码',
                    needLogin: true
                },
                name: 'AccountPassword',
                component: () => import('@/views/my/AccountPassword.vue')
            },
            {
                path: 'PersonInfo',
                meta: {
                    title: '个人资料',
                    needLogin: true
                },
                name: 'PersonInfo',
                component: () => import('@/views/my/PersonInfo.vue')
            },
            {
                path: 'creativeCenter',
                component: () => import('@/views/creativeCenter/index.vue'),
                children: [
                    {
                        path: '',
                        name: 'index-creativeCenter',
                        meta: {
                            title: '主页',
                            needLogin: true
                        },
                        redirect: '/creativeCenter/componentPackageManageList'
                    },
                    {
                        path: 'componentPackageManageList',
                        name: 'index-creativeCenter-componentPackageManageList',
                        meta: {
                            title: '组件包管理',
                            needLogin: true
                        },
                        component: () => import('@/views/creativeCenter/ComponentPackageManageList.vue')
                    },
                    {
                        path: 'componentManageList',
                        name: 'index-creativeCenter-componentManageList',
                        meta: {
                            title: '组件管理',
                            needLogin: true
                        },
                        component: () => import('@/views/creativeCenter/ComponentManageList.vue')
                    }
                ]
            },
            {
                path: '/message',
                component: () => import('@/views/message/index.vue'),
                children: [
                    {
                        path: 'list',
                        meta: {
                            title: '消息列表',
                            needLogin: true
                        },
                        name: 'message-list',
                        component: () => import('@/views/message/list/index.vue')
                    }
                ]
            },
            {
                path: ':pathMatch(.*)',
                meta: {
                    title: 'Page Not Found'
                },
                component: () => import('@/views/404/index.vue')
            }
        ]
    },
    {
        path: '/share',
        name: 'share',
        meta: {
            title: '组织邀请'
        },
        component: () => import('@/views/share/index.vue')
    },
    {
        path: '/previewComponent',
        name: 'previewComponent',
        meta: {
            title: '预览组件'
        },
        component: () => import('@/views/previewComponent/index.vue')
    }
]

const router = _createRouter({
    history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) return savedPosition
        else return { top: 0 }
    }
})
router.beforeEach(async (to, from, next) => {
    // 用户没有登录，有token ，用token登录
    if (!userStore.isUserLogined && getToken() && !userStore.isRouterGetedUserInfo) {
        await userStore.handleGetUserInfo()
        userStore.isRouterGetedUserInfo = true
    }
    if (to.meta.needLogin && !userStore.isUserLogined) {
        next({ name: 'index' })
        return
    }
    next()
})

export const setupRouter = (app: App<Element>) => {
    app.use(router)
}
