import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import sveltePreprocess from 'svelte-preprocess';
import tspaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [svelte({ preprocess: sveltePreprocess() }), tspaths()],
});
