import type { UserConfig, ConfigEnv } from 'vite'
import { loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import DefineOptions from 'unplugin-vue-define-options/vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import eslintPlugin from 'vite-plugin-eslint'
import AutoImport from 'unplugin-auto-import/vite'

interface VITE_ENV_CONFIG {
    VITE_BASE_URL: string
    VITE_UPLOAD_URL: string
    VITE_PROXY_TARGET?: string
}
console.log(Components)
const resolvePath = (dir) => path.resolve(__dirname, dir)

export default ({ mode }: ConfigEnv): UserConfig => {
    const root = process.cwd()

    const envData = loadEnv(mode, root) as unknown as VITE_ENV_CONFIG

    return {
        base: './',
        plugins: [
            vue(),
            DefineOptions(),
            // auto import components
            Components({
                resolvers: [
                    AntDesignVueResolver({
                        importStyle: mode === 'prod'
                    })
                ]
            }),
            // auto import vue vue-router
            AutoImport({
                imports: ['vue', 'vue-router']
            }),
            // eslint
            eslintPlugin({
                include: ['src/**/*.ts', 'src/**/*.vue', 'src/*.ts', 'src/*.vue'],
                cache: false
            }),
            // svg-icon
            createSvgIconsPlugin({
                iconDirs: [resolvePath('src/icons')],
                symbolId: 'icon-[dir]-[name]'
            })
        ],
        css: {
            preprocessorOptions: {
                less: {
                    modifyVars: {},
                    javascriptEnabled: true
                }
            }
        },
        resolve: {
            alias: {
                '@': resolvePath('./src')
            }
        },
        server: {
            proxy: {
                [envData.VITE_BASE_URL]: {
                    target: envData.VITE_PROXY_TARGET,
                    changeOrigin: true,
                    rewrite: (requestPath: string) => requestPath.replace(new RegExp(`^${envData.VITE_BASE_URL}`), '')
                }
            }
        },
        optimizeDeps: {
            esbuildOptions: {
                target: 'es2020'
            },
            include: ['@ant-design/icons-vue', 'ant-design-vue/es', 'ant-design-vue/es/message/index']
        },
        build: {
            minify: 'terser', // 压缩方式
            rollupOptions: {
                output: {
                    chunkFileNames: 'static/js/[name]-[hash].js',
                    entryFileNames: 'static/js/[name]-[hash].js',
                    assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
                    manualChunks(id) {
                        // 静态资源分拆打包
                        if (id.includes('node_modules')) {
                            return id.toString().split('node_modules/')[1].split('/')[0].toString()
                        }
                    }
                }
            }
        }
    }
}
