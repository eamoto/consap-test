import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig(({ mode }) => ({
    plugins: [svelte()],
    test: {
        globals: true,  // Enables global functions like `describe`, `it`, `expect`
        environment: 'jsdom',  // Required for DOM-related testing
        //setupFiles: './src/setupTest.ts',  // Optional: for global setup
        include: ['src/**/*.{test,spec}.{js,ts}'],  // Include test file patterns
        coverage: {
            provider: 'c8', // or 'v8'
            exclude: ['**/node_modules/**', '**/dist/**'],
        },
    },
    resolve: {
        conditions: mode === 'test' ? ['browser'] : [],
    },
}));