// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
	integrations: [react()],
	vite: {
		server: {
			host: '0.0.0.0',
			port: 4321,
			strictPort: true,
			allowedHosts: ['mtg.ddev.site', 'localhost', '127.0.0.1'],
		},
	},
});
