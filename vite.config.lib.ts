import { defineConfig } from "vite"
import { resolve } from "node:path"
import react from "@vitejs/plugin-react-swc"
//import nodePolyfills from "rollup-plugin-polyfill-node"
import pkg from "./package.json"

import { classPrefixerPlugin } from "./rollup-class-prefixer-plugin"

// postcss:
import tailwindcss from "tailwindcss"
import autoprefixer from "autoprefixer"
//

// list of problematic classes in WP Viewport Theme
const classesToPrefix = ["sticky"]
const prefix = "lp-"
//

// check if we want to use tailwind config with important = true
const twUseImportant = process.env.TAILWIND_IMPORTANT === "true"
const twConfig = twUseImportant
	? "./tailwind.config.lib.important.js"
	: "./tailwind.config.lib.js"

//

export default defineConfig({
	css: {
		postcss: {
			plugins: [
				tailwindcss(twConfig),
				autoprefixer,
				/*postcssClassPrefixerPlugin({
					prefix,
					classes: classesToPrefix,
				}),*/
			],
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
			preserveEntrySignatures: "strict",
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
				assetFileNames: (chunkInfo) => {
					if (chunkInfo.name === "tailwind.css" && twUseImportant) {
						return "[name]-important[extname]"
					}
					return "[name][extname]"
				},
			},
			external: [...Object.keys(pkg.peerDependencies)],
			plugins: [
				classPrefixerPlugin({
					prefix, // this is the prefix that is added to the classes
					classes: classesToPrefix, // these are the classes that are prefixed
				}),
			],
		},
	},
	plugins: [
		/*dts({
			entryRoot: resolve(__dirname, "library/src"),
			insertTypesEntry: true,
			tsconfigPath: resolve(__dirname, "tsconfig.lib.json"),
		}),*/
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
