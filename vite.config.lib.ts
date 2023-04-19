import { defineConfig } from "vite"
import { resolve } from "path"
import react from "@vitejs/plugin-react-swc"
import dts from "vite-plugin-dts"

export default defineConfig({
	build: {
		//minify: false,
		outDir: "dist",
		emptyOutDir: false, // without this, the typescript declaration files are going to get deleted, and not recreated when I don't have a change in the types.
		sourcemap: true,
		lib: {
			entry: resolve(__dirname, "library/src/index.ts"),
			name: "@linked-planet/ui-kit-ts",
			fileName: (format) => `ui-kit.${format}.js`,
			formats: ["es", "umd"],
		},
		rollupOptions: {
			external: ["react", "react-dom"],
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
		react(/*{
			// this is for emotion (need to test if it's still needed)
			jsxImportSource: "@emotion/react",
			babel: {
				plugins: ["@emotion/babel-plugin"],
			},
		}*/),
	],
})
