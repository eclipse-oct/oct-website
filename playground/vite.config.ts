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
        lib: {
            entry: path.resolve(__dirname, 'src/index.tsx'),
            name: 'playground',
            fileName: 'playground',
            formats: ['es'],
          },
  },
})
    // build: {
    //     rollupOptions: {
    //         input: {
    //             index: path.resolve(__dirname, 'index.html')
    //         }
    //     },
    //     commonjsOptions: {
    //         include: [
    //             /cookie/,
    //             /lodash/,
    //             /open-collaboration-protocol/,
    //             /open-collaboration-yjs/,
    //             /base64-js/,
    //             /vscode-languageclient/,
    //             /vscode-jsonrpc/,
    //             /vscode-languageserver-protocol/
    //         ],
    //     }
    // },
    // optimizeDeps: {
    //     esbuildOptions: {
    //         plugins: [
    //             importMetaUrlPlugin,
    //         ]
    //     },
    //     include: [
    //         'open-collaboration-protocol',
    //         'open-collaboration-yjs'
    //     ]
    // }
