import { XIcon } from "lucide-react"
import type React from "react"
import {
	type CSSProperties,
	createElement,
	useCallback,
	useMemo,
	useState,
} from "react"
import { twJoin, twMerge } from "tailwind-merge"
import type { Appearance } from "../utils/appearanceTypes"

export const TagColorOptions = [
	"blue",
	"blueLight",
	"blueBold",
	"sky",
	"skyLight",
	"skyBold",
	"emerald",
	"emeraldLight",
	"emeraldBold",
	"red",
	"redLight",
	"redBold",
	"orange",
	"orangeLight",
	"orangeBold",
	"amber",
	"amberLight",
	"amberBold",
	"yellow",
	"yellowLight",
	"yellowBold",
	"green",
	"greenLight",
	"greenBold",
	"purple",
	"purpleLight",
	"purpleBold",
	"violet",
	"violetLight",
	"violetBold",
	"cyan",
	"cyanLight",
	"cyanBold",
	"lime",
	"limeLight",
	"limeBold",
	"pink",
	"pinkLight",
	"pinkBold",
	"indigo",
	"indigoLight",
	"indigoBold",
	"fuchsia",
	"fuchsiaLight",
	"fuchsiaBold",
	"teal",
	"tealLight",
	"tealBold",
	"gray",
	"grayLight",
	"grayBold",
] as const

export type TagColor = (typeof TagColorOptions)[number]

export type SimpleTagProps = {
	children: React.ReactNode
	looks?: "default" | "rounded"
	appearance?: Appearance | TagColor
	bold?: boolean
	style?: CSSProperties
	className?: string
	title?: string
	id?: string
	testId?: string
	truncate?: boolean
	onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
	onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void
	onKeyUp?: (e: React.KeyboardEvent<HTMLDivElement>) => void
	onMouseDown?: (e: React.MouseEvent<HTMLDivElement>) => void
	onMouseUp?: (e: React.MouseEvent<HTMLDivElement>) => void
	onMouseEnter?: (e: React.MouseEvent<HTMLDivElement>) => void
	onMouseLeave?: (e: React.MouseEvent<HTMLDivElement>) => void
	onMouseOver?: (e: React.MouseEvent<HTMLDivElement>) => void
	onMouseOut?: (e: React.MouseEvent<HTMLDivElement>) => void
	onFocus?: (e: React.FocusEvent<HTMLDivElement>) => void
	onBlur?: (e: React.FocusEvent<HTMLDivElement>) => void
	asElement?: "div" | "span" | "li" | "button" | "a" | "p"
}

const TagAppearanceColors: { [style in Appearance]: string } = {
	brand: "bg-brand-bold text-text-inverse",
	default: "bg-neutral text-text",
	success: "bg-success-bold text-text-inverse",
	information: "bg-information-bold text-text-inverse",
	discovery: "bg-information-bold text-text-inverse",
	danger: "bg-danger-bold text-text-inverse",
	warning: "bg-warning-bold text-text-inverse",
} as const

const TagColors: { [style in TagColor]: string } = {
	blue: "bg-blue text-blue-text-bold",
	blueLight: "bg-blue-subtle text-blue-text",
	blueBold: "bg-blue-bold text-text-inverse",
	sky: "bg-sky text-sky-text-bold",
	skyLight: "bg-sky-subtle text-sky-text",
	skyBold: "bg-sky-bold text-text-inverse",
	green: "bg-green text-green-text-bold",
	greenLight: "bg-green-subtle text-green-text",
	greenBold: "bg-green-bold text-text-inverse",
	purple: "bg-purple text-purple-text-bold",
	purpleLight: "bg-purple-subtle text-purple-text",
	purpleBold: "bg-purple-bold text-text-inverse",
	red: "bg-red text-red-text-bold",
	redLight: "bg-red-subtle text-red-text",
	redBold: "bg-red-bold text-text-inverse",
	teal: "bg-teal text-teal-text-bold",
	tealLight: "bg-teal-subtle text-teal-text",
	tealBold: "bg-teal-bold text-text-inverse",
	yellow: "bg-yellow text-yellow-text-bold",
	yellowLight: "bg-yellow-subtle text-yellow-text",
	yellowBold: "bg-yellow-bold text-text-inverse",
	lime: "bg-lime text-lime-text-bold",
	limeLight: "bg-lime-subtle text-lime-text",
	limeBold: "bg-lime-bold text-text-inverse",
	pink: "bg-pink text-pink-text-bold",
	pinkLight: "bg-pink-subtle text-pink-text",
	pinkBold: "bg-pink-bold text-text-inverse",
	orange: "bg-orange text-orange-text-bold",
	orangeLight: "bg-orange-subtle text-orange-text",
	orangeBold: "bg-orange-bold text-text-inverse",
	gray: "bg-gray text-gray-text-bold",
	grayLight: "bg-gray-subtle text-gray-text",
	grayBold: "bg-gray-bold text-text-inverse",
	fuchsia: "bg-fuchsia text-fuchsia-text-bold",
	fuchsiaLight: "bg-fuchsia-subtle text-fuchsia-text",
	fuchsiaBold: "bg-fuchsia-bold text-text-inverse",
	indigo: "bg-indigo text-indigo-text-bold",
	indigoLight: "bg-indigo-subtle text-indigo-text",
	indigoBold: "bg-indigo-bold text-text-inverse",
	cyan: "bg-cyan text-cyan-text-bold",
	cyanLight: "bg-cyan-subtle text-cyan-text",
	cyanBold: "bg-cyan-bold text-text-inverse",
	violet: "bg-violet text-violet-text-bold",
	violetLight: "bg-violet-subtle text-violet-text",
	violetBold: "bg-violet-bold text-text-inverse",
	amber: "bg-amber text-amber-text-bold",
	amberLight: "bg-amber-subtle text-amber-text",
	amberBold: "bg-amber-bold text-text-inverse",
	emerald: "bg-emerald text-emerald-text-bold",
	emeraldLight: "bg-emerald-subtle text-emerald-text",
	emeraldBold: "bg-emerald-bold text-text-inverse",
} as const

