import { Plugin } from 'vue'
import Comment from './comment'
import CommentScroll from './comment/comment-scroll'
import CommentNav from './comment/comment-nav'
import Editor from './editor'
import Icon from './icon'
import Emoji from './emoji'

export default [Comment, CommentScroll, CommentNav, Editor, Icon, Emoji] as Plugin[]
