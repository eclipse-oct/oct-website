//@ts-check
import * as esbuild from 'esbuild';

const ctx = await esbuild.context({
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
    platform: 'browser',
    sourcemap: false,
    minify: true,
    logLevel: 'info'
});

await ctx.rebuild();
ctx.dispose();
