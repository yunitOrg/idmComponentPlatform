import type { UserConfig, ConfigEnv } from 'vite'
import { loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import eslintPlugin from 'vite-plugin-eslint'
import AutoImport from 'unplugin-auto-import/vite'

interface VITE_ENV_CONFIG {
    VITE_BASE_URL: string
    VITE_UPLOAD_URL: string
    VITE_PROXY_TARGET?: string
}

const resolvePath = (dir) => path.resolve(__dirname, dir)

export default ({ mode }: ConfigEnv): UserConfig => {
    const root = process.cwd()

    const envData = loadEnv(mode, root) as unknown as VITE_ENV_CONFIG

    return {
        plugins: [
            vue(),
            // auto import components
            Components({
                dts: 'types/auto-components.d.ts',
                resolvers: [
                    AntDesignVueResolver({
                        importStyle: false
                    })
                ]
            }),
            // auto import vue vue-router
            AutoImport({
                imports: ['vue', 'vue-router'],
                dts: 'types/auto-dependencies.d.ts'
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
        }
    }
}
