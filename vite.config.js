import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
    base: '',
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src')
        },
    },
    server: {
        allowedHosts: [
            'localhost',
            '127.0.0.1',
            '0.0.0.0',
            'ada3d69471bb.ngrok-free.app',
            'together-horribly-lamprey.ngrok-free.app',
        ]
    },
    build: {
        rollupOptions: {
            external: ['babylonjs'],
        },
    },
})