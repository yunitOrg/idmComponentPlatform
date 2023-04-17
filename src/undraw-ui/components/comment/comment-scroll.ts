import { withInstall } from '@/undraw-ui/util'
import commentScroll from './src/comment-scroll.vue'

export type CommentScrollInstance = InstanceType<typeof commentScroll>
export const UCommentScroll = withInstall(commentScroll)
export default UCommentScroll
