import type { App } from 'vue'
import ClickOutside from './click-outside'
export function useDirectives(app: App<Element>) {
    app.directive('click-outside', ClickOutside)
}
