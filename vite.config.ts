import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

const options = {
	strictPort: true,
	port: 5173
};

export default defineConfig({
	plugins: [sveltekit()],
	server: options,
	preview: options
});
