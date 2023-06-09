<template>
    <div class="u-comment">
        <div class="comment-form">
            <div class="header">
                <span class="header-title">评论</span>
            </div>
            <div class="content">
                <div class="avatar-box">
                    <a-avatar :size="40" :src="config.user.avatar">
                        <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" />
                    </a-avatar>
                </div>
                <InputBox placeholder="输入评论（Enter换行，Ctrl + Enter发送）" content-btn="发表评论" />
            </div>
        </div>
        <!-- <div class="hot-list"></div> -->
        <div class="comment-list-wrapper">
            <slot>
                <div class="title">全部评论</div>
            </slot>
            <CommentList :data="comments" :total="total !== undefined ? total : 0" :show-size="isNull(showSize, 5)"></CommentList>
        </div>
    </div>
</template>

<script setup lang="ts">
import InputBox from './tools/input-box.vue'
import CommentList from './comment-list.vue'
import { CommentApi, ConfigApi, InjectionEmojiApi, isNull, isEmpty, SubmitParamApi, ReplyPageParamApi } from '@/undraw-ui/index'
import {
    InjectContentBoxApi,
    InjectContentBox,
    InjectInputBox,
    InjectOperation,
    InjectReplyBox,
    InjectSlots,
    InjectInputBoxApi,
    InjectOperationApi,
    InjectReplyBoxApi,
    SubmitParam2Api
} from '../key'
defineOptions({
    name: 'UComment'
})

interface Props {
    config: ConfigApi
    page?: boolean
    upload?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    page: false,
    upload: false
})
// 将这个属性转换为响应式数据。
// const comments = toRef(props.config, 'comments')
const { user, comments, showSize, replyShowSize, total, tools } = toRefs(props.config)

const emit = defineEmits<{
    (e: 'submit', { content, parentId, files, finish }: SubmitParamApi): void
    (e: 'like', id: string, finish: () => void): void
    (e: 'replyPage', { parentId, pageNum, pageSize, finish }: ReplyPageParamApi): void
    (e: 'showInfo', id: string, finish: Function): void
    (e: 'operate', type: string, comment: CommentApi, finish: () => void): void
}>()

/**
 * 提交评论
 */
const submit = ({ content, parentId, files, clear }: SubmitParam2Api) => {
    // 添加评论
    const finish = (comment: CommentApi) => {
        // 清空输入框内容
        clear()
        // 提交评论添加到评论列表
        if (parentId) {
            const rawComment = comments.value.find((v) => v.id === parentId)
            if (rawComment) {
                const reply = rawComment.reply
                if (reply) {
                    reply.list.unshift(comment)
                    reply.total++
                } else {
                    rawComment.reply = {
                        total: 1,
                        list: [comment]
                    }
                }
            }
        } else {
            comments.value.unshift(comment)
        }
    }
    emit('submit', { content, parentId, files, finish })
}
const inputBoxParam: InjectInputBoxApi = {
    upload: props.upload,
    submit
}
// 输入框盒子
provide(InjectInputBox, inputBoxParam)

/**
 * 点赞事件
 * @param id
 */
const like = (id: string) => {
    // 点赞评论数组处理
    const editLike = (id: string, count: number) => {
        let tar = null
        comments.value.forEach((v) => {
            if (v.id !== id) {
                tar = v.reply?.list.find((v) => v.id === id)
            } else {
                tar = v
            }
            if (tar) {
                tar.likes += count
            }
        })
    }

    // 点赞事件处理
    const likeIds = props.config.user.likeIds
    const temp = likeIds.map(String)
    emit('like', id, () => {
        if (temp.indexOf(id) === -1) {
            // 点赞
            likeIds.push(id as never)
            editLike(id, 1)
        } else {
            // 取消点赞
            const index = temp.findIndex((item) => item === id)
            if (index !== -1) likeIds.splice(index, 1)
            editLike(id, -1)
        }
    })
}
/**
 * 评论盒子参数或方法
 */
const contentBoxParam: InjectContentBoxApi = {
    user,
    like,
    showInfo: (uid, finish) => emit('showInfo', uid, finish)
}
provide(InjectContentBox, contentBoxParam)

// 回复盒子
const replyBoxParam: InjectReplyBoxApi = {
    page: props.page,
    replyPage: (parentId, pageNum, pageSize, finish) => {
        emit('replyPage', { parentId, pageNum, pageSize, finish })
    },
    replyShowSize: isNull(replyShowSize, 3),
    comments
}
provide(InjectReplyBox, replyBoxParam)

/**
 * 删除当前评论
 * @param comment
 */
const remove = (comment: CommentApi) => {
    // 删除评论数据操作
    const { parentId, id } = comment
    if (parentId) {
        const comment = comments.value.find((item) => item.id === parentId)
        const reply = comment?.reply
        if (reply) {
            const index = reply.list.findIndex((item) => item.id === id)
            if (index !== -1) {
                reply.list.splice(index, 1)
                reply.total--
            }
        }
    } else {
        const index = comments.value.findIndex((item) => item.id === id)
        if (index !== -1) {
            comments.value.splice(index, 1)
        }
    }
}
// 工具栏功能
// 工具栏方法
const operation: InjectOperationApi = {
    user,
    tools: tools?.value,
    operate: (type, comment, finish) => {
        if (isEmpty(type)) return
        const v = type.split('#')[0]
        if (v === '删除' || v === 'delete' || v === 'remove') {
            emit('operate', type, comment, () => {
                finish()
                remove(comment)
            })
        } else {
            emit('operate', type, comment, finish)
        }
    }
}
provide(InjectOperation, operation)

// 表情包
provide(InjectionEmojiApi, props.config.emoji)

// 工具卡槽
provide(InjectSlots, useSlots())
</script>

<style lang="scss" scoped>
@use '../style/comment.scss';
</style>
