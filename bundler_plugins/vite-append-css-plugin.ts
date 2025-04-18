import type { Plugin } from "vite"
import { readFile } from "node:fs/promises"
import { extname } from "node:path"

export interface AppendCSSOptions {
	/** Path to external file to include */
	files: string[]
}

/**
 * Vite plugin that appends content of a specified file to all CSS assets in the bundle.
 * @param options - Plugin options containing the path to the extra file.
 * @returns Vite plugin object
 */
export default function viteAppendCssPlugin(options: AppendCSSOptions): Plugin {
	return {
		name: "append-css",
		enforce: "post",
		async generateBundle(_options, bundle) {
			for (const file of options.files) {
				const extra = await readFile(file, "utf-8")
				for (const [fileName, asset] of Object.entries(bundle)) {
					if (
						asset.type === "asset" &&
						extname(fileName) === ".css"
					) {
						const original = asset.source
						asset.source =
							typeof original === "string"
								? `${original}\n${extra}`
								: `${original.toString()}\n${extra}`
						console.log(
							"\x1b[33m%s\x1b[0m",
							`\n[append-css] - Appended ${file} to ${fileName}`,
						)
					}
				}
			}
		},
	}
}
