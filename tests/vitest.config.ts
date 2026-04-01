import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		environment: "jsdom",
		globals: true,
		isolate: true,
		setupFiles: ["./src/vitest.setup.ts"],
		include: ["tests/**/*.{test,spec}.{js,ts}"],
		exclude: [
			"**/node_modules/**",
			"**/dist/**",
			"**/.svelte-kit/**",
			"**/build/**",
		],
		coverage: {
			provider: "istanbul",
			enabled: false,
		},
	},
});
