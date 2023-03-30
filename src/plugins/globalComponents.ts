import type { App } from 'vue'
import message from 'ant-design-vue/es/message/index'
import 'ant-design-vue/es/message/style/index.css'
import SvgIcon from '@/icons/SvgIcon.vue'

// 在本地开发中引入的,以提高浏览器响应速度
if (import.meta.env.DEV) {
    import('ant-design-vue/dist/antd.less')
}
// message config
message.config({
    duration: 2,
    maxCount: 1
})

export { message }

export function registerGlobComp(app: App<Element>) {
    app.component('SvgIcon', SvgIcon)
}
