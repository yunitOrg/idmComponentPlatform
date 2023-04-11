import { EmojiApi } from '../emoji/interface'

export interface CommentUserApi {
    username: string
    avatar: string
    level: number
    homeLink: string
}

export interface ReplyApi {
    total: number
    // eslint-disable-next-line no-use-before-define
    list: CommentApi[]
}

export interface CommentApi {
    id: string | number
    parentId: string | number | null
    uid: string | number
    address: string
    content: string
    likes: number
    contentImg?: string
    createTime: string
    user: CommentUserApi
    reply?: ReplyApi | null
}

export interface UserApi {
    id: string | number
    username: string
    avatar: string
    likeIds: string[] | number[]
}

export interface ConfigApi {
    showSize?: number
    replyShowSize?: number
    total?: number
    tools?: Array<string>
    user: UserApi
    emoji: EmojiApi
    comments: CommentApi[]
}

export interface SubmitParamApi {
    content: string
    parentId: string | null
    files: any[]
    finish: (comment: CommentApi) => void
}

export interface ReplyPageParamApi {
    parentId: string
    pageNum: number
    pageSize: number
    finish: (reply: ReplyApi) => void
}

export interface CommentSubmitParam {
    content: string
    parentId: string | null
    files: any[]
    finish: (comment: CommentApi) => void
}

export interface ReplyPageParam {
    parentId: string | number
    pageNum: number
    pageSize: number
    finish: (comments: ReplyApi) => void
}
