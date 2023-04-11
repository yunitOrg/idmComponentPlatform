import type { App } from 'vue'
import UndrawUi from '@/undraw-ui/index'

export function registUndrawUI(app: App<Element>) {
    app.use(UndrawUi)
}
