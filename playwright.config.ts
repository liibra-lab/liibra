import { defineConfig } from '@playwright/test';

// Smoke tests run against the built Worker in the real Workers runtime
// (`wrangler dev`), not the Vite dev server: what gets smoke-tested is what
// deploys. Run `npm run build` first, then `npm run test:e2e`.
export default defineConfig({
	testDir: 'e2e',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 1 : 0,
	reporter: process.env.CI ? [['list'], ['github']] : 'list',
	use: {
		baseURL: 'http://127.0.0.1:4173',
		// Sandboxes that block browser downloads can point at a preinstalled
		// Chromium (e.g. /opt/pw-browsers/chromium in Claude Code on the web).
		// CI and normal dev machines leave this unset and use the managed browser.
		...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE
			? { launchOptions: { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE } }
			: {})
	},
	webServer: {
		command: 'npm run preview',
		url: 'http://127.0.0.1:4173',
		reuseExistingServer: !process.env.CI,
		timeout: 120_000
	}
});
