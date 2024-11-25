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
    build: {
        rollupOptions: {
            input: {
                index: path.resolve(__dirname, 'index.html')
            }
        },
        commonjsOptions: {
            include: [
                /cookie/,
                /react/,
                /lodash/,
                /open-collaboration-protocol/,
                /open-collaboration-yjs/
            ],
        }
    },
    optimizeDeps: {
        esbuildOptions: {
            plugins: [
                importMetaUrlPlugin
            ]
        },
        include: [
            'open-collaboration-protocol',
            'open-collaboration-yjs'
        ]
    }
})
