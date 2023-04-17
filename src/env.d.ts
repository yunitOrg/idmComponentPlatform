declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    import type { DefineOptions } from 'unplugin-vue-define-options/vite'
    const component: DefineComponent<{}, {}, any>
    export default component
    export function DefineOptions<DefineComponent>(): Readonly<DefineComponent>
}
declare module '@kangc/v-md-editor/lib/theme/vuepress.js'
declare module '@kangc/v-md-editor/lib/theme/github.js'
declare module '@kangc/v-md-editor/lib/preview'
declare module '@kangc/v-md-editor/lib/codemirror-editor'
declare module 'codemirror'
declare module 'qrcode'
