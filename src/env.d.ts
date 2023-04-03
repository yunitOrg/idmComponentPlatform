declare module '*.vue' {
    import { DefineComponent } from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
}
declare module '@kangc/v-md-editor/lib/theme/vuepress.js';
declare module '@kangc/v-md-editor/lib/theme/github.js';
declare module '@kangc/v-md-editor/lib/preview';
declare module '@kangc/v-md-editor/lib/codemirror-editor';
declare module 'codemirror';
declare module 'qrcode';
