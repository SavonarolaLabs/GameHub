// svelte.config.js
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const dev = process.argv.includes('dev');
const repo = 'GameHub';

export default /** @type {import('@sveltejs/kit').Config} */ ({
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			pages: 'docs', // <-- кладём сборку в /docs
			assets: 'docs',
			fallback: '404.html', // для GitHub Pages SPA
			precompress: false
		}),
		paths: {
			base: dev ? '' : `/${repo}` // важно для project pages
		},
		prerender: { entries: ['*'] }
	}
});
