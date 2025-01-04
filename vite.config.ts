import { defineConfig } from 'vite';
import viteTscPlugin from 'vite-plugin-tsc-transpile';
import dts from 'vite-plugin-dts';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs/promises';

export default defineConfig({
    build: {
        lib: {
            entry: [
                path.resolve(
                    path.dirname(fileURLToPath(import.meta.url)),
                    'src/default.ts'
                ),
                path.resolve(
                    path.dirname(fileURLToPath(import.meta.url)),
                    'src/node.ts'
                )
            ],
            formats: ['es', 'cjs'],
            fileName: (format, entryName) =>
                format === 'es' ? `${entryName}.mjs` : `${entryName}.cjs`
        },
        rollupOptions: {
            external: [
                'node:util',
                'node:child_process',
                'promisify-child-process',
                'node:path',
                'node:url'
            ]
        },
        sourcemap: true,
        minify: false
    },
    plugins: [
        viteTscPlugin(),
        dts({
            async afterBuild(emittedFiles) {
                for (const [filePath, content] of emittedFiles) {
                    if (filePath.endsWith('.d.ts')) {
                        const dMtsPath = filePath.replace(/\.d\.ts$/, '.d.mts');
                        const dCtsPath = filePath.replace(/\.d\.ts$/, '.d.cts');
                        await fs.writeFile(dMtsPath, content, 'utf-8');
                        await fs.writeFile(dCtsPath, content, 'utf-8');
                        await fs.unlink(filePath);
                    }
                }
            }
        })
    ]
});
