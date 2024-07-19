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
                path: 'coursePublish',
                name: 'index-coursePublish',
                meta: {
                    title: '教程发布'
                },
                component: () => import('@/views/course/index.vue')
            },
            {
                path: 'videoCoursePublish',
                name: 'index-coursePublish-video',
                meta: {
                    title: '视频教程发布',
                    needLogin: true
                },
                component: () => import('@/views/course/publish/video.vue')
            },
            {
                path: 'videoCourseEdit',
                name: 'index-coursePublish-video-edit',
                meta: {
                    title: '视频教程视频编辑',
                    needLogin: true
                },
                component: () => import('@/views/course/publish/videoEdit.vue')
            },
            {
                path: 'imageTextCoursePublish',
                name: 'index-coursePublish-imageText',
                meta: {
                    title: '图文教程发布',
                    needLogin: true
                },
                component: () => import('@/views/course/publish/imageText.vue')
            },
            {
                path: 'ebookCoursePublish',
                name: 'index-coursePublish-ebook',
                meta: {
                    title: '上传电子书',
                    needLogin: true
                },
                component: () => import('@/views/course/publish/ebook.vue')
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
                path: 'AccessKeyManage',
                meta: {
                    title: 'AccessKey管理',
                    needLogin: true
                },
                name: 'AccessKeyManage',
                component: () => import('@/views/my/AccessKeyManage.vue')
            },
            {
                path: 'resourcePublish',
                name: 'resourcePublish',
                meta: {
                    title: '资源上传',
                    needLogin: true
                },
                component: () => import('@/views/resource/upload.vue')
            },
            {
                path: 'pagePublish',
                name: 'pagePublish',
                meta: {
                    title: '页面发布',
                    needLogin: true
                },
                component: () => import('@/views/resource/publish/page.vue')
            },
            {
                path: 'templatePublish',
                name: 'templatePublish',
                meta: {
                    title: '模板发布',
                    needLogin: true
                },
                component: () => import('@/views/resource/publish/template.vue')
            },
            {
                path: 'bcomponentPublish',
                name: 'bcomponentPublish',
                meta: {
                    title: '业务组件发布',
                    needLogin: true
                },
                component: () => import('@/views/resource/publish/bcomponent.vue')
            },
            {
                path: 'imagePublish',
                name: 'imagePublish',
                meta: {
                    title: '图片发布',
                    needLogin: true
                },
                component: () => import('@/views/resource/publish/image.vue')
            },
            {
                path: 'noticePublish',
                name: 'noticePublish',
                meta: {
                    title: '公告发布',
                    needLogin: true
                },
                component: () => import('@/views/resource/publish/notice.vue')
            },
            {
                path: 'page',
                meta: {
                    title: '页面资源'
                },
                name: 'index-page',
                component: () => import('@/views/resource/pageList.vue')
            },
            {
                path: 'template',
                meta: {
                    title: '模板资源'
                },
                name: 'index-template',
                component: () => import('@/views/resource/templateList.vue')
            },
            {
                path: 'bcomponent',
                meta: {
                    title: '业务组件资源'
                },
                name: 'index-bcomponent',
                component: () => import('@/views/resource/bcomponentList.vue')
            },
            {
                path: 'notice',
                meta: {
                    title: '公告'
                },
                name: 'index-notice',
                component: () => import('@/views/resource/noticeList.vue')
            },
            {
                path: 'image',
                meta: {
                    title: '图片'
                },
                name: 'index-image',
                component: () => import('@/views/resource/imageList.vue')
            },
            {
                path: 'resourcesubject',
                meta: {
                    title: '资源专题广场'
                },
                name: 'index-resourcesubject',
                component: () => import('@/views/resource/subjectList.vue')
            },
            {
                path: 'resourcesubjectdetail',
                meta: {
                    title: '资源专题详情'
                },
                name: 'index-resourcesubjectdetail',
                component: () => import('@/views/resource/detail/subject.vue')
            },
            {
                path: 'imagedetail',
                meta: {
                    title: '图片详情'
                },
                name: 'index-image-detail',
                component: () => import('@/views/resource/detail/image.vue')
            },
            {
                path: 'pagedetail',
                meta: {
                    title: '页面详情'
                },
                name: 'index-page-detail',
                component: () => import('@/views/resource/detail/page.vue')
            },
            {
                path: 'templatedetail',
                meta: {
                    title: '模板详情'
                },
                name: 'index-template-detail',
                component: () => import('@/views/resource/detail/template.vue')
            },
            {
                path: 'bcomponentdetail',
                meta: {
                    title: '业务组件详情'
                },
                name: 'index-bcomponent-detail',
                component: () => import('@/views/resource/detail/bcomponent.vue')
            },
            {
                path: 'idmcore',
                meta: {
                    title: 'IDM-Core'
                },
                name: 'index-idmcore',
                component: () => import('@/views/resource/idmCore.vue')
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
                    },
                    {
                        path: 'courseManageList',
                        name: 'index-creativeCenter-courseManageList',
                        meta: {
                            title: '教程',
                            needLogin: true
                        },
                        component: () => import('@/views/creativeCenter/CourseManageList.vue')
                    },
                    {
                        path: 'templateManageList',
                        name: 'index-creativeCenter-templateManageList',
                        meta: {
                            title: '图文教程模板',
                            needLogin: true
                        },
                        component: () => import('@/views/creativeCenter/TemplateManageList.vue')
                    },
                    {
                        path: 'pageManageList',
                        name: 'index-creativeCenter-pageManageList',
                        meta: {
                            title: '页面管理',
                            needLogin: true
                        },
                        component: () => import('@/views/creativeCenter/pageManageList.vue')
                    },
                    {
                        path: 'templateComponentManageList',
                        name: 'index-creativeCenter-templateComponentManageList',
                        meta: {
                            title: '模板管理',
                            needLogin: true
                        },
                        component: () => import('@/views/creativeCenter/templateComponentManageList.vue')
                    },
                    {
                        path: 'bComponentManageList',
                        name: 'index-creativeCenter-bComponentManageList',
                        meta: {
                            title: '业务组件管理',
                            needLogin: true
                        },
                        component: () => import('@/views/creativeCenter/bComponentManageList.vue')
                    },
                    {
                        path: 'noticeManageList',
                        name: 'index-creativeCenter-noticeManageList',
                        meta: {
                            title: '公告管理',
                            needLogin: true
                        },
                        component: () => import('@/views/creativeCenter/noticeManageList.vue')
                    },
                    {
                        path: 'imageManageList',
                        name: 'index-creativeCenter-imageManageList',
                        meta: {
                            title: '公告管理',
                            needLogin: true
                        },
                        component: () => import('@/views/creativeCenter/imageManageList.vue')
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
    },
    {
        path: '/imageTextMdEdit',
        name: 'imageTextMdEdit',
        meta: {
            title: '教程管理',
            needLogin: true
        },
        component: () => import('@/views/course/publish/imageTextMdEdit.vue')
    },
    {
        path: '/imageTextTemplateEdit',
        name: 'imageTextTemplateEdit',
        meta: {
            title: '新增模板',
            needLogin: true
        },
        component: () => import('@/views/course/templateEdit.vue')
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
