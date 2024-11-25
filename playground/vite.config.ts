import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from 'tailwindcss';
import importMetaUrlPlugin from '@codingame/esbuild-import-meta-url-plugin';
import * as path from 'path';
import * as fs from 'fs/promises';

// https://vitejs.dev/config https://vitest.dev/config
export default defineConfig({
    plugins: [react()],
    css: {
        postcss: {
            plugins: [tailwindcss()]
        }
    },
    build: {
        target: 'esnext',
        rollupOptions: {
            input: {
                index: path.resolve(__dirname, 'index.html')
            }
        },
        commonjsOptions: {
            transformMixedEsModules: true
        }
    },
    resolve: {
        // // Explizite Behandlung von CommonJS-Modulen
        // alias: {
        //   // Pfad zum problematischen Modul
        //   '../../open-collaboration-tools/packages/open-collaboration-monaco/lib/monaco-api.js': 'commonjs'
        // }
    },
    optimizeDeps: {
        esbuildOptions: {
            plugins: [
                importMetaUrlPlugin
            ]
        },
        include: [
            'oct-collaboration-monaco',
            'open-collaboration-protocol',
            'open-collabortaion-yjs'
        ]
    }
})
