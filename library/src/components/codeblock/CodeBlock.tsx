import { common, createLowlight } from "lowlight"
import { Fragment, jsx, jsxs } from "react/jsx-runtime"
import { toJsxRuntime } from "hast-util-to-jsx-runtime"
import { memo } from "react"

import "./theme.scss"

/**
 * @typedef {import('hast').Root} Root
 *
 * @typedef {import('lowlight')}
 */

const lowLight = createLowlight(common)

function CodeBlock({
	children,
	language,
}: {
	/* children is the code to be rendered */
	children: string
	/* language is the language of the code */
	language?: string
}) {
	const ast = language
		? lowLight.highlight(language, children)
		: lowLight.highlightAuto(children)

	const jsxTree = toJsxRuntime(ast, { Fragment, jsx, jsxs })

	return (
		<pre className="overflow-auto bg-neutral p-2 border-l-4 border-l-solid border-l-neutral-pressed">
			{jsxTree}
		</pre>
	)
}

const memoizedCodeBlock = memo(CodeBlock)
export { memoizedCodeBlock as CodeBlock }
