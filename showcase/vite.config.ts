import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
	plugins: [react()],
	define: {
		"process.env": {}, // this is necessary because form.js in @atlaskit uses process.env.NODE_ENV
	},
	server: {
		port: 3000,
		watch: {
			// unforunately this is currently broken because of a chokidar bug, see
			// https://github.com/vitejs/vite/issues/8619
			// but this should rebundle the app when the ui-kit-ts package changes
			// in combination with optimizeDeps.force: true
			ignored: ["!**/node_modules/@linked-planet/ui-kit-ts/**"],
		},
	},
	optimizeDeps: {
		//force: true,
		exclude: ["@linked-planet/ui-kit-ts"],
	},
})
