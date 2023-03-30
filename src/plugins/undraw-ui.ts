import type { App } from 'vue'
import UndrawUi from 'undraw-ui'
import 'undraw-ui/dist/style.css'

export function registUndrawUI(app: App<Element>) {
    app.use(UndrawUi)
}
