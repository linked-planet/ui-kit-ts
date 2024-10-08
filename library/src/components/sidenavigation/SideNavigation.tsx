import React, { useRef } from "react"
import type { ComponentPropsWithoutRef } from "react"
import { twJoin, twMerge } from "tailwind-merge"
import ArrowLeftCircleIcon from "@atlaskit/icon/glyph/arrow-left-circle"
import ArrowRightCircleIcon from "@atlaskit/icon/glyph/arrow-right-circle"
import { IconSizeHelper } from "../IconSizeHelper"

import { CSSTransition, TransitionGroup } from "react-transition-group"
import type { CSSTransitionProps } from "react-transition-group/CSSTransition"
import { useSideNavigationStore } from "./SideNavigationStore"

const itemBaseStyles = twJoin(
	"px-1.5 data-[selected=true]:bg-neutral-subtle-hovered group flex w-full cursor-pointer select-none items-center overflow-hidden rounded",
	"hover:bg-neutral-subtle-hovered active:bg-neutral-subtle-pressed",
	"disabled:bg-neutral-subtle disabled:cursor-not-allowed data-[selected=true]:disabled:bg-neutral-subtle",
	"data-[selected=true]:bg-selected-subtle data-[selected=true]:hover:bg-selected-subtle-hovered data-[selected=true]:active:bg-selected-subtle-pressed",
)

const iconAndTextBaseStyles = twJoin(
	"group-active:text-text group-disabled:text-text-disabled text-text-subtle flex items-center",
	"group-data-[selected=true]:text-selected-text group-data-[selected=true]:group-hover:text-selected-text group-data-[selected=true]:group-disabled:text-text-subtlest truncate text-base",
)

const descriptionBaseStyles =
	"text-text-subtle group-disabled:text-text-disabled truncate text-sm" as const

type _ContainerProps = Pick<
	ComponentPropsWithoutRef<"nav">,
	| "className"
	| "style"
	| "onClick"
	| "onKeyUp"
	| "tabIndex"
	| "role"
	| "children"
	| "id"
	| "aria-label"
> & {
	storeIdent?: string
}

function Container({
	className,
	children,
	"aria-label": ariaLabel = "Side navigation",
	role = "navigation",
	storeIdent = "side-nav-store",
	...props
}: _ContainerProps) {
	return (
		<nav
			className={twMerge(
				"bg-surface text-text-subtle relative flex size-full flex-col overflow-hidden truncate py-4",
				className,
			)}
			role={role}
			aria-label={ariaLabel}
			{...props}
		>
			{children}
		</nav>
	)
}

/**
 * Keeps the content of the side navigation, and makes it scrollable.
 */
function Content({
	children: _children,
	className,
	style,
	storeIdent = "side-nav-store",
}: {
	children: React.ReactNode
	className?: string
	style?: React.CSSProperties
	storeIdent?: string
}) {
	const ref = useRef<HTMLDivElement>(null)

	const children = React.Children.map(_children, (child) => {
		if (
			React.isValidElement<_NestableNavigationContentProps>(child) &&
			child.type === NestableNavigationContent
		) {
			return React.cloneElement(child, {
				_level: 0,
				_sideNavStoreIdent: storeIdent,
			})
		}
		return child
	})

	return (
		<div className="relative flex size-full flex-1 overflow-hidden">
			<div
				onScroll={(e) => {
					if (!(e.target instanceof HTMLDivElement)) return
					e.target.removeAttribute("data-separator-top")
					e.target.removeAttribute("data-separator-bottom")
					if (e.target.scrollTop > 0) {
						e.target.setAttribute("data-separator-top", "")
					}
					if (
						e.target.scrollTop <
						e.target.scrollHeight - e.target.clientHeight - 1
					) {
						e.target.setAttribute("data-separator-bottom", "")
					}
					e.target.style.setProperty(
						"--sidenav-separator-width",
						`calc(${e.target.clientWidth}px - 0.5rem)`,
					)
				}}
				ref={ref}
				className={twMerge(
					twJoin(
						"size-full overflow-auto px-2",
						"before:border-border-separator before:absolute before:left-0 before:top-0 before:w-[var(--sidenav-separator-width)] before:border-t-2 before:border-solid before:opacity-0 before:content-['']",
						"before:transition-opacity before:duration-100 data-[separator-top]:before:opacity-100",
						"after:border-border-separator after:absolute after:bottom-0 after:left-0 after:w-[var(--sidenav-separator-width)] after:border-b-2 after:border-solid after:opacity-0 after:content-['']",
						"after:transition-opacity after:duration-100 data-[separator-bottom]:after:opacity-100",
					),
					className,
				)}
				style={style}
			>
				{children}
			</div>
		</div>
	)
}

