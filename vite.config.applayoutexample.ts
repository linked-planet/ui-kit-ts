import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import { resolve } from "node:path"

// postcss:
import tailwindcss from "tailwindcss"
import autoprefixer from "autoprefixer"
//

export default defineConfig({
	css: {
		postcss: {
			plugins: [tailwindcss("./tailwind.config.sc.js"), autoprefixer],
		},
	},
	build: {
		outDir: resolve(__dirname, "./dist-applayoutexample"),
		target: "es2022",
		rollupOptions: {
			//plugins: [nodePolyfills()],
		},
	},
	resolve: {
		alias: {
			"@linked-planet/ui-kit-ts": resolve(__dirname, "./library/src"),
		},
	},
	base: "/applayoutexample",
	root: "./applayoutexample",
	plugins: [react()],
	server: {
		port: 3001,
	},
})