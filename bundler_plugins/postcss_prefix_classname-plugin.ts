import type postcss from "postcss"

// this is a postcss plugin that prefixes the classes in the css files
export function postcssClassPrefixerPlugin({
	prefix,
	classes,
}: {
	prefix: string
	classes: string[]
}) {
	const classesToPrefixRegex = new RegExp(`(${classes.join("|")})`, "g")
	const ret: postcss.Plugin = {
		postcssPlugin: "css-class-prefixer",
		Rule: (rule) => {
			rule.selectors = rule.selectors.map((selector) => {
				return selector.replace(classesToPrefixRegex, (match) => {
					return `${prefix}${match}`
				})
			})
		},
	}
	return ret
}
