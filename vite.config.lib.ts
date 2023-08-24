import { defineConfig } from "vite"
import { resolve } from "path"
import react from "@vitejs/plugin-react-swc"
import dts from "vite-plugin-dts"
//import nodePolyfills from "rollup-plugin-polyfill-node"

export default defineConfig({
	build: {
		//minify: false,
		outDir: "dist",
		emptyOutDir: false, // without this, the typescript declaration files are going to get deleted, and not recreated when I don't have a change in the types.
		sourcemap: true,
		target: "es2022",
		lib: {
			entry: resolve(__dirname, "library/src/index.ts"),
			name: "@linked-planet/ui-kit-ts",
			fileName: (format) => `ui-kit.${format}.js`,
			formats: ["es"],
		},

		rollupOptions: {
			//plugins: [nodePolyfills()],
			external: [
				"react",
				"react-dom",
				"@atlaskit/atlassian-navigation",
				"@atlaskit/avatar",
				"@atlaskit/badge",
				"@atlaskit/banner",
				"@atlaskit/button",
				"@atlaskit/calendar",
				"@atlaskit/checkbox",
				"@atlaskit/code",
				"@atlaskit/css-reset",
				"@atlaskit/datetime-picker",
				"@atlaskit/dropdown-menu",
				"@atlaskit/dynamic-table",
				"@atlaskit/empty-state",
				"@atlaskit/flag",
				"@atlaskit/form",
				"@atlaskit/icon",
				"@atlaskit/lozenge",
				"@atlaskit/menu",
				"@atlaskit/modal-dialog",
				"@atlaskit/page-layout",
				"@atlaskit/pagination",
				"@atlaskit/panel",
				"@atlaskit/popup",
				"@atlaskit/select",
				"@atlaskit/side-navigation",
				"@atlaskit/table-tree",
				"@atlaskit/tabs",
				"@atlaskit/tag",
				"@atlaskit/tag-group",
				"@atlaskit/textarea",
				"@atlaskit/textfield",
				"@atlaskit/toggle",
				"@atlaskit/token",
				"@emotion/styled",
				"@monaco-editor/react",
				"@reduxjs/toolkit",
			],
			output: {
				globals: {
					react: "React",
					"react-dom": "ReactDOM",
				},
			},
		},
	},
	plugins: [
		dts({
			entryRoot: resolve(__dirname, "library/src"),
			insertTypesEntry: true,
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
