import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import path from "node:path"
//import checker from "vite-plugin-checker"

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
		outDir: "dist-showcase",
		target: "es2022",
		rollupOptions: {
			//plugins: [nodePolyfills()],
		},
	},
	resolve: {
		alias: {
			"@linked-planet/ui-kit-ts": path.resolve(
				__dirname,
				"./library/src",
			),
		},
	},
	define: {
		"process.env": {}, // this is necessary because form.js in @atlaskit uses process.env.NODE_ENV
		//"process.env.NODE_ENV": {}, // this is necessary because form.js in @atlaskit uses process.env.NODE_ENV
		// Some libraries use the global object, even though it doesn't exist in the browser.
		// Alternatively, we could add `<script>window.global = window;</script>` to index.html.
		// https://github.com/vitejs/vite/discussions/5912
		//global: {}, //-> this breaks @atlaskit/tokens build
	},
	base: "/ui-kit-ts",
	publicDir: "showcase/public",
	plugins: [
		react(),
		/*tsconfigPaths({
			configNames: ["./tsconfig.showcase.json"],
		}),*/
		//checker({ typescript: true }),
	],
	server: {
		port: 3000,
	},
})
