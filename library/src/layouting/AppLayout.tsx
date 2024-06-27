import type React from "react"
import {
	LeftSidebar as LeftSidebarImpl,
	RightSidebar as RightSidebarImpl,
} from "./LeftSidebar"
import { twMerge } from "tailwind-merge"

import { useEffect, useRef } from "react"

export const bannerHeightVar = "--bannerHeight"
export const topNavigationHeightVar = "--topNavigationHeight"

/**
 * The container is the top level container that holds all the other layout elements.
 * It is the root element of the layout.
 */
function Container({
	children,
	className,
	style,
	testId,
}: {
	children: React.ReactNode
	className?: string
	style?: React.CSSProperties
	testId?: string
}) {
	return (
		<div
			className={twMerge(
				"relative m-0 box-border grid h-full min-h-0 w-full",
				className,
			)}
			data-layout-container="true"
			data-testid={testId}
			style={{
				gridTemplateAreas: `
					"left-panel banner right-panel"
					"left-panel top-navigation right-panel"
					"left-panel content right-panel"
				`,
				gridTemplateColumns:
					"var(--leftPanelWidth, 0px) minmax(0, 1fr) var(--rightPanelWidth, 0px)",
				gridTemplateRows: `var(${bannerHeightVar}, min-content) var(${topNavigationHeightVar}, min-content) 1fr`,
				outline: "none",
				...style,
			}}
		>
			{children}
		</div>
	)
}

/**
 * The banner is the panel that is shown at the top of the screen. It resides in the top level container grid in the "banner" area above the top navigation.
 */
function Banner({
	children,
	className,
	style,
	testId,
	sticky,
	height,
}: React.ComponentPropsWithRef<"div"> & {
	testId?: string
	sticky?: boolean
	height?: number | string
}) {
	const localRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const root = document.documentElement
		if (height) {
			const heightVal =
				typeof height === "number" ? `${height}px` : height
			root.style.setProperty(bannerHeightVar, heightVal)
		} else {
			const h = localRef.current?.clientHeight
			if (h) {
				root.style.setProperty(bannerHeightVar, `${h}px`)
			}
		}
	}, [height])

	return (
		<div
			ref={localRef}
			className={twMerge(
				`bg-surface-overlay z-[3] m-0 box-border min-h-0 ${sticky ? "sticky left-0 right-0 top-0" : "relative"}`,
				className,
			)}
			data-layout-banner="true"
			data-testid={testId}
			style={{
				height: `var(${bannerHeightVar}, min-content)`,
				gridArea: "banner",
				/*insetBlockStart: 0,
				insetInlineEnd: fixed
					? "var(--rightPanelWidth, auto)"
					: undefined,
				insetInlineStart: fixed
					? "var(--leftPanelWidth, auto)"
					: undefined,*/
				...style,
			}}
		>
			{children}
		</div>
	)
}

/**
 * The top navigation is the panel that is shown at the top of the screen. It resides in the top level container grid in the "top-navigation" area.
 */
function TopNavigation({
	children,
	className,
	style,
	testId,
	height,
	sticky,
}: React.ComponentPropsWithRef<"header"> & {
	testId?: string
	height?: number | string
	sticky?: boolean
}) {
	const localRef = useRef<HTMLHeadElement>(null)

	useEffect(() => {
		const root = document.documentElement
		if (height) {
			const heightVal =
				typeof height === "number" ? `${height}px` : height
			root.style.setProperty(topNavigationHeightVar, heightVal)
			//root.style.setProperty("--_topNavigationHeight", heightVal)
		} else {
			const h = localRef.current?.clientHeight
			if (h) {
				root.style.setProperty(topNavigationHeightVar, `${h}px`)
			}
		}
	}, [height])

	return (
		<header
			ref={localRef}
			className={twMerge(
				`bg-surface-overlay z-[3] m-0 box-border min-h-0 ${sticky ? "sticky left-0 right-0" : "relative"}`,
				className,
			)}
			data-layout-top-navigation="true"
			data-testid={testId}
			style={{
				height: `var(${topNavigationHeightVar}, min-content)`,
				gridArea: "top-navigation",
				top: sticky ? `var(${bannerHeightVar}, 0)` : undefined,
				/*insetBlockStart: "var(--bannerHeight, auto)",
				insetInlineEnd: "var(--rightPanelWidth, auto)",
				insetInlineStart: "var(--leftPanelWidth, auto)",*/
				...style,
			}}
		>
			{children}
		</header>
	)
}

