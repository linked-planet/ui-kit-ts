import type React from "react"
import {
	type CSSProperties,
	type ElementRef,
	useCallback,
	useRef,
	useState,
} from "react"
import { twMerge } from "tailwind-merge"

import { bannerHeightVar, topNavigationHeightVar } from "./AppLayout"

import { rateLimitHelper } from "../utils"

import ChevronLeftIcon from "@atlaskit/icon/glyph/chevron-left"
import ChevronRightIcon from "@atlaskit/icon/glyph/chevron-right"

const rateLimited = rateLimitHelper(33.3) //30fps

type CollapsedState = "collapsed" | "expanded"

export const leftSidebarWidthVar = "--leftSidebarWidth" as const
const leftSidebarFlyoutVar = "--leftSidebarFlyoutWidth" as const
export const rightSidebarWidthVar = "--rightSidebarWidth" as const
const rightSidebarFlyoutVar = "--rightSidebarFlyoutWidth" as const

export type SidebarProps = {
	id?: string
	collapsedState?: CollapsedState
	width?: number
	onCollapsed?: () => void
	onExpand?: () => void
	onResizeStart?: () => void
	onResizeEnd?: () => void
	sticky?: boolean
	valueTextLabel?: string
	resizeGrabAreaLabel?: string
	className?: string
	style?: CSSProperties
	children: React.ReactNode
	resizeButton?: React.ReactNode
	widthVariable?: string
}

type PropAdditionals = {
	position: "left" | "right"
	widthVariable: string
	flyoutWidthVariable: string
}

export function LeftSidebar(props: SidebarProps) {
	return (
		<Sidebar
			{...props}
			position="left"
			widthVariable={props.widthVariable ?? leftSidebarWidthVar}
			flyoutWidthVariable={leftSidebarFlyoutVar}
		/>
	)
}

export function RightSidebar(props: SidebarProps) {
	return (
		<Sidebar
			{...props}
			position="right"
			widthVariable={props.widthVariable ?? rightSidebarWidthVar}
			flyoutWidthVariable={rightSidebarFlyoutVar}
		/>
	)
}

function Sidebar({
	id,
	collapsedState,
	width,
	widthVariable,
	flyoutWidthVariable,
	onCollapsed,
	onExpand,
	onResizeStart,
	onResizeEnd,
	sticky,
	valueTextLabel,
	resizeGrabAreaLabel,
	className,
	style,
	children,
	resizeButton,
	position,
}: SidebarProps & PropAdditionals) {
	const asideRef = useRef<ElementRef<"aside">>(null)
	const mouseUpRef = useRef<(() => void) | undefined>(undefined)
	const [collapsed, setCollapsed] = useState<CollapsedState>(
		collapsedState ?? "expanded",
	)
	const widthUsedRef = useRef(width ?? 100)
	const [isResizing, setIsResizing] = useState(false)
	const [isHovered, setIsHovered] = useState(false)

	if (collapsedState != null && collapsedState !== collapsed) {
		setCollapsed(collapsedState)
		if (collapsed && onCollapsed) onCollapsed()
	}

	const resizeCB = useCallback(() => {
		if (mouseUpRef.current === undefined && collapsed === "expanded") {
			const mouseMoveProto = (ev: MouseEvent) => {
				if (!asideRef.current) return
				if (ev.clientX < 0) return
				if (ev.clientX > window.innerWidth - 20) return
				const leftSidebarWidth =
					ev.clientX - asideRef.current.getBoundingClientRect().left
				if (leftSidebarWidth < 20) return
				widthUsedRef.current = leftSidebarWidth
				document.documentElement.style.setProperty(
					widthVariable,
					`${leftSidebarWidth}px`,
				)
			}
			const mouseMove = (e: MouseEvent) => rateLimited(mouseMoveProto, e)

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
	}, [collapsed, widthVariable, onResizeEnd, onResizeStart])

	// in AK the width sets only the default width
	/*if (width != null && width !== widthUsedRef.current) {
		widthUsedRef.current = width
	}*/

	if (collapsed === "expanded") {
		document.documentElement.style.setProperty(
			widthVariable,
			`${widthUsedRef.current}px`,
		)
		document.documentElement.style.setProperty(
			flyoutWidthVariable,
			`${widthUsedRef.current}px`,
		)
	} else {
		document.documentElement.style.setProperty(widthVariable, "20px")
	}

	return (
		<aside
			id={id}
			ref={asideRef}
			aria-label={valueTextLabel ?? "sidebar"}
			className={twMerge(
				`bg-surface-overlay relative z-[2] m-0 box-border h-full transform ease-in-out ${
					isResizing ? "duration-0" : "duration-300"
				}`,
				className,
			)}
			style={{
				width: `var(${widthVariable})`,
				gridArea:
					position === "left" ? "left-sidebar" : "right-sidebar",
				...style,
			}}
		>
			{/* resize button and grab handle area */}
			<div
				className={`absolute inset-y-0 h-full ${position === "left" ? "-right-3 border-l-2" : "-left-3 border-r-2"} hover:border-brand-bold border-border w-3 cursor-col-resize select-none bg-transparent`}
			>
				<div
					className={`${sticky ? "sticky" : "static"} duration-150`}
					aria-label={resizeGrabAreaLabel ?? "resize grab area"}
					onMouseDown={resizeCB}
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
					style={{
						top: sticky
							? `calc(var(${bannerHeightVar}, 0px) + var(${topNavigationHeightVar}, 0px))`
							: undefined,
					}}
				>
					{resizeButton ? (
						<>{resizeButton}</>
					) : (
						<button
							onClick={() => {
								const newState =
									collapsed === "collapsed"
										? "expanded"
										: "collapsed"
								setCollapsed(newState)
								if (newState === "collapsed" && onCollapsed)
									onCollapsed()
								if (newState === "expanded" && onExpand)
									onExpand()
							}}
							onKeyUp={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									const newState =
										collapsed === "collapsed"
											? "expanded"
											: "collapsed"
									setCollapsed(newState)
									if (newState === "collapsed" && onCollapsed)
										onCollapsed()
									if (newState === "expanded" && onExpand)
										onExpand()
								}
							}}
							aria-label={
								collapsed === "collapsed"
									? "expand sidebar"
									: "collapse sidebar"
							}
							className={`bg-surface-raised shadow-overlay-bold hover:bg-selected-bold active:bg-selected-bold-hovered text-text hover:text-text-inverse absolute ${position === "left" ? "-left-3" : "-right-3"} top-8 box-border flex h-6 w-6 items-center justify-center rounded-full duration-150`}
							type="button"
						>
							{collapsed === "collapsed" ? (
								<>
									{position === "right" ? (
										<ChevronLeftIcon label="expand" />
									) : (
										<ChevronRightIcon label="expand" />
									)}
								</>
							) : (
								<>
									{position === "right" ? (
										<ChevronRightIcon label="collapse" />
									) : (
										<ChevronLeftIcon label="collapse" />
									)}
								</>
							)}
						</button>
					)}
				</div>
			</div>
			{/* the actual sidebar */}

			<section
				className={`${sticky && position === "left" ? "sticky left-0 overflow-auto" : sticky ? "sticky right-0 overflow-auto" : "relative h-full"} text-text-subtle min-h-min w-full overflow-y-auto overflow-x-hidden p-2`}
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
