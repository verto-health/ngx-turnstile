/// <reference types="vitest" />
import { resolve } from 'path';
import { defineConfig } from 'vite';

import angular from '@analogjs/vite-plugin-angular';

export default defineConfig(() => ({
  plugins: [
    angular({
      tsconfig: resolve(__dirname, 'projects/ngx-turnstile/tsconfig.spec.json'),
    }),
  ],
  test: {
    globals: true,
    setupFiles: [
      resolve(__dirname, 'projects/ngx-turnstile/src/test-setup.ts'),
    ],
    environment: 'jsdom',
    include: ['src/**/*.spec.ts', 'projects/ngx-turnstile/src/**/*.spec.ts'],
    reporters: ['default'],
  },
}));
