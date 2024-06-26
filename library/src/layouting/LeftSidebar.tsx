import type React from "react"
import {
	type CSSProperties,
	type ElementRef,
	useCallback,
	useRef,
	useState,
} from "react"
import { twMerge } from "tailwind-merge"

import { rateLimitHelper } from "../utils"

import ChevronLeftIcon from "@atlaskit/icon/glyph/chevron-left"
import ChevronRightIcon from "@atlaskit/icon/glyph/chevron-right"

//TODO this is far from finished!

const rateLimited = rateLimitHelper(33.3) //30fps

type CollapsedState = "collapsed" | "expanded"

export const leftSideBarVar = "--leftSidebarWidth"
const leftSideBarFlyoutVar = "--leftSidebarFlyoutWidth"

export function LeftSidebar({
	id,
	collapsedState,
	width,
	widthVariable = leftSideBarVar,
	flyoutWidthVariable = leftSideBarFlyoutVar,
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
}: {
	id?: string
	collapsedState?: CollapsedState
	width?: number
	widthVariable?: string
	flyoutWidthVariable?: string
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
}) {
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
				`bg-surface-overlay relative z-[1] m-0 box-border h-full transform p-2 ease-in-out ${
					isResizing ? "duration-0" : "duration-300"
				}`,
				className,
			)}
			style={{
				width: `var(${widthVariable})`,
				...style,
			}}
			data-ds--page-layout--slot="left-sidebar"
		>
			{/* resize button and grab handle area */}
			<div
				className="hover:border-brand-bold border-border absolute inset-y-0 -right-3 w-3 cursor-col-resize select-none border-l-2 bg-transparent opacity-100 duration-150"
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
			/>
			{resizeButton ? (
				<>{resizeButton}</>
			) : (
				<button
					onClick={() => {
						const newState =
							collapsed === "collapsed" ? "expanded" : "collapsed"
						setCollapsed(newState)
						if (newState === "collapsed" && onCollapsed)
							onCollapsed()
						if (newState === "expanded" && onExpand) onExpand()
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
							if (newState === "expanded" && onExpand) onExpand()
						}
					}}
					aria-label={
						collapsed === "collapsed"
							? "expand sidebar"
							: "collapse sidebar"
					}
					className={`bg-surface-raised hover:bg-brand-hovered text-text hover:text-text-inverse absolute -right-3 top-8 flex h-6 w-6 items-center justify-center rounded-full hover:opacity-100 ${
						isHovered || collapsed === "collapsed"
							? "opacity-100"
							: "opacity-0"
					} duration-150`}
					type="button"
				>
					{collapsed === "collapsed" ? (
						<ChevronRightIcon label="expand" />
					) : (
						<ChevronLeftIcon label="collapse" />
					)}
				</button>
			)}
			{/* the actual sidebar */}
			<section
				className={`${sticky ? "sticky left-0 h-min" : "relative h-full"} text-text-subtle left-0 top-0 h-min w-full overflow-y-auto overflow-x-hidden`}
				style={{
					top: sticky
						? "calc(var(--_bannerHeight, 0px) + var(--_topNavigationHeight, 0px))"
						: undefined,
				}}
			>
				{children}
			</section>
		</aside>
	)
}
