import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        allowedHosts: [
            'cooling-untitled-fashion-eve.trycloudflare.com',
            '.trycloudflare.com',
            'localhost'
        ]
    }
})