type _ButtonItemProps = Pick<
	ComponentPropsWithoutRef<"button">,
	| "className"
	| "style"
	| "onClick"
	| "onMouseDown"
	| "onMouseUp"
	| "onKeyUp"
	| "tabIndex"
	| "role"
	| "children"
	| "id"
	| "aria-label"
	| "disabled"
	| "title"
> & {
	description?: string
	iconBefore?: React.ReactNode
	iconAfter?: React.ReactNode
	titleClassName?: string
	titleStyle?: React.CSSProperties
	descriptionClassName?: string
	descriptionStyle?: React.CSSProperties
	selected?: boolean
	testId?: string
}

/**
 * A button item in a side navigation. Use the onClick action.
 */
export function ButtonItem({
	className,
	description,
	iconBefore,
	iconAfter,
	role = "button",
	titleClassName,
	titleStyle,
	descriptionClassName,
	descriptionStyle,
	selected,
	testId,
	children,
	...props
}: _ButtonItemProps) {
	return (
		<button
			className={twMerge(
				`${itemBaseStyles} ${description ? "py-2" : "py-3"}`,
				className,
			)}
			role={role}
			data-selected={selected}
			{...props}
		>
			{iconBefore && (
				<div className={`${iconAndTextBaseStyles} mr-2 flex-none`}>
					{iconBefore}
				</div>
			)}
			<div className="flex w-full flex-col truncate text-start">
				<div
					className={twMerge(iconAndTextBaseStyles, titleClassName)}
					style={titleStyle}
				>
					{children}
				</div>
				{description && (
					<span
						className={twMerge(
							descriptionBaseStyles,
							descriptionClassName,
						)}
						style={descriptionStyle}
					>
						{description}
					</span>
				)}
			</div>
			{iconAfter && (
				<div className={`${iconAndTextBaseStyles} ml-2 flex-none`}>
					{iconAfter}
				</div>
			)}
		</button>
	)
}

function GoBackItem({ children, ...props }: Omit<_ButtonItemProps, "icon">) {
	return (
		<ButtonItem
			iconBefore={
				<IconSizeHelper aria-hidden>
					<ArrowLeftCircleIcon label="" size="medium" />
				</IconSizeHelper>
			}
			{...props}
		>
			{children}
		</ButtonItem>
	)
}

type _LinkItemProps = Pick<
	ComponentPropsWithoutRef<"a">,
	| "className"
	| "style"
	| "onClick"
	| "onKeyUp"
	| "tabIndex"
	| "role"
	| "children"
	| "id"
	| "aria-label"
	| "href"
	| "rel"
	| "referrerPolicy"
	| "security"
	| "target"
	| "title"
> & {
	description?: string
	iconBefore?: React.ReactNode
	iconAfter?: React.ReactNode
	titleClassName?: string
	titleStyle?: React.CSSProperties
	descriptionClassName?: string
	descriptionStyle?: React.CSSProperties
	selected?: boolean
	disabled?: boolean
	testId?: string
}

function LinkItem({
	description,
	className,
	iconAfter,
	iconBefore,
	role = "link",
	titleClassName,
	titleStyle,
	descriptionClassName,
	descriptionStyle,
	selected,
	disabled,
	testId,
	children,
	...props
}: _LinkItemProps) {
	return (
		<a
			className={twMerge(
				`${itemBaseStyles} hover:no-underline`,
				className,
			)}
			{...props}
		>
			{iconBefore && (
				<div className={`${iconAndTextBaseStyles} mr-2`}>
					{iconBefore}
				</div>
			)}
			<div className="flex w-full flex-col truncate text-start">
				<div
					className={twMerge(iconAndTextBaseStyles, titleClassName)}
					style={titleStyle}
				>
					{children}
				</div>
				{description && (
					<span
						className={twMerge(
							descriptionBaseStyles,
							descriptionClassName,
						)}
						style={descriptionStyle}
					>
						{description}
					</span>
				)}
			</div>
			{iconAfter && (
				<div className={`${iconAndTextBaseStyles} ml-2`}>
					{iconAfter}
				</div>
			)}
		</a>
	)
}

