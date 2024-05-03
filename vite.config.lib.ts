import { defineConfig } from "vite"
import { resolve } from "node:path"
import react from "@vitejs/plugin-react-swc"
import dts from "vite-plugin-dts"
//import nodePolyfills from "rollup-plugin-polyfill-node"
import pkg from "./package.json"

// postcss:
import tailwindcss from "tailwindcss"
import autoprefixer from "autoprefixer"
//

export default defineConfig({
	css: {
		postcss: {
			plugins: [tailwindcss("./tailwind.config.lib.js"), autoprefixer],
		},
	},
	build: {
		outDir: "dist",
		emptyOutDir: false, // without this, the typescript declaration files are going to get deleted, and not recreated when I don't have a change in the types.
		sourcemap: true,
		target: "es2022",
		minify: false,
		cssCodeSplit: true,
		// like this rollup is used for the library build, each file is its own module, and a css bundle is build as well
		lib: {
			entry: resolve(__dirname, "library/src/index.ts"),
			name: "@linked-planet/ui-kit-ts",
			formats: ["es"],
			fileName: (format, entryName) => {
				return `${entryName}.js`
			},
		},
		rollupOptions: {
			//input: "library/src/index.ts",
			// required that all the files keep their exports
			preserveEntrySignatures: "exports-only",
			output: {
				dir: "dist",
				format: "esm",
				preserveModules: true,
				preserveModulesRoot: "library/src",
				// this entryFileNames is important that each file is a module at the end
				/*entryFileNames: ({ name: fileName }) => {
					return `${fileName}.js`
				},*/
				globals: {
					react: "React",
					"react-dom": "ReactDOM",
				},
			},
			external: [...Object.keys(pkg.peerDependencies)],
			//plugins: [nodePolyfills()],
		},
	},
	plugins: [
		dts({
			entryRoot: resolve(__dirname, "library/src"),
			insertTypesEntry: true,
			tsconfigPath: resolve(__dirname, "tsconfig.lib.json"),
		}),
		react(),
		/*{
			// this is for emotion (need to test if it's still needed)
			jsxImportSource: "@emotion/react",
			babel: {
				plugins: ["@emotion/babel-plugin"],
			},
		}*/
	],
	define: {
		//"process.env": {}, // this is necessary because form.js in @atlaskit uses process.env.NODE_ENV
		//"process.env.NODE_ENV": {}, // this is necessary because form.js in @atlaskit uses process.env.NODE_ENV
		// Some libraries use the global object, even though it doesn't exist in the browser.
		// Alternatively, we could add `<script>window.global = window;</script>` to index.html.
		// https://github.com/vitejs/vite/discussions/5912
		//global: {},  -> this breaks @atlaskit/tokens build
	},
})
