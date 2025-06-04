import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import importMetaUrlPlugin from '@codingame/esbuild-import-meta-url-plugin';
import * as path from 'path';

// https://vitejs.dev/config https://vitest.dev/config
export default defineConfig({
    plugins: [react()],
    css: {
        postcss: {
            plugins: [tailwindcss()]
        }
    },
    optimizeDeps: {
        esbuildOptions: {
            plugins: [
                importMetaUrlPlugin,
            ]
        }
    },
    worker: {
        format: 'es'
    },
})
