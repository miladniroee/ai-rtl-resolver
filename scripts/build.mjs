import { build } from 'vite';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

/** @type {readonly ['chatgpt', 'deepseek', 'claude', 'perplexity']} */
const entries = ['chatgpt', 'deepseek', 'claude', 'perplexity'];

for (let index = 0; index < entries.length; index += 1) {
  const name = entries[index];
  await build({
    root,
    publicDir: index === 0 ? 'public' : false,
    build: {
      outDir: 'dist',
      emptyOutDir: index === 0,
      lib: {
        entry: resolve(root, `src/entries/${name}.ts`),
        name: `AiRtlResolver_${name}`,
        formats: ['iife'],
        fileName: () => `${name}.js`,
      },
    },
  });
}
