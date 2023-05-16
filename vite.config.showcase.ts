import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
	build: {
		outDir: "dist-showcase",
	},
	define: {
		"process.env": {}, // this is necessary because form.js in @atlaskit uses process.env.NODE_ENV
	},
	publicDir: "showcase/public",
	plugins: [react(), tsconfigPaths()],
	server: {
		port: 3000,
	},
})