type _SectionProps = {
	title: React.ReactNode
	children: React.ReactNode
	titleClassName?: string
	titleStyle?: React.CSSProperties
	hasSeparator?: boolean
	isList?: boolean
	className?: string
	style?: React.CSSProperties
}

/**
 *
 * hasSeparator: Whether to add a separator line between the title and the content.
 * isList: Whether to render the content as a list (ul with li elements).
 */
function Section({
	title,
	children,
	titleClassName,
	titleStyle,
	className,
	style,
	hasSeparator,
	isList,
}: _SectionProps) {
	return (
		<div
			className={twMerge(
				`flex flex-col gap-2 ${hasSeparator && "border-border border-t-2 border-solid"}`,
				className,
			)}
			style={style}
		>
			<h2
				className={twMerge(
					"text-text-subtle px-2 pt-4 text-xs font-bold uppercase",
					titleClassName,
				)}
				style={titleStyle}
			>
				{title}
			</h2>
			{isList ? (
				<ul className="m-0 flex list-none flex-col gap-2 p-0">
					{React.Children.map(children, (child) => (
						<li>{child}</li>
					))}
				</ul>
			) : (
				children
			)}
		</div>
	)
}

type _SkeletonItemProps = Pick<
	ComponentPropsWithoutRef<"div">,
	"className" | "style" | "role" | "children" | "id" | "aria-label"
> & {
	testId?: string
	shimmering?: boolean
	hasIconBefore?: boolean
	hasIconAfter?: boolean
	hasAvatarBefore?: boolean
	hasAvatarAfter?: boolean
}

function SkeletonItem({
	className,
	shimmering = true,
	hasIconBefore,
	hasIconAfter,
	hasAvatarBefore,
	hasAvatarAfter,
	...props
}: _SkeletonItemProps) {
	return (
		<div
			className={twMerge("flex items-center gap-4 px-2 py-4", className)}
			{...props}
		>
			{hasIconBefore && (
				<div
					className={`bg-skeleton h-6 w-6 flex-none rounded ${shimmering && "animate-pulse"}`}
				/>
			)}
			{hasAvatarBefore && (
				<div
					className={`bg-skeleton h-6 w-6 flex-none rounded-full ${shimmering && "animate-pulse"}`}
				/>
			)}
			<div
				className={`bg-skeleton h-3 w-full rounded ${shimmering && "animate-pulse"}`}
			/>
		</div>
	)
}

function NavigationFooter({
	children,
	className,
	style,
}: {
	children: React.ReactNode
	className?: string
	style?: React.CSSProperties
}) {
	return (
		<div
			className={twMerge(
				"box-border px-4 pb-3 pt-4 text-center text-xs",
				className,
			)}
			style={style}
		>
			{children}
		</div>
	)
}

function NavigationHeader({
	children,
	className,
	style,
}: {
	children: React.ReactNode
	className?: string
	style?: React.CSSProperties
}) {
	return (
		<div
			className={twMerge(
				"text-text box-border px-4 py-4 font-semibold",
				className,
			)}
			style={style}
		>
			{children}
		</div>
	)
}

type _NestingItemProps = {
	children: React.ReactNode
	className?: string
	style?: React.CSSProperties
	title: string // title is used to identify the item and as a key
	/* do not set the _level manually, it is used internally */
	_level?: number
	/* do not set the _sideNavStoreIdent manually, it is used internally */
	_sideNavStoreIdent?: string
}

function NestingItem({
	children,
	className,
	style,
	_level = 0,
	_sideNavStoreIdent,
}: _NestingItemProps) {
	const childrenWithLevel = React.Children.map(children, (child) => {
		if (
			React.isValidElement<_NestableNavigationContentProps>(child) &&
			child.type === NestableNavigationContent
		) {
			return React.cloneElement(child, {
				_level: _level + 1,
				_sideNavStoreIdent,
			})
		}
		return child
	})

	return (
		<Container
			className={className}
			style={style}
			aria-label="Nested side navigation"
		>
			{childrenWithLevel}
		</Container>
	)
}

