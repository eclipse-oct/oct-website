//@ts-check
import * as esbuild from 'esbuild';

const bundleWorker = async (input, outfile) => {
    await esbuild.build({
        entryPoints: [input],
        bundle: true,
        treeShaking: true,
        minify: true,
        format: 'esm',
        allowOverwrite: true,
        logLevel: 'info',
        outfile
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
await bundleWorker('../node_modules/monaco-editor/esm/vs/editor/editor.worker.js', './dist/assets/editor.worker.js');
await bundleWorker('../node_modules/@codingame/monaco-vscode-standalone-css-language-features/worker.js', './dist/assets/css.worker.js');
await bundleWorker('../node_modules/@codingame/monaco-vscode-standalone-html-language-features/worker.js', './dist/assets/html.worker.js');
await bundleWorker('../node_modules/@codingame/monaco-vscode-standalone-json-language-features/worker.js', './dist/assets/json.worker.js');
await bundleWorker('../node_modules/@codingame/monaco-vscode-standalone-typescript-language-features/worker.js', './dist/assets/ts.worker.js');
