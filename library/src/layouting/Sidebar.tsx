import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import type React from "react"
import { type CSSProperties, type ElementRef, useRef, useState } from "react"
import { twMerge } from "tailwind-merge"
import { rateLimitHelper } from "../utils"
import { bannerHeightVar, topNavigationHeightVar } from "./AppLayout"

const _rateLimited = rateLimitHelper(15) //59fps

type CollapsedState = "collapsed" | "expanded"
type SidebarPosition = "left" | "right"

export const leftSidebarWidthVar = "--leftSidebarWidth" as const
const leftSidebarFlyoutVar = "--leftSidebarFlyoutWidth" as const
export const rightSidebarWidthVar = "--rightSidebarWidth" as const
const rightSidebarFlyoutVar = "--rightSidebarFlyoutWidth" as const

export type SidebarProps = {
	id?: string
	collapsed?: CollapsedState
	width?: number
	onCollapsed?: () => void
	onExpand?: () => void
	onResizeStart?: () => void
	onResizeEnd?: () => void
	onCloseButtonClick?: (nextState: CollapsedState) => void
	sticky?: boolean
	valueTextLabel?: string
	resizeGrabAreaLabel?: string
	className?: string
	style?: CSSProperties
	children: React.ReactNode
	closeButton?: React.ReactNode
	closeButtonClassName?: string
	closeButtonStyle?: CSSProperties
	closeButtonTitle?: string
	closeButtonAriaLabel?: string
	widthVar?: `--${string}`
	flyoutVar?: `--${string}`
	localStorageWidthKey?: string
	localStorageCollapsedKey?: string
}

type PropAdditionals = {
	position: SidebarPosition
}

export function LeftSidebar(props: SidebarProps) {
	return <Sidebar {...props} position="left" />
}

export function RightSidebar(props: SidebarProps) {
	return <Sidebar {...props} position="right" />
}

const localStorageKey_LeftSidebarWidth = "leftSidebarWidth"
const localStorageKey_RightSidebarWidth = "rightSidebarWidth"
export const localStorageKey_LeftSidebarCollapsed = "leftSidebarCollapsed"
const localStorageKey_RightSidebarCollapsed = "rightSidebarCollapsed"
const defaultWidth = 180 as const
const collapsedWidth = 20 as const

/**
 * Sets the CSS variables for the sidebar width
 */
function setSidebarWidthVars(
	width: number,
	position: SidebarPosition,
	widthVar?: string,
	flyoutVar?: string,
	localStorageVar?: string,
) {
	if (position === "left") {
		document.documentElement.style.setProperty(
			widthVar ?? leftSidebarWidthVar,
			`${width}px`,
		)
		if (width > collapsedWidth) {
			document.documentElement.style.setProperty(
				flyoutVar ?? leftSidebarFlyoutVar,
				`${width}px`,
			)
			localStorage.setItem(
				localStorageVar ?? localStorageKey_LeftSidebarWidth,
				width.toString(),
			)
		}
	} else {
		document.documentElement.style.setProperty(
			widthVar ?? rightSidebarWidthVar,
			`${width}px`,
		)
		if (width > collapsedWidth) {
			document.documentElement.style.setProperty(
				flyoutVar ?? rightSidebarFlyoutVar,
				`${width}px`,
			)
			localStorage.setItem(
				localStorageVar ?? localStorageKey_RightSidebarWidth,
				width.toString(),
			)
		}
	}
}

/**
 * Resets the sidebar width in the expanded state coming from the collapsed state
 */
function resetToExpanded(
	position: SidebarPosition,
	widthVar?: string,
	flyoutVar?: string,
	localStorageVar?: string,
) {
	if (position === "left") {
		const original =
			document.documentElement.style.getPropertyValue(
				flyoutVar ?? leftSidebarFlyoutVar,
			) ?? `${defaultWidth}px`
		const num = original.substring(0, original.length - 2)
		localStorage.setItem(
			localStorageVar ?? localStorageKey_LeftSidebarWidth,
			num.toString(),
		)
		document.documentElement.style.setProperty(
			widthVar ?? leftSidebarWidthVar,
			original,
		)
	} else {
		const original =
			document.documentElement.style.getPropertyValue(
				flyoutVar ?? rightSidebarFlyoutVar,
			) ?? defaultWidth
		localStorage.setItem(
			localStorageVar ?? localStorageKey_RightSidebarWidth,
			original.toString(),
		)
		document.documentElement.style.setProperty(
			widthVar ?? rightSidebarWidthVar,
			original,
		)
	}
}

