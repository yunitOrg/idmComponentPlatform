<template>
    <u-comment
        id="comment-box-container"
        :config="commentConfigData"
        page
        :show-size="2"
        @submit="handleSubmit"
        @like="handleLike"
        @reply-page="handleReplyPage"
        @remove="handleRemove"
        @get-user="getUser"
        @report="handleReport">
        <!-- 去掉title -->
        <template #list-title><div></div></template>
    </u-comment>
</template>
<script setup lang="ts">
import type { CommentSubmitParam, ConfigApi, ReplyPageParam } from 'undraw-ui'
import { defaultSettings } from '@/settings/defaultSetting'
import { useCommentApi } from '@/apis'
import emoji from '@/utils/emoji'
import { message } from '@/plugins/globalComponents'
import { useUserStore } from '@/store/modules/user'
import { getImagePath } from '@/utils'
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
const getUser = () => {
    console.log(123)
}
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

onMounted(() => {
    useCommentApi.requestCommentList({ url: '/1/100', articleId: handleGetArticleId() }).then((res) => {
        commentConfigData.comments = res.result || []
    })
    useCommentApi.requestCommentCidList({ url: '' }).then((res) => {
        commentConfigData.user.likeIds = res.result
    })
})
</script>

<style lang="scss" scoped>
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