const cssLeaveLeftTransitionClassNames: CSSTransitionProps["classNames"] = {
	enter: "duration-200 ease-in-out -translate-x-full",
	enterDone: "duration-200 ease-in-out translate-x-0",
	exit: "duration-200 ease-in-out translate-x-0",
	exitDone: "duration-200 ease-in-out -translate-x-full",
}

const cssEnterRightTransitionClassNames: CSSTransitionProps["classNames"] = {
	enter: "duration-200 ease-in-out translate-x-full",
	enterDone: "duration-200 ease-in-out translate-x-0",
	exit: "duration-200 ease-in-out translate-x-full",
	exitDone: "duration-200 ease-in-out translate-x-0",
}

type _NestableNavigationContentProps = {
	goBackLabel?: string
	children: React.ReactNode
	reserveHeight?: boolean
	/* do not set the _level manually, it is used internally */
	_level?: number
	/* do not set the _sideNavStoreIdent manually, it is used internally */
	_sideNavStoreIdent?: string
}

function NestableNavigationContent({
	goBackLabel = "Go Back",
	children,
	reserveHeight,
	_sideNavStoreIdent = "side-nav-store",
	_level = 0,
}: _NestableNavigationContentProps) {
	const { setPathElement, getPathElement } =
		useSideNavigationStore(_sideNavStoreIdent)

	const insideRef = useRef<HTMLDivElement>(null)
	const outsideRef = useRef<HTMLDivElement>(null)
	const currentOpenedTitle = getPathElement(_level)

	let renderChild: React.ReactElement<_NestingItemProps> | null = null
	const titles = React.Children.map(children, (child) => {
		if (
			!React.isValidElement<_NestingItemProps>(child) ||
			child.type !== NestingItem
		) {
			throw new Error(
				"NestableNavigationContent must only contain NestingItem components",
			)
		}
		if (child.props.title === currentOpenedTitle) {
			renderChild = React.cloneElement(child, {
				_level,
				_sideNavStoreIdent,
			})
		}
		return child.props.title
	})

	return (
		<TransitionGroup
			className={reserveHeight ? "size-full" : "w-full"}
			enter
			exit
		>
			{currentOpenedTitle && (
				<CSSTransition
					classNames={cssEnterRightTransitionClassNames}
					timeout={200}
					nodeRef={insideRef}
				>
					<div ref={insideRef} className="size-full">
						<GoBackItem
							onClick={() => setPathElement(undefined, _level)}
						>
							{goBackLabel} - {_level}
						</GoBackItem>
						<div className="border-b-border-separator border-t-border-separator flex size-full border-b-2 border-t-2 border-solid py-2">
							{renderChild}
						</div>
					</div>
				</CSSTransition>
			)}

			{!currentOpenedTitle && (
				<CSSTransition
					classNames={cssLeaveLeftTransitionClassNames}
					timeout={200}
					nodeRef={outsideRef}
				>
					<div
						ref={outsideRef}
						className={currentOpenedTitle ? "hidden" : "size-full"}
					>
						{titles?.map((title) => (
							<ButtonItem
								key={title}
								onClick={() => setPathElement(title, _level)}
								iconAfter={
									<IconSizeHelper>
										<ArrowRightCircleIcon
											label=""
											size="medium"
										/>
									</IconSizeHelper>
								}
							>
								{title}
							</ButtonItem>
						))}
					</div>
				</CSSTransition>
			)}
		</TransitionGroup>
	)
}

export const SideNavigation = {
	Container,
	Content,
	ButtonItem,
	GoBackItem,
	LinkItem,
	Section,
	SkeletonItem,
	NavigationFooter,
	NavigationHeader,
	NestingItem,
	NestableNavigationContent,
}

export namespace SideNavigation {
	export type ContainerProps = _ContainerProps
	export type ButtonItemProps = _ButtonItemProps
	export type LinkItemProps = _LinkItemProps
	export type SectionProps = _SectionProps
	export type SkeletonItemProps = _SkeletonItemProps
	export type NestingItemProps = _NestingItemProps
	export type NestableNavigationContentProps = _NestableNavigationContentProps
}
