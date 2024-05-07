import fs from "node:fs"
import type { Plugin as VPlugin } from "vite"

const cssClassRegex = /(\.)([^{;]+)({\B)/g
const classNameRegex = /className=["']([^"']+)["']/g

const classPrefix = "lp-"

const classesToPrefix = ["sticky"]

// give me a regexp that can match 2 classes when they are written like .c1.c2
//const classRegex = /(\.)([^{]+)(\s*{)/g

//const classRegex = /class(?:Name)?\s*[:=]?\s*["']([^"'\s]+)["']/g

function prefixCSS(code: string) {
	const regex = new RegExp(`(\\.)(${classesToPrefix.join("|")})\\b`, "g")
	return code.replace(regex, (match, prefix, classes, suffix) => {
		const prefixed = `${classPrefix}${classes}`
		console.info("Replacing", match, "with", prefixed)
		return match.replace(classes, prefixed)
	})
}

function prefixJS(code: string) {
	const regex = new RegExp(
		`(?<![\\w])(${classesToPrefix.join("|")})(?![\\S])\\b`,
		"g",
	)
	return code.replace(regex, (match, classes) => {
		const prefixed = `${classPrefix}${classes}`
		console.info("Replacing", match, "with", prefixed)
		const replaced = match.replace(classes, prefixed)
		return replaced
	})
}

// give me a regex that will match "sticky" but not "sticky"" or "sticky-"
//const stickyRegex = /sticky(?![\w-])/g

const writeBundle: VPlugin["writeBundle"] = (options, bundle) => {
	// test if file exists
	const outputDir = options.dir
	if (!outputDir) {
		console.info("No output directory found in options", options)
		return
	}
	for (const fileName in bundle) {
		if (
			fileName.startsWith("node_modules/") ||
			fileName.startsWith("_virtual/")
		) {
			continue
		}
		const file = bundle[fileName]
		const outputFileName = `${outputDir}/${fileName}`
		if (fs.existsSync(outputFileName)) {
			const code = fs.readFileSync(outputFileName, "utf-8")
			if (fileName.endsWith(".css") || fileName.endsWith(".scss")) {
				fs.writeFileSync(outputFileName, prefixCSS(code))
			}
			if (
				fileName.endsWith(".js") ||
				fileName.endsWith(".jsx") ||
				fileName.endsWith(".ts") ||
				fileName.endsWith(".tsx")
			) {
				fs.writeFileSync(outputFileName, prefixJS(code))
			}
		}
	}
}

export default function classPrefixerPlugin() {
	const ret: VPlugin = {
		name: "class-prefixer-plugin",
		writeBundle,
	}
	return ret
}
