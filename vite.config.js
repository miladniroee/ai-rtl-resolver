import { defineConfig } from 'vite';

export default defineConfig({
  publicDir: 'public',

  build: {
    outDir: 'dist',
    emptyOutDir: true,

    rollupOptions: {
      input: {
        chatgpt: './src/chatgpt.js',
        deepseek: './src/deepseek.js',
        loadFonts: './src/loadFonts.js'
      },

      output: {
        entryFileNames: '[name].js'
      }
    }
  }
});