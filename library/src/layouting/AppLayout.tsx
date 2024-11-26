import type React from "react"
import {
	LeftSidebar as LeftSidebarImpl,
	leftSidebarWidthVar,
	RightSidebar as RightSidebarImpl,
	rightSidebarWidthVar,
} from "./Sidebar"
import { twMerge } from "tailwind-merge"

import { useEffect, useRef } from "react"

export const bannerHeightVar = "--bannerHeight" as const
export const topNavigationHeightVar = "--topNavigationHeight" as const
export const leftPanelWidthVar = "--leftPanelWidth" as const
export const rightPanelWidthVar = "--rightPanelWidth" as const

let uikts_layouting_heightCB = false
/**
 * Initialize the top navigation height variable by setting it to the height of the top navigation element.
 */
export function initTopNavigationHeight() {
	const topNav = document.getElementsByClassName("aui-header")
	if (!topNav.length) {
		console.log(
			"Unable to find top navigation element to set:",
			topNavigationHeightVar,
		)
		return
	}
	const topNavHeight = topNav[0].clientHeight
	if (topNavHeight) {
		console.info("UIKitTs - Top navigation height set to:", topNavHeight)
		document.documentElement.style.setProperty(
			topNavigationHeightVar,
			`${topNavHeight}px`,
		)
	}

	const headers = document.getElementsByTagName("header")
	for (let i = 0; i < headers.length; i++) {
		const header = headers.item(i)
		if (header?.getAttribute("role") === "banner") {
			const bannerHeight = header.clientHeight || 0
			console.info("UIKitTs - Banner height set to:", bannerHeight)
			document.documentElement.style.setProperty(
				bannerHeightVar,
				`${bannerHeight}px`,
			)
			console.log(
				"UIKitTs - Banner height set to:",
				bannerHeight,
				header.clientHeight,
			)
		}
	}

	if (!uikts_layouting_heightCB) {
		window.addEventListener("resize", initTopNavigationHeight)
		console.info("UIKitTs - Added resize event listener for App layouting")
		uikts_layouting_heightCB = true
	}
}

/**
 * The container is the top level container that holds all the other layout elements.
 * It is the root element of the layout.
 */
function Container({
	children,
	className,
	style,
	testId,
	useBanner = false,
}: {
	children: React.ReactNode
	className?: string
	style?: React.CSSProperties
	testId?: string
	useBanner?: boolean
}) {
	return (
		<div
			className={twMerge(
				"relative m-0 box-border grid h-dvh w-full",
				className,
			)}
			data-layout-container="true"
			data-testid={testId}
			style={{
				gridTemplateAreas: useBanner
					? `
					"left-panel banner right-panel"
					"left-panel top-navigation right-panel"
					"left-panel content right-panel"
				`
					: `
					"left-panel top-navigation right-panel"
					"left-panel content right-panel"
				`,
				gridTemplateColumns: `var(${leftPanelWidthVar}, 0px) minmax(0, 1fr) var(${rightPanelWidthVar}, 0px)`,
				gridTemplateRows: useBanner
					? `var(${bannerHeightVar}, 0) var(${topNavigationHeightVar}, min-content) 1fr`
					: `var(${topNavigationHeightVar}, min-content) 1fr`,
				outline: "none",
				height: useBanner
					? "100dvh"
					: `calc(100dvh - var(${bannerHeightVar}, 0px))`,
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
		root.style.setProperty(leftPanelWidthVar, `${width}px`)
	}

	return (
		<aside
			className={twMerge(
				`bg-surface-overlay m-0 box-border ${sticky ? "sticky left-0 top-0 h-min max-h-dvh min-h-dvh overflow-auto" : "relative h-full"} w-full`,
				className,
			)}
			data-layout-left-panel="true"
			style={{
				width: `var(${leftPanelWidthVar}, 0px)`,
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
		root.style.setProperty(rightPanelWidthVar, `${width}px`)
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
				width: `var(${rightPanelWidthVar}, 0px)`,
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
				gridTemplateColumns: "auto 1fr auto",
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
				gridArea: "main",
				height: fixedHeight
					? `calc(100dvh - var(${topNavigationHeightVar}, 0px) - var(${bannerHeightVar}, 0px))`
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

export const AppLayout = {
	Container,
	Banner,
	TopNavigation,
	LeftPanel,
	RightPanel,
	Content,
	LeftSidebar,
	RightSidebar,
	Main,
	bannerHeightVar,
	topNavigationHeightVar,
	leftPanelWidthVar,
	rightPanelWidthVar,
	leftSidebarWidthVar,
	rightSidebarWidthVar,
}
