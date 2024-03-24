import { http } from '@/plugins/axios'
// import { AxiosProgressEvent } from 'axios'

enum Apis {
    // IDM学院教程-添加
    requestCourseSaveUrl = '/core/course/save',
    // 保存并发布(暂存)教程
    saveVedioListUrl = '/core/course/saveVedioList',
    // 教程-分页列表查询
    getCourseListUrl ='core/course/getCourseList',
    // 教程删除状态更改
    courseDeleteBatchUrl ='core/course/deleteChangeCourse',
    // 获取教程的详情
    getCourseDetailUrl ='core/course/getCourseDetail',
    // 视频章节删除状态更改
    deleteCourseVedioUrl ='core/course/deleteCourseVedio',
    // 教程模板-分页列表查询
    getCourseTemplateListUrl = 'core/course/getCourseTemplateList',
    // 教程文章模板-添加
    saveCircleTemplateUrl = '/core/course/saveCircleTemplate',
    // 教程文章模板-删除
    deleteCourseTempUrl = '/core/course/deleteCourseTemp',
    // 教程文章模板-详情
    getMyCourseTempInfoUrl = 'core/course/getMyCourseTempInfo',
    // 点赞教程
    praiseCourseUrl = 'core/homeaction/course/praise',
    // 取消点赞教程
    unpraiseCourseUrl = 'core/homeaction/course/unpraise',
}

export default {
    requestCourseSave: (data: object) => http.post({ url: Apis.requestCourseSaveUrl, data }),
    requestSaveVedioList: (data: object) => http.post({ url: Apis.saveVedioListUrl, data }),
    requestGetCourseList: (params: object) => http.get({ url: Apis.getCourseListUrl, params }),
    requestCourseDeleteBatch: (data: object) => http.postForm({ url: Apis.courseDeleteBatchUrl, data }),
    requestGetCourseDetail: (params: object) => http.get({ url: Apis.getCourseDetailUrl, params }),
    requestdeleteCourseVedio: (data: object) => http.postForm({ url: Apis.deleteCourseVedioUrl, data }),
    requestGetCourseTemplateList: (params: object) => http.get({ url: Apis.getCourseTemplateListUrl, params }),
    requestSaveCircleTemplate: (data: object) => http.post({ url: Apis.saveCircleTemplateUrl, data }),
    requestGetMyCourseTempInfo: (params: object) => http.get({ url: Apis.getMyCourseTempInfoUrl, params }),
    requestPraiseCourse: (data: object) => http.postForm({ url: Apis.praiseCourseUrl, data }),
    requestUnpraiseCourse: (data: object) => http.postForm({ url: Apis.unpraiseCourseUrl, data }),
    requestDeleteCourseTemp: (data: object) => http.postForm({ url: Apis.deleteCourseTempUrl, data })

}
