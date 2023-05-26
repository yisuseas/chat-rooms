import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

const options = {
	strictPort: true,
	port: 5173
};

export default defineConfig({
	plugins: [sveltekit()],
	server: options,
	preview: options,
	css: {
		preprocessorOptions: {
			scss: {
				additionalData:
					"@use '$lib/styles/variables' as *;\n" +
					"@use '$lib/styles/utils' as *;\n"
			}
		}
	}
});