function getWidthFromLocalStorage(
	position: SidebarPosition,
	localStorageVar?: string,
) {
	if (position === "left") {
		const locVal = Number.parseInt(
			localStorage.getItem(
				localStorageVar ?? localStorageKey_LeftSidebarWidth,
			) ?? "",
		)
		if (!Number.isNaN(locVal)) {
			return locVal
		}
		return defaultWidth
	}
	const locVal = Number.parseInt(
		localStorage.getItem(
			localStorageVar ?? localStorageKey_RightSidebarWidth,
		) ?? "",
	)
	if (!Number.isNaN(locVal)) {
		return locVal
	}
	return defaultWidth
}

function Sidebar({
	id,
	collapsed: _collapsed,
	width: _width,
	onCollapsed,
	onExpand,
	onResizeStart,
	onResizeEnd,
	onCloseButtonClick,
	sticky,
	valueTextLabel,
	resizeGrabAreaLabel,
	className,
	style,
	children,
	closeButton,
	closeButtonClassName,
	closeButtonStyle,
	closeButtonTitle,
	closeButtonAriaLabel,
	position,
	widthVar,
	flyoutVar,
	localStorageWidthKey,
	localStorageCollapsedKey,
}: SidebarProps & PropAdditionals) {
	const asideRef = useRef<ElementRef<"aside">>(null)
	const mouseUpRef = useRef<(() => void) | undefined>(undefined)
	const [isResizing, setIsResizing] = useState(false)
	const [isHovered, setIsHovered] = useState(false)

	const collapsedInit =
		(localStorage.getItem(
			localStorageCollapsedKey ??
				(position === "left"
					? localStorageKey_LeftSidebarCollapsed
					: localStorageKey_RightSidebarCollapsed),
		) as CollapsedState | null) ??
		_collapsed ??
		"expanded"

	const [collapsed, setCollapsed] = useState<CollapsedState>(collapsedInit)

	const widthFromLocalStorage =
		_width ?? getWidthFromLocalStorage(position, localStorageWidthKey)
	// sets the initial css variables
	setSidebarWidthVars(
		widthFromLocalStorage,
		position,
		widthVar,
		flyoutVar,
		localStorageWidthKey,
	)
	const initWidth =
		collapsed === "expanded" ? widthFromLocalStorage : collapsedWidth

	// handles if collapsed or not
	setSidebarWidthVars(
		initWidth,
		position,
		widthVar,
		flyoutVar,
		localStorageWidthKey,
	)

	if (_collapsed != null && _collapsed !== collapsed) {
		setCollapsed(_collapsed)
		if (collapsed && onCollapsed) onCollapsed()
	}

	const onResizeCB = () => {
		if (mouseUpRef.current === undefined && collapsed === "expanded") {
			if (_width != null) return
			const mouseMoveProto = (ev: MouseEvent) => {
				if (!asideRef.current) return
				if (ev.clientX < 0) return
				if (position === "left" && ev.clientX > window.innerWidth - 20)
					return
				if (position === "right" && ev.clientX < 20) return
				const sidebarWidth =
					position === "left"
						? ev.clientX -
							asideRef.current.getBoundingClientRect().left
						: asideRef.current.getBoundingClientRect().right -
							ev.clientX

				if (sidebarWidth < 20) return
				setSidebarWidthVars(
					sidebarWidth,
					position,
					widthVar,
					flyoutVar,
					localStorageWidthKey,
				)
			}
			//const mouseMove = (e: MouseEvent) => rateLimited(mouseMoveProto, e)
			const mouseMove = mouseMoveProto

			const mouseUp = () => {
				if (!mouseUpRef.current) return
				window.removeEventListener("mousemove", mouseMove)
				window.removeEventListener("mouseup", mouseUpRef.current)
				mouseUpRef.current = undefined

				if (onResizeEnd) onResizeEnd()
				setIsResizing(false)
			}
			mouseUpRef.current = mouseUp
			setIsResizing(true)
			window.addEventListener("mousemove", mouseMove)
			window.addEventListener("mouseup", mouseUpRef.current)

			if (onResizeStart) onResizeStart()
		}
	}

	// in AK the width sets only the default width
	/*if (width != null && width !== widthUsedRef.current) {
		widthUsedRef.current = width
	}*/

	const onCollapsedCB = () => {
		const newState = collapsed === "collapsed" ? "expanded" : "collapsed"
		setCollapsed(newState)
		if (newState === "collapsed") {
			setSidebarWidthVars(
				collapsedWidth,
				position,
				widthVar,
				flyoutVar,
				localStorageWidthKey,
			)
			onCollapsed?.()
		} else {
			resetToExpanded(position, widthVar, flyoutVar, localStorageWidthKey)
			onExpand?.()
		}
		onCloseButtonClick?.(newState)

		localStorage.setItem(
			localStorageCollapsedKey ??
				(position === "left"
					? localStorageKey_LeftSidebarCollapsed
					: localStorageKey_RightSidebarCollapsed),
			newState,
		)
	}

	return (
		<aside
			id={id}
			ref={asideRef}
			aria-label={valueTextLabel ?? "sidebar"}
			className={twMerge(
				`bg-surface-overlay relative z-2 m-0 box-border h-full transform ease-in-out ${
					isResizing ? "duration-0" : "duration-300"
				}`,
				className,
			)}
			style={{
				width: `var(${widthVar ?? (position === "left" ? leftSidebarWidthVar : rightSidebarWidthVar)}, ${initWidth}px)`,
				gridArea:
					position === "left" ? "left-sidebar" : "right-sidebar",
				...style,
			}}
		>
			{/* resize button and grab handle area */}
			{/** biome-ignore lint/a11y/useSemanticElements: is a div and has a button within */}
			<div
				role="button"
				className={`absolute inset-y-0 z-3 h-full border-y-0 ${position === "left" ? "-right-3 border-l-2 border-r-0" : "-left-3 border-r-2 border-l-0"} ${collapsed === "expanded" ? "hover:border-brand-bold group cursor-col-resize" : ""} border-border w-3 select-none border-solid bg-transparent`}
				onMouseDown={onResizeCB}
				onMouseEnter={() => {
					if (!isResizing && !isHovered) {
						setIsHovered(true)
					}
				}}
				onMouseLeave={() => {
					if (!isResizing && isHovered) {
						setIsHovered(false)
					}
				}}
				aria-label={resizeGrabAreaLabel ?? "resize grab area"}
				tabIndex={0}
			>
				<div
					className={`${sticky ? "sticky" : "static"} duration-150`}
					style={{
						top: sticky
							? `calc(var(${bannerHeightVar}, 0px) + var(${topNavigationHeightVar}, 0px))`
							: undefined,
					}}
				>
					{closeButton ? (
						closeButton
					) : (
						<button
							onClick={onCollapsedCB}
							onKeyUp={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									onCollapsedCB()
								}
							}}
							aria-label={
								(closeButtonAriaLabel ??
								collapsed === "collapsed")
									? "expand sidebar"
									: "collapse sidebar"
							}
							className={twMerge(
								`bg-surface-raised border-border shadow-raised rounded-full cursor-pointer border border-solid ${collapsed === "expanded" ? "group-hover:bg-selected-bold group-hover:text-text-inverse" : "hover:bg-selected-bold hover:text-text-inverse"} active:bg-selected-bold-hovered text-text absolute ${position === "left" ? "-left-[0.875rem]" : "-right-[0.875rem]"} top-8 box-border flex h-7 w-7 items-center justify-center rounded-full duration-150`,
								closeButtonClassName,
							)}
							style={closeButtonStyle}
							type="button"
							title={closeButtonTitle}
						>
							{collapsed === "collapsed" ? (
								position === "right" ? (
									<ChevronLeftIcon
										aria-label="expand"
										className="stroke-3"
									/>
								) : (
									<ChevronRightIcon
										aria-label="expand"
										className="stroke-3"
									/>
								)
							) : position === "right" ? (
								<ChevronRightIcon
									aria-label="collapse"
									className="stroke-3"
								/>
							) : (
								<ChevronLeftIcon
									aria-label="collapse"
									className="stroke-3"
								/>
							)}
						</button>
					)}
				</div>
			</div>
			{/* the actual sidebar */}

			<section
				className={`${sticky && position === "left" ? "sticky left-0 overflow-auto" : sticky ? "sticky right-0 overflow-auto" : "relative h-full"} ${collapsed === "collapsed" ? "hidden" : ""} text-text-subtle min-h-min w-full overflow-y-auto overflow-x-hidden`}
				style={{
					top: sticky
						? `calc(var(${bannerHeightVar}, 0px) + var(${topNavigationHeightVar}, 0px))`
						: undefined,
					height: sticky
						? `calc(100dvh - var(${bannerHeightVar}, 0px) - var(${topNavigationHeightVar}, 0px))`
						: undefined,
				}}
			>
				{children}
			</section>
		</aside>
	)
}
