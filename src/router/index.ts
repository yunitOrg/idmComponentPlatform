import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import type { App } from 'vue'
import { useUserStoreWithOut } from '@/store/modules/user'
import { getToken } from '@/utils/auth'
const userStore = useUserStoreWithOut()
const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: '',
        component: () => import('@/views/index.vue'),
        children: [
            {
                path: '',
                name: 'index',
                meta: {
                    keepAlive: false,
                    title: '首页'
                },
                component: () => import('@/views/index/List.vue')
            },
            {
                path: 'componentPackage',
                meta: {
                    title: '组件包列表'
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
                path: 'my',
                component: () => import('@/views/my/index.vue'),
                children: [
                    {
                        path: 'indexPage',
                        meta: {
                            title: '我的首页'
                        },
                        name: 'my-indexPage',
                        component: () => import('@/views/my/MyIndexPage.vue')
                    },
                    {
                        path: 'personalData',
                        meta: {
                            title: '个人资料'
                        },
                        name: 'my-personalData',
                        component: () => import('@/views/my/PersonalData.vue')
                    }
                ]
            },
            {
                path: 'creativeCenter',
                component: () => import('@/views/creativeCenter/index.vue'),
                children: [
                    {
                        path: '',
                        name: 'index-creativeCenter',
                        meta: {
                            title: '主页'
                        },
                        redirect: '/creativeCenter/componentPackageManageList'
                    },
                    {
                        path: 'componentPackageManageList',
                        name: 'index-creativeCenter-componentPackageManageList',
                        meta: {
                            title: '组件包管理'
                        },
                        component: () => import('@/views/creativeCenter/ComponentPackageManageList.vue')
                    },
                    {
                        path: 'componentManageList',
                        name: 'index-creativeCenter-componentManageList',
                        meta: {
                            title: '组件管理'
                        },
                        component: () => import('@/views/creativeCenter/ComponentManageList.vue')
                    }
                ]
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
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) return savedPosition
        else return { top: 0 }
    }
})

router.beforeEach(async (from, to, next) => {
    // 用户没有登录，有token ，用token登录
    if (!userStore.isUserLogined && getToken() && !userStore.isRouterGetedUserInfo) {
        await userStore.handleGetUserInfo()
        userStore.isRouterGetedUserInfo = true
    }
    next()
})

export const setupRouter = (app: App<Element>) => {
    app.use(router)
}
