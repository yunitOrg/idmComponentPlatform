import { yunitAvatar, iSchoolDefault } from '@/assets/images'
export const roleInvitationOptions = [
    { label: '所有人可邀请', value: 0 },
    { label: '管理员可邀请', value: 1 },
    { label: '超级管理员可邀请', value: 2 }
]
export const rolePublicOptions = [
    { label: '不公开', value: 0 },
    { label: '公开', value: 1 }
]
export const roleTopicOptions = [
    { label: '所有人可创建', value: 0 },
    { label: '管理员可创建', value: 1 },
    { label: '超级管理员可创建', value: 2 }
]
export const joinCheckOptions = [
    { label: '不需要审核', value: 0 },
    { label: '需要审核', value: 1 },
    { label: '受邀不需要审核(申请需要审核)', value: 2 }
]
export const courseOptions = [
    { icon: '', name: 'Android开发', id: '101' },
    { icon: '', name: '开放平台', id: '102' },
    { icon: '', name: '数据库', id: '103' },
    { icon: '', name: '开发工具', id: '104' },
    { icon: '', name: '服务器', id: '105' }
]
export const recommendOptions = [
    {
        title: 'Java8编程实践',
        originAvatar: yunitAvatar,
        className: 'Layout',
        team: '云企·社区开发团队',
        origin: '云it官方发布',
        cover: iSchoolDefault,
        count: '240阅读'
    },
    {
        title: '实用数据分析：数据分析师从小白到精通',
        originAvatar: yunitAvatar,
        className: 'Layout',
        team: '云企·社区开发团队',
        origin: '云it官方发布',
        cover: iSchoolDefault,
        count: '240阅读'
    },
    {
        title: '实用数据分析：数据分析师从小白到精通实用数据分析：数据分析师从小白到精通',
        originAvatar: yunitAvatar,
        className: 'Layout',
        team: '云企·社区开发团队',
        origin: '云it官方发布',
        cover: iSchoolDefault,
        count: '240阅读'
    },
    {
        title: '实用数据分析：数据分析师从小白到精通',
        originAvatar: yunitAvatar,
        className: 'Layout',
        team: '云企·社区开发团队',
        origin: '云it官方发布',
        cover: iSchoolDefault,
        count: '240阅读'
    }
]
export const docTitleInfoOptions = {
    title: 'Vue常用的修饰符有哪些？有什么应用场景？',
    tags: 'html,js,css,Qt,LTS',
    userNickname: '申龙',
    createTime: '2021年1月6日19:09',
    readNumber: '124.1K',
    commentNumber: '12',
    collectNumber: '12',
    isOriginal: false,
    classify: '前端开发',
    classifyImg: '',
    badge: [
        {
            img: ''
        }
    ]
}

export const videoTitleInfoOptions = {
    breadcrumbs: [{
        title: '首页',
        herf: 'aaa'
    },
    {
        title: '教程',
        herf: 'bbb'
    },
    {
        title: '实用数据分析：数据分析师从小白到精通',
        herf: 'ccc'
    }]
}
export default {}