/**
 * The left panel is the panel that is shown on the left side of the screen. It resides in the top level container grid in the "left-panel" area.
 */
function LeftPanel({
	children,
	className,
	style,
	sticky,
	width = 128,
}: React.ComponentPropsWithRef<"aside"> & {
	sticky?: boolean
	width?: number
}) {
	if (width) {
		const root = document.documentElement
		root.style.setProperty("--leftPanelWidth", `${width}px`)
	}

	return (
		<aside
			className={twMerge(
				`bg-surface-overlay m-0 box-border ${sticky ? "sticky left-0 top-0 h-min max-h-dvh min-h-dvh overflow-auto" : "relative h-full"} w-full`,
				className,
			)}
			data-layout-left-panel="true"
			style={{
				width: "var(--leftPanelWidth, 0px)",
				gridArea: "left-panel",
				...style,
			}}
		>
			{children}
		</aside>
	)
}

/**
 * The right panel is the panel that is shown on the right side of the screen. It resides in the top level container grid in the "right-panel" area.
 */
function RightPanel({
	children,
	className,
	style,
	testId,
	sticky,
	width = 128,
}: React.ComponentPropsWithRef<"aside"> & {
	testId?: string
	sticky?: boolean
	width?: number
}) {
	if (width) {
		const root = document.documentElement
		root.style.setProperty("--rightPanelWidth", `${width}px`)
	}

	return (
		<aside
			className={twMerge(
				`bg-surface-overlay m-0 box-border ${sticky ? "sticky right-0 top-0 h-min max-h-dvh min-h-dvh overflow-auto" : "relative h-full"} w-full`,
				className,
			)}
			data-layout-right-panel="true"
			data-testid={testId}
			style={{
				width: "var(--rightPanelWidth, 0px)",
				gridArea: "right-panel",
				...style,
			}}
		>
			{children}
		</aside>
	)
}

function Content({
	children,
	className,
	style,
	testId,
}: React.ComponentPropsWithRef<"section"> & {
	testId?: string
}) {
	return (
		<section
			className={twMerge(
				"relative grid h-full min-h-0 w-full",
				className,
			)}
			data-layout-content="true"
			data-testid={testId}
			style={{
				gridArea: "content",
				gridTemplateAreas: '"left-sidebar main right-sidebar"',
				gridTemplateColumns: "auto minmax(0, 1fr) auto",
				...style,
			}}
		>
			{children}
		</section>
	)
}

function Main({
	children,
	className,
	style,
	testId,
	fixedHeight,
}: React.ComponentPropsWithRef<"main"> & {
	testId?: string
	fixedHeight?: boolean
}) {
	return (
		<main
			className={twMerge(
				"relative m-0 box-border min-h-0 w-full",
				className,
			)}
			data-layout-main="true"
			data-testid={testId}
			style={{
				height: fixedHeight
					? "calc(100dvh - var(--topNavigationHeight, 0px) - var(--bannerHeight, 0px))"
					: undefined,
				overflow: fixedHeight ? "hidden" : undefined,
				...style,
			}}
		>
			{children}
		</main>
	)
}

/**
 * The left side bar is an (optionally) resizeable bar and should be within the content area.
 */
const LeftSidebar = LeftSidebarImpl
const RightSidebar = RightSidebarImpl

const AppLayout = {
	Container,
	Banner,
	TopNavigation,
	LeftPanel,
	RightPanel,
	Content,
	LeftSidebar,
	RightSidebar,
	Main,
}
export default AppLayout
