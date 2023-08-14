import { defineConfig, splitVendorChunkPlugin } from "vite"
import react from "@vitejs/plugin-react-swc"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
	build: {
		outDir: "dist-showcase",
		target: "es2022",
	},
	define: {
		"process.env": {}, // this is necessary because form.js in @atlaskit uses process.env.NODE_ENV
	},
	base: "/ui-kit-ts",
	publicDir: "showcase/public",
	plugins: [react(), tsconfigPaths(), splitVendorChunkPlugin()],
	server: {
		port: 3000,
	},
})
