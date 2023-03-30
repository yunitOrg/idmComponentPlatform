import { http } from '@/plugins/axios'

enum Apis {
    // 保存评论
    commentSave = '/core/cmt/save',
    // 点赞评论
    commentLiked = '/core/cmt/liked',
    // 评论列表
    commentList = '/core/cmt/page',
    // 回复分页
    commentReplyPage = '/core/cmt/replyPage',
    // 获取likeIds
    commentCidList = '/core/cmt/cidList',
    // 删除评论
    commentRemove = '/core/cmt/remove'
}

export default {
    requestCommentSave: (data: Object) => http.postForm({ url: Apis.commentSave, data }),
    requestCommentLiked: (data: Object) => http.post({ url: Apis.commentLiked, data }),
    requestCommentList: (params: { url: string; articleId: string }) => http.get({ url: Apis.commentList + params.url, params }),
    requestCommentReplyPage: (params: { url: string; parentId: string | number }) => http.get({ url: Apis.commentReplyPage + params.url, params }),
    requestCommentCidList: (params: { url: string }) => http.get({ url: Apis.commentCidList + params.url, params }),
    requestCommentRemove: (id: string | number) => http.deleteForm({ url: Apis.commentRemove + '/' + id })
}