function isColorOption(color: Appearance | TagColor): color is TagColor {
	return TagColorOptions.includes(color as TagColor)
}

function SimpleTag({
	children,
	appearance = "default",
	looks = "default",
	bold = false,
	title,
	style,
	className,
	id,
	truncate,
	onClick,
	onKeyDown,
	onKeyUp,
	onMouseDown,
	onMouseUp,
	onMouseEnter,
	onMouseLeave,
	onMouseOver,
	onMouseOut,
	onFocus,
	onBlur,
	asElement = "div",
}: SimpleTagProps) {
	const colors = isColorOption(appearance)
		? TagColors[appearance]
		: TagAppearanceColors[appearance]

	const _children = truncate ? (
		<div
			className={
				"truncate w-full flex items-center justify-center-safe text-center"
			}
		>
			{children}
		</div>
	) : (
		children
	)

	return createElement(
		asElement,
		{
			className: twMerge(
				twJoin(
					colors,
					looks === "default" ? "rounded-[3px]" : "rounded-full",
					"box-border inline-flex max-w-max cursor-default select-none items-center whitespace-nowrap px-1 align-middle text-center text-sm",
					bold ? "font-bold" : undefined,
					truncate ? "overflow-hidden" : undefined,
					"inline-block",
				),
				className,
			),
			style,
			title,
			id,
			onClick,
			onKeyDown,
			onKeyUp,
			onMouseDown,
			onMouseUp,
			onMouseEnter,
			onMouseLeave,
			onMouseOver,
			onMouseOut,
			onFocus,
			onBlur,
			"data-component": "tag",
		},
		_children,
	)
}

export type TagProps = SimpleTagProps & {
	removable?: boolean
	onAfterRemoveAction?: (text: string | undefined) => void
	onBeforeRemoveAction?: () => boolean
	removeButtonLabel?: string
}

/**
 * onBeforeRemoveAction: return false to prevent removal
 */
export function Tag({
	children,
	removeButtonLabel,
	className,
	title,
	style,
	onAfterRemoveAction,
	onBeforeRemoveAction,
	removable,
	...simpleTagProps
}: TagProps) {
	const [removed, setRemoved] = useState(false)
	const [hovered, setHovered] = useState(false)

	const onClick = useCallback(() => {
		let removed = removable
		if (onBeforeRemoveAction) {
			removed = onBeforeRemoveAction()
		}
		setRemoved(removed ?? false)
		if (removed && onAfterRemoveAction) {
			const txt = typeof children === "string" ? children : undefined
			onAfterRemoveAction(txt)
		}
	}, [children, removable, onAfterRemoveAction, onBeforeRemoveAction])

	const textWithRemoveButton = useMemo(() => {
		if (!removable) {
			return children
		}
		return (
			<div className="flex items-center justify-between w-full overflow-hidden">
				<div className="truncate">{children}</div>

				<button
					type="button"
					onClick={onClick}
					onKeyUp={(e) => {
						if (e.key === "Enter") {
							onClick()
						}
					}}
					className={`m-0 ml-0.5 p-0 flex size-4 flex-none items-center justify-center-safe border-transparent text-inherit bg-transparent hover:cursor-pointer text-center ${
						!removable ? "hidden" : ""
					}`}
					aria-label={removeButtonLabel}
					data-component="tag-remove-button"
					title={removeButtonLabel ?? "Remove tag"}
					onMouseOver={() => setHovered(true)}
					onFocus={() => setHovered(true)}
					onMouseLeave={() => setHovered(false)}
				>
					<XIcon size="10" strokeWidth={3} />
				</button>
			</div>
		)
	}, [removable, removeButtonLabel, children, onClick])

	let classNameUsed = hovered
		? `bg-danger text-danger-text ${removable ? "pr-0" : "px-1"}`
		: `${removable ? "pr-0" : "px-1"}`

	classNameUsed = useMemo(
		() => twMerge(classNameUsed, className),
		[classNameUsed, className],
	)

	const styleUsed = hovered
		? { backgroundColor: undefined, textColor: undefined, ...style }
		: style

	const _title =
		title || (typeof children === "string" ? children : undefined)

	return (
		<>
			{!removed && (
				<SimpleTag
					className={classNameUsed}
					style={styleUsed}
					title={_title}
					{...simpleTagProps}
				>
					{textWithRemoveButton}
				</SimpleTag>
			)}
		</>
	)
}

export function TagGroup({
	className,
	style,
	children,
	alignment = "start",
	id,
	testId,
	wrap = false,
	asElement = "div",
}: {
	className?: string
	style?: CSSProperties
	children: React.ReactNode
	alignment?: "start" | "end"
	id?: string
	testId?: string
	wrap?: boolean
	asElement?: "div" | "ol" | "ul"
}) {
	return createElement(
		asElement,
		{
			className: twMerge(
				`flex w-full ${
					wrap ? "flex-wrap" : ""
				} items-center gap-1.5 py-0.5 ${
					alignment === "start" ? "justify-start" : "justify-end"
				}`,
				className,
			),
			style,
			id,
			"data-testid": testId,
		},
		children,
	)
}
