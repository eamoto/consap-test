import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        coverage: {
            reporter: ["text"],
            exclude: [
                "src/index.ts",
                "vite.config.ts",
                "dist/**",
                "src/Tests/**",
            ]
        },
    }
});
