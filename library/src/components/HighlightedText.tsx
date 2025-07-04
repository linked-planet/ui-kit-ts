import { useId, useMemo } from "react"
import { twMerge } from "tailwind-merge"
export function HighlightedText({
	text,
	highlightedText,
	className,
	highlightClassName,
	style,
	containerElement,
	caseSensitive,
}: {
	text: string
	highlightedText: string[] | string
	highlightClassName?: string
	className?: string
	style?: React.CSSProperties
	containerElement?: React.ElementType
	caseSensitive?: boolean
}) {
	const id = useId()
	const parts = useMemo(() => {
		const highlights = Array.isArray(highlightedText)
			? highlightedText.map((it) => it.trim()).filter(Boolean)
			: [highlightedText.trim()]
		if (!highlights.length) return text
		const delimiterRegex = new RegExp(
			`(${highlights.map((it) => it.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
			caseSensitive ? "g" : "gi",
		)
		console.log("Case sensitive:", delimiterRegex, highlightedText)
		return text.split(delimiterRegex).reduce((acc, it, i) => {
			if (delimiterRegex.test(it)) {
				acc.push(
					<span
						// biome-ignore lint/suspicious/noArrayIndexKey: the ith instance of the highlighted text
						key={`highlight-${id}-${i}`}
						className={twMerge(
							"bg-selected-bold text-text-inverse p-0 m-0",
							highlightClassName,
						)}
					>
						{it}
					</span>,
				)
				return acc
			}
			acc.push(it)
			return acc
		}, [] as React.ReactNode[])
	}, [text, highlightClassName, highlightedText, caseSensitive, id])

	const ContainerElement = containerElement || "p"

	return (
		<ContainerElement className={className} style={style}>
			{parts}
		</ContainerElement>
	)
}
