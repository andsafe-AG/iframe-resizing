import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.spec.ts', 'src/**/*.test.ts'],
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'IFrameResizing',
      formats: ['es', 'cjs', 'umd'],
      fileName: (format) => {
        if (format === 'es') return 'iframe-resizing.js';
        if (format === 'cjs') return 'iframe-resizing.cjs';
        if (format === 'umd') return 'iframe-resizing.umd.js';
        return `iframe-resizing.${format}.js`;
      },
    },
    rollupOptions: {
      output: {
        // Preserve export names
        exports: 'named',
      },
    },
    sourcemap: true,
    // Emit declaration files
    emptyOutDir: true,
  },
});
