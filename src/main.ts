import 'virtual:svg-icons-register'
import { setupRouter } from './router'
import { setupStore } from './store'
import { registerGlobComp } from '@/plugins/globalComponents'
import { registerMdEditor } from '@/plugins/v-md-editor'
import { registUndrawUI } from '@/plugins/undraw-ui'
import { useDirectives } from '@/directives'
import App from './App.vue'

async function setupApp() {
    const app = createApp(App)

    // store
    setupStore(app)

    // 路由
    setupRouter(app)

    // 全局组件
    registerGlobComp(app)

    // markdown编辑器
    registerMdEditor(app)

    // 评论
    registUndrawUI(app)

    useDirectives(app)

    app.mount('#app')
}
setupApp()
