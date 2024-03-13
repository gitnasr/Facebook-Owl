import { crx } from '@crxjs/vite-plugin'
import { defineConfig } from 'vite'
import dynamicImport from 'vite-plugin-dynamic-import'
import manifest from './src/manifest'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	return {
		build: {
			emptyOutDir: true,
			outDir: 'build',
			rollupOptions: {
				output: {
					chunkFileNames: 'assets/chunk-[hash].js',
				},
			},
		},

		plugins: [crx({ manifest }), react(), dynamicImport(/* options */)],
	}
})
