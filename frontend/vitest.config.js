import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig(({ mode }) => ({
    plugins: [svelte()],
    test: {
        globals: true,  
        environment: 'jsdom',  
        include: ['src/**/*.{test,spec}.{js,ts}'],  
        css: false,                  // Ensures CSS is handled correctly in tests
    },
    resolve: {
        conditions: mode === 'test' ? ['browser'] : [],
    },
}));