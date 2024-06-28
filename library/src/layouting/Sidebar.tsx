import type React from "react"
import { type CSSProperties, type ElementRef, useRef, useState } from "react"
import { twMerge } from "tailwind-merge"

import { bannerHeightVar, topNavigationHeightVar } from "./AppLayout"

import { rateLimitHelper } from "../utils"

import ChevronLeftIcon from "@atlaskit/icon/glyph/chevron-left"
import ChevronRightIcon from "@atlaskit/icon/glyph/chevron-right"

const rateLimited = rateLimitHelper(15) //59fps

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
	sticky?: boolean
	valueTextLabel?: string
	resizeGrabAreaLabel?: string
	className?: string
	style?: CSSProperties
	children: React.ReactNode
	resizeButton?: React.ReactNode
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

const localStorageKeyWidthLeft = "leftSidebarWidth"
const localStorageKeyWidthRight = "rightSidebarWidth"
const localStorageKeyLeftCollapsed = "leftSidebarCollapsed"
const localStorageKeyRightCollapsed = "rightSidebarCollapsed"
const defaultWidth = 180 as const
const collapsedWidth = 20 as const

function setSidebarWidthVars(width: number, position: SidebarPosition) {
	if (position === "left") {
		document.documentElement.style.setProperty(
			leftSidebarWidthVar,
			`${width}px`,
		)
		if (width > collapsedWidth) {
			document.documentElement.style.setProperty(
				leftSidebarFlyoutVar,
				`${width}px`,
			)
			localStorage.setItem(localStorageKeyWidthLeft, width.toString())
		}
	} else {
		document.documentElement.style.setProperty(
			rightSidebarWidthVar,
			`${width}px`,
		)
		if (width > collapsedWidth) {
			document.documentElement.style.setProperty(
				rightSidebarFlyoutVar,
				`${width}px`,
			)
			localStorage.setItem(localStorageKeyWidthRight, width.toString())
		}
	}
}

function resetToExpanded(position: SidebarPosition) {
	if (position === "left") {
		const original =
			document.documentElement.style.getPropertyValue(
				leftSidebarFlyoutVar,
			) ?? `${defaultWidth}px`
		const num = original.substring(0, original.length - 2)
		localStorage.setItem(localStorageKeyWidthLeft, num.toString())
		document.documentElement.style.setProperty(
			leftSidebarWidthVar,
			original,
		)
	} else {
		const original =
			document.documentElement.style.getPropertyValue(
				rightSidebarFlyoutVar,
			) ?? defaultWidth
		localStorage.setItem(localStorageKeyWidthRight, original.toString())
		document.documentElement.style.setProperty(
			rightSidebarWidthVar,
			original,
		)
	}
}

function getWidthFromLocalStorage(position: SidebarPosition) {
	if (position === "left") {
		const locVal = Number.parseInt(
			localStorage.getItem(localStorageKeyWidthLeft) ?? "",
		)
		if (!Number.isNaN(locVal)) {
			return locVal
		}
		return defaultWidth
	}
	const locVal = Number.parseInt(
		localStorage.getItem(localStorageKeyWidthRight) ?? "",
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
	const [isResizing, setIsResizing] = useState(false)
	const [isHovered, setIsHovered] = useState(false)

	const collapsedInit =
		(localStorage.getItem(
			position === "left"
				? localStorageKeyLeftCollapsed
				: localStorageKeyRightCollapsed,
		) as CollapsedState | null) ??
		_collapsed ??
		"expanded"

	const [collapsed, setCollapsed] = useState<CollapsedState>(collapsedInit)

	const widthFromLocalStorage = getWidthFromLocalStorage(position)
	setSidebarWidthVars(widthFromLocalStorage, position)
	const initWidth =
		collapsed === "expanded" ? widthFromLocalStorage : collapsedWidth

	setSidebarWidthVars(initWidth, position)

	if (_collapsed != null && _collapsed !== collapsed) {
		setCollapsed(_collapsed)
		if (collapsed && onCollapsed) onCollapsed()
	}

	const onResizeCB = () => {
		if (mouseUpRef.current === undefined && collapsed === "expanded") {
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
				setSidebarWidthVars(sidebarWidth, position)
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
			setSidebarWidthVars(collapsedWidth, position)
			onCollapsed?.()
		} else {
			resetToExpanded(position)
			onExpand?.()
		}

		localStorage.setItem(
			position === "left"
				? localStorageKeyLeftCollapsed
				: localStorageKeyRightCollapsed,
			newState,
		)
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
				width: `var(${position === "left" ? leftSidebarWidthVar : rightSidebarWidthVar}, ${initWidth}px)`,
				gridArea:
					position === "left" ? "left-sidebar" : "right-sidebar",
				...style,
			}}
		>
			{/* resize button and grab handle area */}
			<div
				className={`absolute inset-y-0 z-[3] h-full ${position === "left" ? "-right-3 border-l-2" : "-left-3 border-r-2"} ${collapsed === "expanded" ? "hover:border-brand-bold group cursor-col-resize" : ""} border-border w-3 select-none bg-transparent`}
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
			>
				<div
					className={`${sticky ? "sticky" : "static"} duration-150`}
					aria-label={resizeGrabAreaLabel ?? "resize grab area"}
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
							onClick={onCollapsedCB}
							onKeyUp={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									onCollapsedCB()
								}
							}}
							aria-label={
								collapsed === "collapsed"
									? "expand sidebar"
									: "collapse sidebar"
							}
							className={`bg-surface-raised border-border shadow-raised rounded-full border border-solid ${collapsed === "expanded" ? "group-hover:bg-selected-bold group-hover:text-text-inverse" : "hover:bg-selected-bold hover:text-text-inverse"} active:bg-selected-bold-hovered text-text absolute ${position === "left" ? "-left-[0.875rem]" : "-right-[0.875rem]"} top-8 box-border flex h-7 w-7 items-center justify-center rounded-full duration-150`}
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
