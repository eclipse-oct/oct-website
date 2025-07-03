//@ts-check
import * as esbuild from 'esbuild';

const bundleWorker = async () => {
    await esbuild.build({
        entryPoints: ['../node_modules/monaco-editor/esm/vs/editor/editor.worker.js'],
        bundle: true,
        treeShaking: true,
        minify: true,
        format: 'esm',
        allowOverwrite: true,
        logLevel: 'info',
        outfile: './dist/assets/editor.worker.js'
    });
};

const bundlePlayground = async () => {
    await esbuild.build({
        entryPoints: ['src/index.tsx'],
        outdir: 'dist/assets',
        bundle: true,
        target: "ESNext",
        format: 'esm',
        loader: {
            '.svg': 'file',
            '.png': 'file',
            '.ttf': 'file'
        },
        external: ['/assets/header-background.webp'],
        platform: 'browser',
        sourcemap: false,
        minify: true,
        logLevel: 'info'
    });
};

await bundlePlayground();
await bundleWorker();
