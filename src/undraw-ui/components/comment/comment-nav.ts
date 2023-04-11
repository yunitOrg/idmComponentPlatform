import { withInstall } from '@/undraw-ui/util'
import CommentNav from './src/tools/comment-nav.vue'

export type CommentNavInstance = InstanceType<typeof CommentNav>
export const UCommentNav = withInstall(CommentNav)
export default UCommentNav
