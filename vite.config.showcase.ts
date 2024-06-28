import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import { resolve } from "node:path"
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
		outDir: resolve(__dirname, "./dist-showcase"),
		target: "es2022",
		emptyOutDir: true,
		rollupOptions: {
			input: {
				main: resolve(__dirname, "./showcase/index.html"),
				applayoutexample: resolve(
					__dirname,
					"./showcase/applayoutexample/index.html",
				),
			},
		},
	},
	resolve: {
		alias: {
			"@linked-planet/ui-kit-ts": resolve(__dirname, "./library/src"),
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
	root: "./showcase",
	publicDir: "public",
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
