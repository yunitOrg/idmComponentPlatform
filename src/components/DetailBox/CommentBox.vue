<template>
    <div class="idm-component-common-box comment-container">
        <u-comment
            id="comment-box-container"
            :config="commentConfigData"
            page
            upload
            :show-size="2"
            @submit="handleSubmit"
            @like="handleLike"
            @reply-page="handleReplyPage"
            @remove="handleRemove"
            @report="handleReport">
            <!-- 去掉title -->
            <template #list-title><div></div></template>
        </u-comment>
        <div class="text-center">
            <a-spin v-if="pageData.loading"></a-spin>
            <div v-if="!pageData.hasMore">没有更多了</div>
        </div>
    </div>
</template>
<script setup lang="ts">
import type { CommentSubmitParam, ConfigApi, ReplyPageParam } from 'undraw-ui'
import { defaultSettings } from '@/settings/defaultSetting'
import { useCommentApi } from '@/apis'
import emoji from '@/utils/emoji'
import { message } from '@/plugins/globalComponents'
import { useUserStore } from '@/store/modules/user'
import { getImagePath } from '@/utils'
import { throttle } from 'lodash-es'
const userStore = useUserStore()
const commentConfigData = reactive<ConfigApi>({
    user: {
        id: userStore?.userInfo?.id || -1,
        username: userStore?.userInfo?.nickname || 'yunit',
        avatar: getImagePath(userStore?.userInfo?.userphoto) || defaultSettings.userphoto,
        // 评论id数组 建议:存储方式用户id和文章id和评论id组成关系,根据用户id和文章id来获取对应点赞评论id,然后加入到数组中返回
        likeIds: []
    },
    emoji,
    comments: []
})
const pageData = reactive({
    loading: false,
    hasMore: true,
    commentPageConfig: {
        page: 1,
        size: 100
    }
})
const propData = defineProps({
    commentTypeId: {
        type: String,
        default: 'codepackageId'
    },
    articleType: {
        type: String,
        required: true
    }
})

const route = useRoute()

const handleGetArticleId = () => {
    const articleId = (route.query[propData.commentTypeId] as string) || ''
    return articleId
}

/**
 * 去除属性值为 null和undefined、''的数据
 * @param obj
 */
function removeEmptyField(obj: any) {
    return Object.keys(obj)
        .filter((key) => obj[key] !== null && obj[key] !== undefined && obj[key] !== '')
        .reduce((acc, key) => ({ ...acc, [key]: obj[key] }), {})
}

// 提交评论事件
const handleSubmit = ({ content, parentId, files, finish }: CommentSubmitParam) => {
    const formData = {
        content,
        parentId,
        articleId: handleGetArticleId(),
        files,
        user: {
            username: commentConfigData.user.username,
            avatar: commentConfigData.user.avatar
        },
        articleType: propData.articleType
    }
    useCommentApi.requestCommentSave(removeEmptyField(formData)).then((res) => {
        if (res.success) {
            if (res.result?.user?.avatar === null) {
                res.result.user.avatar = commentConfigData.user.avatar
            }
            finish(res.result as any)
        } else {
            message.warning(res.message)
        }
    })
}
// 删除评论
const handleRemove = (id: string, finish: () => void) => {
    useCommentApi.requestCommentRemove(id).then((res) => {
        if (res.success) {
            finish()
        }
    })
}

// 举报用户
const handleReport = (id: string, finish: () => void) => {
    setTimeout(() => {
        finish()
    }, 200)
}

// 点赞按钮事件
const handleLike = (id: string, finish: () => void) => {
    useCommentApi.requestCommentLiked({ articleId: id, commentId: id }).then((res) => {
        if (res.success) {
            finish()
        }
    })
}

// 回复分页
const handleReplyPage = ({ parentId, pageNum, pageSize, finish }: ReplyPageParam) => {
    useCommentApi
        .requestCommentReplyPage({
            url: `/${pageNum}/${pageSize}`,
            parentId
        })
        .then((res) => {
            finish(res.result)
        })
}

const fetchCommentList = () => {
    if (!pageData.hasMore) return
    pageData.loading = true
    useCommentApi
        .requestCommentList({ url: `/${pageData.commentPageConfig.page}/${pageData.commentPageConfig.size}`, articleId: handleGetArticleId() })
        .then((res) => {
            if (res.success && Array.isArray(res.result)) {
                if (res.result.length === pageData.commentPageConfig.size) {
                    pageData.hasMore = true
                } else {
                    pageData.hasMore = false
                }
                commentConfigData.comments = [...commentConfigData.comments, ...res.result]
            }
        })
        .finally(() => {
            pageData.loading = false
        })
}

const handleFetchMoreComment = throttle(fetchCommentList, 2000)
onMounted(() => {
    useCommentApi.requestCommentCidList({ url: '' }).then((res) => {
        commentConfigData.user.likeIds = res.result
    })
    document?.addEventListener('scroll', () => {
        const divHeight = document.documentElement?.offsetHeight ?? 0
        const nScrollHeight = document.documentElement?.scrollHeight ?? 0
        const nScrollTop = document.documentElement?.scrollTop ?? 0
        if (nScrollTop + divHeight + 1 >= nScrollHeight) {
            handleFetchMoreComment()
        }
    })
})
</script>

<style lang="scss" scoped>
.comment-container {
    padding-bottom: 20px;
    .fetch-more-comment {
        color: var(--u-color-primary);
        box-sizing: border-box;
        cursor: pointer;
        svg {
            fill: currentColor;
        }
    }
}
#comment-box-container {
    margin-top: 16px;
    ::v-deep(.header) {
        display: none;
    }
    ::v-deep(.comment-form) {
        padding-top: 10px;
    }
    ::v-deep(.picture) {
        svg {
            vertical-align: middle;
        }
    }
}
</style>
