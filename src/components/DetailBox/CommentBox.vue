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
            <template #card="scope">
                <div class="user-card">
                    <div class="flex" style="height: 70px">
                        <div class="user-avatar">
                            <a-avatar :size="75" fit="cover" :src="getImagePath(scope.userphoto)">
                                <img :src="defaultSettings.userphoto" />
                            </a-avatar>
                        </div>
                        <div class="user-content">
                            <div class="user-info">
                                <div class="username text-o-e-1" @click="void 0">
                                    <span class="name">{{ scope.nickname }}</span>
                                    <span blank="true" class="rank">
                                        <u-icon size="24">{{ useLevel(scope.level) }}</u-icon>
                                    </span>
                                </div>
                                <div class="text-o-e-1">
                                    {{ scope.saying || defaultSettings.saying }}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="social-info flex text-center justify-around">
                        <div class="like" @click="void 0">
                            <div>{{ scope.likeTotal || '0' }}</div>
                            <span>获赞</span>
                        </div>
                        <div class="follower" @click="void 0">
                            <div>{{ scope.fansTotal || '0' }}</div>
                            <span>粉丝</span>
                        </div>
                        <div class="attention" @click="void 0">
                            <div>{{ scope.componentTotal || '0' }}</div>
                            <span>组件</span>
                        </div>
                    </div>
                    <div v-if="userStore.isUserLogined && scope.id !== userStore.userInfo?.id" class="card-btn text-center">
                        <a-button size="small" type="primary" @click="handleFlow">{{ userStore.userInfo && userStore.userInfo.focusThis == 1 ? '已关注' : '关注' }}</a-button>
                        <a-button size="small" style="margin: 0 0 0 20px" @click="handleSendMessage">发消息</a-button>
                    </div>
                </div>
            </template>
        </u-comment>
        <div class="text-center">
            <a-spin v-if="pageData.loading"></a-spin>
            <div v-if="!pageData.hasMore">没有更多了</div>
        </div>
    </div>
</template>
<script setup lang="ts">
import type { CommentSubmitParam, ConfigApi, ReplyPageParam } from '@/undraw-ui'
import { UIcon } from '@/undraw-ui'
import { useLevel } from '@/undraw-ui/hooks'
import { defaultSettings } from '@/settings/defaultSetting'
import { useCommentApi, useUserApi } from '@/apis'
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
        page: 0,
        size: 20
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

// 点击关注
const handleFlow = () => {
    const userInfo = userStore.userInfo || { focusThis: 0, id: 0 }
    if (userInfo.focusThis === undefined) return
    useUserApi[userInfo.focusThis !== 1 || userInfo.focusThis !== null ? 'requestFollowUser' : 'requestUnFollowUser']({
        userId: userInfo.id
    }).then((res) => {
        if (res.success) {
            userStore.userInfo!.focusThis = userInfo.focusThis === 1 ? 0 : 1
        } else message.error(res.message)
    })
}

// 发消息
const handleSendMessage = () => {}

// 获取文章id参数
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
        if (nScrollTop + divHeight + 200 >= nScrollHeight) {
            pageData.commentPageConfig.page += 1
            handleFetchMoreComment()
        }
    })
})
</script>

<style lang="scss" scoped>
.comment-container {
    padding-bottom: 20px;
    background: #fff;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.05);
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
.user-card {
    .user-content {
        flex: 1;
        margin-left: 16px;
        .user-info {
            .username {
                display: flex;
                align-items: center;
                text-decoration: none;
                .name {
                    max-width: 10rem;
                    font-weight: 500;
                    font-size: 15px;
                    color: #252933;
                    line-height: 32px;
                    margin-right: 4px;
                }
            }
        }
    }
    .user-avatar {
        position: relative;
        top: -28px;
        border: 5px solid #fff;
        border-radius: 50%;
    }

    .social-info {
        margin: 0 0 10px;
        border-top: 1px solid #f1f1f1;
        padding: 10px 0 0;
        .like,
        .follower,
        .attention {
            div {
                font-weight: 600;
                font-size: 18px;
            }
        }
    }
    .card-btn {
        margin-top: 10px;
    }
}
</style>
