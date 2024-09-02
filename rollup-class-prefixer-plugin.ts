import generate from "@babel/generator"
import { default as traverse } from "@babel/traverse"
import { parse } from "@babel/parser"

import * as t from "@babel/types"
import type { OutputAsset, Plugin } from "rollup"
import postcss from "postcss"
import { existsSync } from "node:fs"
import fs from "node:fs/promises"

let classPrefix = ""
let classesToBePrefix: string[] = []
let jsFilePostfixes: string[] = []

//JS:
let classesToPrefixRegexJS: RegExp

//CSS:
let classesToPrefixRegexCSS: RegExp

// the css prefixing is done by postcss
async function prefixCSS(code: string, fileName: string) {
	const pcssPrefixerPlugin: postcss.Plugin = {
		postcssPlugin: "css-class-prefixer",
		Rule: (rule) => {
			rule.selectors = rule.selectors.map((selector) => {
				return selector.replace(classesToPrefixRegexCSS, (match) => {
					return `.${classPrefix}${match.substring(1)}`
				})
			})
		},
	}

	const processor = postcss([pcssPrefixerPlugin])
	const result = (await processor.process(code)).content
	return result
}

/**
 * Uses a regex to prefix the classes inside className or class strings
 */
async function prefixJSX(code: string, fileName: string) {
	let replacements = 0

	const prefixFunc = (stringVal: string, shouldCount = true) => {
		let _replacements = 0
		const replaced = stringVal.replace(classesToPrefixRegexJS, (match) => {
			_replacements++
			return `${classPrefix}${match}`
		})
		if (_replacements) {
			if (shouldCount) {
				replacements += _replacements
			}
			return replaced
		}
		return stringVal
	}

	const ast = parse(code, {
		sourceType: "module",
		plugins: ["jsx", "typescript"],
	})

	traverse.default(ast, {
		JSXAttribute(path) {
			if (t.isJSXIdentifier(path.node.name, { name: "className" })) {
				const classNameValueNode = path.node.value
				if (t.isStringLiteral(classNameValueNode)) {
					const stringVal = classNameValueNode.value
					const prefixedValue = prefixFunc(stringVal)
					path.node.value = t.stringLiteral(prefixedValue)
				} else if (t.isJSXExpressionContainer(classNameValueNode)) {
					const expressionContainer = classNameValueNode.expression
					if (t.isStringLiteral(expressionContainer)) {
						const stringVal = expressionContainer.value
						const prefixedValue = prefixFunc(stringVal)
						expressionContainer.value = prefixedValue
					} else if (t.isTemplateLiteral(expressionContainer)) {
						for (const expression of expressionContainer.expressions) {
							if (t.isStringLiteral(expression)) {
								const stringVal = expression.value
								const prefixedValue = prefixFunc(stringVal)
								expression.value = prefixedValue
							}
						}
						for (const element of expressionContainer.quasis) {
							const stringVal = element.value.raw
							const prefixedValue = prefixFunc(stringVal)
							element.value.raw = prefixedValue

							const cstringVal = element.value.cooked
							if (cstringVal) {
								const cprefixedValue = prefixFunc(
									cstringVal,
									false,
								)
								element.value.cooked = cprefixedValue
							}
						}
					}
				}
			}
		},
		// Handle TypeScript properties like `this.className = 'some-class'`
		ClassProperty(path) {
			if (t.isIdentifier(path.node.key, { name: "className" })) {
				if (t.isStringLiteral(path.node.value)) {
					const prefixedValue = prefixFunc(path.node.value.value)
					path.node.value = t.stringLiteral(prefixedValue)
				}
			}
			if (t.isIdentifier(path.node.key, { name: "class" })) {
				if (t.isStringLiteral(path.node.value)) {
					const prefixedValue = prefixFunc(path.node.value.value)
					path.node.value = t.stringLiteral(prefixedValue)
				}
			}
		},
	})

	const updatedCode = generate.default(ast).code as string
	if (replacements) {
		console.log(
			"\x1b[33m%s\x1b[0m",
			`\n[rollup-plugin-class-prefixer] - Prefixed ${replacements} classes: ${fileName}`,
		)
	}

	return { code: updatedCode, replacements }
}

/**
 * Rollup plugin that prefixes the classes in the JS(X) and TS(X) files.
 */
export function classPrefixerPlugin({
	prefix,
	classes,
	jsFiles = ["js", "jsx", "ts", "tsx"],
	cssFiles = ["css", "scss"],
}: {
	prefix: string
	classes: string[]
	jsFiles?: string[]
	cssFiles?: string[]
}) {
	classPrefix = prefix
	classesToBePrefix = classes
	jsFilePostfixes = jsFiles
	classesToPrefixRegexJS = new RegExp(
		`\b(${classesToBePrefix.join("|")})\b`,
		"g",
	)
	classesToPrefixRegexCSS = new RegExp(
		`\\.(${classesToBePrefix.join("|")})(?![a-zA-Z0-9_-])`,
		"g",
	)
	const ret: Plugin = {
		name: "class-prefixer-plugin",
		// prefixes .js, .ts, .tsx, .jsx files in the load step, but tailwindcss has not build yet the classes at this point
		async load(id) {
			if (!existsSync(id)) {
				return null
			}

			const ext = id.split(".").pop()
			if (ext && jsFilePostfixes.includes(ext)) {
				const data = await fs.readFile(id, "utf-8")
				const { code } = await prefixJSX(data, id)
				return code
			}

			return null
		},

		// this prefixes the css files in the generateBundle step
		async generateBundle(options, bundle) {
			for (const fileName of Object.keys(bundle)) {
				const fileEnd = fileName.split(".").pop()
				if (fileEnd && cssFiles.includes(fileEnd)) {
					const asset = bundle[fileName] as OutputAsset
					const code = asset.source as string
					const prefixed = await prefixCSS(code, fileName)
					asset.source = prefixed
				}
			}
		},
	}
	return ret
}
