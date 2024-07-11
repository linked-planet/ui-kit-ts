import React, { useEffect, useRef } from "react"
import type { ComponentPropsWithoutRef } from "react"
import { twJoin, twMerge } from "tailwind-merge"
import ArrowLeftCircleIcon from "@atlaskit/icon/glyph/arrow-left-circle"
import { IconSizeHelper } from "./IconSizeHelper"

const itemBaseStyles =
	"hover:bg-neutral-subtle-hovered disabled:bg-neutral-subtle px-2 data-[selected=true]:bg-neutral-subtle-hovered data-[selected=true]:disabled:bg-neutral-subtle active:bg-selected-subtle text-text-subtle group flex w-full cursor-pointer select-none items-center overflow-hidden rounded p-1.5 disabled:cursor-not-allowed" as const

const iconBaseStyles =
	"group-active:text-selected-bold-pressed group-disabled:text-text-subtlest" as const

const titleBaseStyles =
	"text-text group-active:text-selected-bold-pressed group-data-[selected=true]:text-selected-bold-pressed group-data-[selected=true]:group-hover:text-text group-data-[selected=true]:group-disabled:text-text-subtlest group-disabled:text-text-subtlest truncate text-base" as const

const descriptionBaseStyles =
	"text-text-subtle group-disabled:text-text-subtlest truncate text-sm" as const

type SideNavigationProps = Pick<
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
>

function Container({
	className,
	children,
	"aria-label": ariaLabel = "Side navigation",
	role = "navigation",
	...props
}: SideNavigationProps) {
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
	children,
	className,
	style,
}: {
	children: React.ReactNode
	className?: string
	style?: React.CSSProperties
}) {
	const ref = useRef<HTMLDivElement>(null)

	return (
		<div className="relative flex size-full overflow-hidden">
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
						"overflow-auto px-2",
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

type ButtonItemProps = Pick<
	ComponentPropsWithoutRef<"button">,
	| "className"
	| "style"
	| "onClick"
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
function ButtonItem({
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
}: ButtonItemProps) {
	return (
		<button
			className={twMerge(itemBaseStyles, className)}
			role={role}
			data-selected={selected}
			{...props}
		>
			{iconBefore && (
				<div className={`${iconBaseStyles} mr-2`}>{iconBefore}</div>
			)}
			<div className="flex w-full flex-col truncate text-start">
				<div
					className={twMerge(titleBaseStyles, titleClassName)}
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
				<div className={`${iconBaseStyles} ml-2`}>{iconAfter}</div>
			)}
		</button>
	)
}

function GoBackItem({ children, ...props }: Omit<ButtonItemProps, "icon">) {
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

type LinkItemProps = Pick<
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
}: LinkItemProps) {
	return (
		<a
			className={twMerge(
				`${itemBaseStyles} hover:no-underline`,
				className,
			)}
			{...props}
		>
			{iconBefore && (
				<div className={`${iconBaseStyles} mr-2`}>{iconBefore}</div>
			)}
			<div className="flex w-full flex-col truncate text-start">
				<div
					className={twMerge(titleBaseStyles, titleClassName)}
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
				<div className={`${iconBaseStyles} ml-2`}>{iconAfter}</div>
			)}
		</a>
	)
}

type SectionProps = {
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
export function Section({
	title,
	children,
	titleClassName,
	titleStyle,
	className,
	style,
	hasSeparator,
	isList,
}: SectionProps) {
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
					"text-text-subtlest mb-2 px-2 pt-4 text-xs font-bold uppercase",
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

type SkeletonItemProps = Pick<
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
}: SkeletonItemProps) {
	return (
		<div
			className={twMerge("flex items-center gap-4 p-4", className)}
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

function Footer({
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
			className={twMerge("box-border px-2 pt-1.5", className)}
			style={style}
		>
			{children}
		</div>
	)
}

function Header({
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
			className={twMerge("box-border px-2 py-1.5", className)}
			style={style}
		>
			{children}
		</div>
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
	Footer,
	Header,
}
