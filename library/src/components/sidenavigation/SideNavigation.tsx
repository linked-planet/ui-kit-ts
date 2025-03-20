import React, { useRef, useState } from "react"
import type { ComponentPropsWithoutRef } from "react"
import { twJoin, twMerge } from "tailwind-merge"
import { useSideNavigationStore } from "./SideNavigationStore"
import { AnimatePresence, motion } from "motion/react"
import { flushSync } from "react-dom"
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"

const itemBaseStyles = twJoin(
	"px-1.5 data-[selected=true]:bg-neutral-subtle-hovered group flex w-full cursor-pointer select-none items-center overflow-hidden rounded-xs",
	"hover:bg-neutral-subtle-hovered active:bg-neutral-subtle-pressed border-transparent bg-transparent",
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
				"bg-surface text-text-subtle relative flex size-full flex-col overflow-hidden truncate",
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
						"before:transition-opacity before:duration-100 data-separator-top:before:opacity-100",
						"after:border-border-separator after:absolute after:bottom-0 after:left-0 after:w-[var(--sidenav-separator-width)] after:border-b-2 after:border-solid after:opacity-0 after:content-['']",
						"after:transition-opacity after:duration-100 data-separator-bottom:after:opacity-100",
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
				<ArrowLeftIcon
					strokeWidth={3}
					className="rounded-full p-1 bg-neutral-full size-5.5 text-text-inverse"
				/>
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
				`flex flex-col gap-2 box-border ${hasSeparator ? "border-border border-t-2 border-solid" : ""}`,
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
					className={`bg-skeleton h-6 w-6 flex-none rounded-xs ${shimmering && "animate-pulse"}`}
				/>
			)}
			{hasAvatarBefore && (
				<div
					className={`bg-skeleton h-6 w-6 flex-none rounded-full ${shimmering && "animate-pulse"}`}
				/>
			)}
			<div
				className={`bg-skeleton h-3 w-full rounded-xs ${shimmering && "animate-pulse"}`}
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
	sideNavStoreIdent?: string
	id: string
	onClick?: () => void
}

function NestingItem({
	children,
	className,
	style,
	sideNavStoreIdent = "default",
	title,
	onClick,
	_isOpen,
	id,
}: _NestingItemProps & { _isOpen?: boolean }) {
	const {
		getCurrentPathElement,
		pushPathElement,
		transitioning,
		setTransitioning,
	} = useSideNavigationStore(sideNavStoreIdent)

	//const isOpen = getCurrentPathElement() === title && transitioning === null*/
	if (_isOpen) {
		return (
			<Container
				className={className}
				style={style}
				aria-label="Nested side navigation"
			>
				{children}
			</Container>
		)
	}

	return (
		<ButtonItem
			onClick={() => {
				pushPathElement(id)
				setTransitioning(true)
				window.setTimeout(() => setTransitioning(null), animTime * 1000)
				onClick?.()
			}}
			iconAfter={
				<ArrowRightIcon
					strokeWidth={3}
					className="rounded-full p-1 box-border bg-neutral-full size-5.5 text-text-inverse"
				/>
			}
			id={id}
		>
			{title}
		</ButtonItem>
	)
}

type _NestableNavigationContentProps = {
	goBackLabel?: string
	children: React.ReactNode
	className?: string
	style?: React.CSSProperties
	sideNavStoreIdent?: string
	onAnimationStart?: () => void
	onAnimationComplete?: () => void
	onGoBackClick?: () => void
}

function searchChild(
	children: React.ReactNode,
	currentOpenedId: string | undefined,
) {
	let renderChild: React.ReactElement<_NestingItemProps> | null = null
	React.Children.forEach(children, (child) => {
		if (renderChild) return
		if (
			React.isValidElement<_NestingItemProps>(child) &&
			child.props.id === currentOpenedId
		) {
			renderChild = child
			return
		}
		if (React.isValidElement(child)) {
			const ret = searchChild(child.props.children, currentOpenedId)
			if (ret) renderChild = ret
		}
	})
	return renderChild
}

const animTime = 1

function NestableNavigationContent({
	goBackLabel = "Go Back",
	children,
	sideNavStoreIdent = "default",
	className,
	style,
	onAnimationStart,
	onAnimationComplete,
	onGoBackClick,
}: _NestableNavigationContentProps) {
	const { popPathElement, getCurrentPathElement, setTransitioning, path } =
		useSideNavigationStore(sideNavStoreIdent)

	const currentOpenedId = getCurrentPathElement()

	const renderChild = currentOpenedId
		? searchChild(children, currentOpenedId)
		: null

	const [isBack, setIsBack] = useState(false)

	return (
		<div
			className={twMerge("overflow-hidden size-full", className)}
			style={style}
		>
			<AnimatePresence initial={false} mode="popLayout">
				{/* root level elements */}
				{!currentOpenedId && (
					<motion.div
						key="outside"
						//layout
						initial={{ x: "-100%" }}
						animate={{ x: renderChild ? "-100%" : "0%" }}
						exit={{
							x: "-100%",
						}}
						transition={{
							duration: animTime,
							ease: "easeInOut",
						}}
						onAnimationStart={() => {
							onAnimationStart?.()
						}}
						onAnimationComplete={() => {
							onAnimationComplete?.()
						}}
					>
						{children}
					</motion.div>
				)}
			</AnimatePresence>
			<AnimatePresence initial={false} mode="popLayout">
				{currentOpenedId && (
					<motion.div
						key="go-back-btn"
						initial={{ x: "100%" }}
						animate={{ x: "0%" }}
						exit={{ x: "100%" }}
						transition={{
							duration: animTime,
							ease: "easeInOut",
						}}
					>
						<GoBackItem
							onClick={() => {
								setIsBack(true)
								// this setTimeout is required else the animation will not work correctly
								window.setTimeout(() => {
									flushSync(() => {
										const popped = popPathElement()
										if (popped) setTransitioning(popped)
										window.setTimeout(
											() => setTransitioning(null),
											animTime * 1000,
										)
									})
								}, 0)
								onGoBackClick?.()
							}}
						>
							{goBackLabel}
						</GoBackItem>
					</motion.div>
				)}
			</AnimatePresence>
			<AnimatePresence
				initial={false}
				mode="popLayout"
				onExitComplete={() => {
					setIsBack(false)
				}}
			>
				{/* followed by the lower level elements */}
				{renderChild != null && (
					<motion.div
						key={`inside-${currentOpenedId}`}
						initial={{
							x: isBack ? "-100%" : "100%",
						}}
						animate={{
							x: "0%",
						}}
						exit={{
							x: isBack ? "100%" : "-100%",
						}}
						transition={{
							duration: animTime,
							ease: "easeInOut",
							//delay: animTime * 0.5,
						}}
						className="border-b-border-separator border-t-border-separator box-border flex size-full border-b-2 border-t-2 border-solid"
						onAnimationStart={() => {
							onAnimationStart?.()
						}}
						onAnimationComplete={() => {
							onAnimationComplete?.()
						}}
					>
						{React.cloneElement(renderChild, { _isOpen: true })}
					</motion.div>
				)}
			</AnimatePresence>
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
