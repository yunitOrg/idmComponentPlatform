interface MessageData {
    circleContent: string //	圈子标题
    circleContent1: string //	圈子标题(评论关联的)
    circleId: string //	圈子ID
    circleId1: string //	圈子ID(评论关联的)
    cmtContent: string //	评论内容
    cmtContent1: string //	评论内容(评论关联的父级评论)
    cmtId: string //	评论ID
    cmtId1: string //	评论ID(评论关联的父级评论)
    codepackageId: string //	组件包ID
    codepackageId1: string //	组件包ID(评论关联的)
    codepackageTitle: string //	组件包标题
    codepackageTitle1: string //	组件包标题(评论关联的)
    comId: string //	组件ID
    comId1: string //	组件ID(评论关联的)
    comTitle: string //	组件标题
    comTitle1: string //	组件标题(评论关联的)
    courseId: string //	教程ID
    courseId1: string //	教程ID(评论关联的)
    courseTitle: string //	教程标题
    courseTitle1: string //	教程标题(评论关联的)
    createBy: string //	创建人
    createTime: string //	创建日期
    gender: 0 | 1 //	性别，0女、1男
    id: string //	id
    idNo: number //	用户编号，最低6位起步。类似QQ的号码	integer
    level: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 //	会员（创作）等级，暂定0\1\2\3\4\5\6\7等
    likeTotal: number //	获赞总数，所有的累加
    msgContent: string //	消息内容
    msgTime: string //	提醒时间
    msgTitle: string //	消息标题
    nickname: string //	昵称
    orgId: string //	组织ID
    orgName: string //	组织标题
    orgPhoto: string //	组织头像
    readStatus: 0 | 1 //	0未读、1已读
    readTime: string //	阅读时间
    saying: string //	一句话简介
    sendUserId: string //	发送消息的用户主键ID
    sourceId: string //	消息源头ID
    sourceType: 1 | 2 | 3 | 4 | 5 | 6 | 8 | 9 | 10 | 11  //	消息源头类型，1:组件包、2:组件、3:教程、4:云圈、5:组织、6:评论
    sysOrgCode: string //	所属部门
    type: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 //	消息类型,0:提到我的，1:评论，2：回复，3:新增粉丝，4：赞，5：收藏，6:邀请，7：申请，:8:赞赏，9：付费，10:系统通知，11:私信	integer
    updateBy: string //	更新人	string
    updateTime: string //	更新日期	string
    userId: string //	用户主键ID	string
    userphoto: string //	头像	string
    [x: string]: any
}
