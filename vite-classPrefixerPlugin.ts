import * as fs from "node:fs"
import type { Plugin as VPlugin } from "vite"

let classPrefix = ""
let classesToBePrefix: string[] = []
let doProcessJS = true
let doProcessCSS = true
let cssFilePostfixes: string[] = []
let jsFilePostfixes: string[] = []

/**
 * Uses a regex to prefix classes in a css/scss file
 */
function prefixCSS(code: string, fileName: string) {
	const regex = new RegExp(`(\\.)(${classesToBePrefix.join("|")})\\b`, "g")
	let counter = 0
	const ret = code.replace(regex, (match, prefix, classes, suffix) => {
		const prefixed = `${classPrefix}${classes}`
		//console.info("Replacing", match, "with", prefixed)
		counter++
		return match.replace(classes, prefixed)
	})
	if (counter) {
		console.log("Replaced", counter, "CSS classes in", fileName)
	}
	return ret
}

/**
 * Uses a regex to prefix the classes inside className or class strings
 */
function prefixJS(code: string, fileName: string) {
	const regex = new RegExp(
		`(?<=\\b(class(Name)?\\s*=\\s*['"][^'"]*))\\b(${classesToBePrefix.join(
			"|",
		)})\\b(?=[^'"]*['"])`,
		"g",
	)
	let counter = 0
	const ret = code.replace(regex, (match, classes) => {
		const prefixed = `${classPrefix}${classes}`
		//console.info("Replacing", match, "with", prefixed)
		counter++
		const replaced = match.replace(classes, prefixed)
		return replaced
	})
	if (counter) {
		console.log("Replaced", counter, "JS classes in", fileName)
	}
	return ret
}

// give me a regex that will match "sticky" but not "sticky"" or "sticky-"
//const stickyRegex = /sticky(?![\w-])/g

const writeBundle: VPlugin["writeBundle"] = (options, bundle) => {
	// test if file exists
	const outputDir = options.dir
	if (!outputDir) {
		console.error(
			"\x1b[31m%s\x1b[0m",
			"[vite-classPrefixerPlugin] - No output directory found in options",
			options,
		)
		return
	}
	console.log(
		"\x1b[32m%s\x1b[0m",
		"[vite-classPrefixerPlugin] - Prefixing classes...",
	)
	for (const fileName in bundle) {
		if (
			fileName.startsWith("node_modules/") ||
			fileName.startsWith("_virtual/")
		) {
			continue
		}
		const outputFileName = `${outputDir}/${fileName}`
		if (fs.existsSync(outputFileName)) {
			// get the file extension
			const extension = fileName.split(".").pop()
			if (
				doProcessJS &&
				extension &&
				jsFilePostfixes.includes(extension)
			) {
				const code = fs.readFileSync(outputFileName, "utf-8")
				fs.writeFileSync(outputFileName, prefixJS(code, fileName))
			}

			if (
				doProcessCSS &&
				extension &&
				cssFilePostfixes.includes(extension)
			) {
				const code = fs.readFileSync(outputFileName, "utf-8")
				fs.writeFileSync(outputFileName, prefixCSS(code, fileName))
			}
		}
	}
	console.log(
		"\x1b[32m%s\x1b[0m",
		"[vite-classPrefixerPlugin] - Done prefixing classes.",
		"color: green;",
	)
}

export default function classPrefixerPlugin({
	prefix,
	classes,
	processJS = true,
	processCSS = true,
	cssFiles = ["css", "scss"],
	jsFiles = ["js", "jsx", "ts", "tsx"],
}: {
	prefix: string
	classes: string[]
	processJS?: boolean
	processCSS?: boolean
	cssFiles?: string[]
	jsFiles?: string[]
}) {
	classPrefix = prefix
	classesToBePrefix = classes
	doProcessJS = processJS
	doProcessCSS = processCSS
	cssFilePostfixes = cssFiles
	jsFilePostfixes = jsFiles
	const ret: VPlugin = {
		name: "class-prefixer-plugin",
		writeBundle,
	}
	return ret
}
