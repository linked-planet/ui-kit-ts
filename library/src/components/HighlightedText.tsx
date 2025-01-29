import { useMemo } from "react"
import { twMerge } from "tailwind-merge"
export function HighlightedText({
	text,
	highlightedText,
	className,
	highlightClassName,
	style,
	containerElement,
}: {
	text: string
	highlightedText: string[] | string
	highlightClassName?: string
	className?: string
	style?: React.CSSProperties
	containerElement?: React.ElementType
}) {
	const parts = useMemo(() => {
		const highlights = Array.isArray(highlightedText)
			? highlightedText.map((it) => it.trim()).filter(Boolean)
			: [highlightedText.trim()]
		if (!highlights.length) return text
		const delimiterRegex = new RegExp(
			`(${highlights.map((it) => it.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
			"g",
		)
		return text.split(delimiterRegex).reduce((acc, it, i) => {
			if (highlights.includes(it)) {
				acc.push(
					<span
						key={i}
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
	}, [text, highlightClassName, highlightedText])

	const ContainerElement = containerElement || "p"

	return (
		<ContainerElement className={className} style={style}>
			{parts}
		</ContainerElement>
	)
}
