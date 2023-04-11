import { ReplyApi } from '@/undraw-ui/components'
import { CommentApi, UserApi } from './interface'

export const InjectItemSlot = Symbol('InjectItemSlot')
export const InjectSlots = Symbol('InjectSlots')

// 输入框
export interface SubmitParam2Api {
    content: string
    parentId: string | null
    files: any[]
    clear: () => void
}
export interface InjectInputBoxApi {
    upload: boolean
    submit: ({ content, parentId, files, clear }: SubmitParam2Api) => void
}
export const InjectInputBox: InjectionKey<InjectInputBoxApi> = Symbol('InjectInputBox')

// 内容盒子
export interface InjectContentBoxApi {
    user: Ref<UserApi>
    like: (id: string) => void
    showInfo: (id: string, finish: Function) => void
}
export const InjectContentBox: InjectionKey<InjectContentBoxApi> = Symbol('InjectContentBox')

// 回复盒子
export interface InjectReplyBoxApi {
    page: boolean
    replyShowSize: number
    comments: Ref<CommentApi[]>
    replyPage: (parentId: string, pageNum: number, pageSize: number, finish: (reply: ReplyApi) => void) => void
}
export const InjectReplyBox: InjectionKey<InjectReplyBoxApi> = Symbol('InjectReplyBox')

// 工具栏
export interface InjectOperationApi {
    user: Ref<UserApi>
    tools: string[] | undefined
    operate: (type: string, comment: CommentApi, finish: () => void) => void
}
export const InjectOperation: InjectionKey<InjectOperationApi> = Symbol('InjectOperation')
