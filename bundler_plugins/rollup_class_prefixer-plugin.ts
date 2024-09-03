import generate from "@babel/generator"
import { parse } from "@babel/parser"
import { default as traverse } from "@babel/traverse"

import { existsSync } from "node:fs"
import fs from "node:fs/promises"
import * as t from "@babel/types"
import postcss from "postcss"
import type { OutputAsset, Plugin } from "rollup"

let classPrefix = ""
let classesToBePrefix: string[] = []
let jsFilePostfixes: string[] = []

//JS:
let classesToPrefixRegexJS: RegExp

//CSS:
let classesToPrefixRegexCSS: RegExp

const bgenerate = generate.default
const btraverse = traverse.default

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

// Helper function to handle both JSX and plain class attributes
function handleClassNameValue(classNameValueNode, prefixFunc) {
	if (t.isStringLiteral(classNameValueNode)) {
		const stringVal = classNameValueNode.value
		const prefixedValue = prefixFunc(stringVal)
		classNameValueNode.value = prefixedValue
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
					const cprefixedValue = prefixFunc(cstringVal, false)
					element.value.cooked = cprefixedValue
				}
			}
		}
	}
}

// Does the actual prefixing
let replacements = 0
const prefixFunc = (stringVal: string, shouldCount = true) => {
	classesToPrefixRegexJS.lastIndex = 0
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

// Helper function to handle TemplateLiteral nodes
function handleTemplateLiteral(templateLiteralNode) {
	for (const expression of templateLiteralNode.expressions) {
		if (t.isStringLiteral(expression)) {
			const stringVal = expression.value
			const prefixedValue = prefixFunc(stringVal)
			expression.value = prefixedValue
		}
	}
	for (const element of templateLiteralNode.quasis) {
		const stringVal = element.value.raw
		const prefixedValue = prefixFunc(stringVal)
		element.value.raw = prefixedValue

		const cstringVal = element.value.cooked
		if (cstringVal) {
			const cprefixedValue = prefixFunc(cstringVal, false)
			element.value.cooked = cprefixedValue
		}
	}
}

/**
 * Uses a regex to prefix the classes inside className or class strings
 */
async function prefixJSX(code: string, fileName: string) {
	const ast = parse(code, {
		sourceType: "module",
		plugins: ["jsx", "typescript"],
	})

	btraverse(ast, {
		JSXAttribute(path) {
			if (t.isJSXIdentifier(path.node.name, { name: "className" })) {
				const classNameValueNode: t.Node = path.node.value
				handleClassNameValue(classNameValueNode, prefixFunc)
			}
		},
		ObjectProperty(path) {
			if (
				t.isIdentifier(path.node.key, { name: "className" }) ||
				t.isIdentifier(path.node.key, { name: "class" })
			) {
				if (t.isStringLiteral(path.node.value)) {
					const prefixedValue = prefixFunc(path.node.value.value)
					path.node.value = t.stringLiteral(prefixedValue)
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

		// Handle JSX attributes in the transpiled React.createElement calls
		CallExpression(path) {
			const callee = path.get("callee")
			// Check if it's a call to jsxRuntimeExports.jsx or jsxRuntimeExports.jsxs
			if (
				callee.isMemberExpression() &&
				t.isIdentifier(callee.node.object, {
					name: "jsxRuntimeExports",
				}) &&
				(t.isIdentifier(callee.node.property, { name: "jsx" }) ||
					t.isIdentifier(callee.node.property, { name: "jsxs" }))
			) {
				const args = path.get("arguments")
				if (args.length > 1) {
					const props = args[1]
					if (props.isObjectExpression()) {
						// biome-ignore lint/complexity/noForEach: <explanation>
						props.get("properties").forEach((propPath) => {
							if (t.isObjectProperty(propPath.node)) {
								const key = propPath.get("key")
								if (key.isIdentifier({ name: "className" })) {
									const value = propPath.get("value")
									if (value.isStringLiteral()) {
										const stringVal = value.node.value
										const prefixedValue =
											prefixFunc(stringVal)
										value.replaceWith(
											t.stringLiteral(prefixedValue),
										)
									} else if (value.isTemplateLiteral()) {
										handleTemplateLiteral(value.node)
									}
								}
							}
						})
					}
				}
			}

			// handle React.createElement calls - untested
			if (
				callee.isIdentifier({ name: "React" }) ||
				callee.isIdentifier({ name: "createElement" })
			) {
				const args = path.get("arguments")
				if (args.length > 1) {
					const props = args[1] // props is the second argument
					if (props.isObjectExpression()) {
						// biome-ignore lint/complexity/noForEach: <explanation>
						props.get("properties").forEach((propPath) => {
							if (t.isObjectProperty(propPath.node)) {
								const key = propPath.get("key")
								if (
									key.isIdentifier({ name: "className" }) ||
									key.isIdentifier({ name: "class" })
								) {
									const value = propPath.get("value")
									if (value.isStringLiteral()) {
										const stringVal = value.node.value
										const prefixedValue =
											prefixFunc(stringVal)
										value.replaceWith(
											t.stringLiteral(prefixedValue),
										)
									} else if (value.isTemplateLiteral()) {
										handleTemplateLiteral(value.node)
									}
								}
							}
						})
					}
				}
			}
		},
	})

	const updatedCode = bgenerate(ast).code as string
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
export default function classPrefixerPlugin({
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
		`\\b(${classesToBePrefix.join("|")})\\b`,
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

			replacements = 0

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
