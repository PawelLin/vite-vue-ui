import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
export default defineConfig({
    server: {
        open: true,
        host: true,
    },
    build: {
        outDir: 'vue3-pawel-ui',
        lib: {
            entry: resolve('packages/main.ts'),
            name: 'vue3-pawel-ui',
            fileName: 'pw-lib',
        },
        rollupOptions: {
            // 确保外部化处理那些你不想打包进库的依赖
            external: ['vue'],
            output: {
                // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
                globals: {
                    vue: 'Vue',
                },
            },
        },
    },
    plugins: [vue()],
})
