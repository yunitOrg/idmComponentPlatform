export const messageActionType = {
    0: '提到我的',
    1: '评论',
    2: '回复',
    3: '新增关注',
    4: '赞',
    5: '收藏',
    6: '邀请',
    7: '申请',
    8: '赞赏',
    9: '付费',
    10: '系统通知',
    11: '私信'
}

export const messageSourceType = {
    1: '组件包',
    2: '组件',
    3: '教程',
    4: '云圈',
    5: '组织',
    6: '评论',
    8: '页面',
    9: '模板',
    10: '业务组件',
    11: '图片'
}

export enum messageTitleFields {
    'codepackageTitle' = 1,
    'comTitle',
    'courseTitle',
    'circleContent',
    'orgName',
    'cmtContent', // 暂定
    'userName',
    'pageTitle',
    'customTitle',
    '',
    'imageTitle'
}
