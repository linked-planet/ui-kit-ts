import { defineConfig } from "vite"
import { resolve } from "path"
import react from "@vitejs/plugin-react"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
	build: {
		outDir: "dist-showcase",
		rollupOptions: {
			input: {
				main: resolve(__dirname, "./showcase/index.html"),
			},
		},
	},
	define: {
		"process.env": {}, // this is necessary because form.js in @atlaskit uses process.env.NODE_ENV
	},
	plugins: [react(), tsconfigPaths()],
	server: {
		port: 3000,
	},
})
