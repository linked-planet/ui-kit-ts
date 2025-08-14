import * as RDialog from "@radix-ui/react-dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import React, {
	type CSSProperties,
	type ElementRef,
	type ReactNode,
	useCallback,
	useEffect,
	useImperativeHandle,
	useMemo,
	useRef,
	useState,
} from "react"
import { twJoin, twMerge } from "tailwind-merge"
import usePortalContainer from "../utils/usePortalContainer"
import { Button } from "./Button"
import { overlayBaseStyle } from "./styleHelper"

type ModalDialogProps = {
	open?: boolean
	defaultOpen?: boolean
	onOpenChange?: (open: boolean) => void
	onEscapeKeyDown?: (event: KeyboardEvent) => void
	onKeyDown?: (event: React.KeyboardEvent<HTMLDivElement>) => void
	onKeyUp?: (event: React.KeyboardEvent<HTMLDivElement>) => void
	onWheel?: (event: React.WheelEvent<HTMLDivElement>) => void
	onTouchStart?: (event: React.TouchEvent<HTMLDivElement>) => void
	onTouchMove?: (event: React.TouchEvent<HTMLDivElement>) => void
	onTouchEnd?: (event: React.TouchEvent<HTMLDivElement>) => void
	onTouchCancel?: (event: React.TouchEvent<HTMLDivElement>) => void
	trigger?: ReactNode
	children: ReactNode
	className?: string
	style?: CSSProperties
	shouldCloseOnEscapePress?: boolean
	shouldCloseOnOverlayClick?: boolean
	usePortal?: boolean | ShadowRoot | HTMLElement
	useModal?: boolean
	id?: string
	triggerId?: string
	testId?: string
	triggerTestId?: string
	/** The accessible description for the dialog, is visually hidden but announced by screen readers */
	accessibleDialogTitle: string
	accessibleDialogDescription: string
	role?: RDialog.DialogContentProps["role"]
	tabIndex?: RDialog.DialogContentProps["tabIndex"]
	ref?: React.Ref<HTMLButtonElement>
	/** If true, the content will be mounted even when the modal is closed.
	 * This is useful if you want to keep the content in the DOM even when it is not visible.
	 * This is useful for animations.
	 */
	forceMountContent?: true
}

const blanketStyles =
	"fixed inset-0 bg-blanket ease-out transition-opacity duration-200 animate-fade-in"

const portalContainerId = "uikts-modal" as const

function Container({
	shouldCloseOnEscapePress = true,
	shouldCloseOnOverlayClick = true,
	open,
	onOpenChange,
	defaultOpen,
	trigger,
	className,
	style,
	usePortal = true,
	useModal = true,
	children,
	id,
	triggerId,
	testId,
	triggerTestId,
	role = "dialog",
	accessibleDialogDescription,
	accessibleDialogTitle,
	tabIndex = undefined,
	forceMountContent = undefined,
	ref,
	onKeyDown,
	onEscapeKeyDown,
	onKeyUp,
	onWheel,
	onTouchStart,
	onTouchMove,
	onTouchEnd,
	onTouchCancel,
}: ModalDialogProps) {
	const triggerRef = useRef<HTMLButtonElement>(null)
	// biome-ignore lint/style/noNonNullAssertion: safe if the trigger is used
	useImperativeHandle(ref, () => triggerRef.current!)

	const portalContainer: HTMLElement | null = usePortalContainer(
		usePortal,
		portalContainerId,
		triggerRef.current,
	)

	const content = useMemo(
		() => (
			<>
				{useModal ? (
					<RDialog.Overlay
						className={blanketStyles}
						role="presentation"
						id={`blanket-${id ?? "modal"}`}
						data-component="modal-blanket"
					/>
				) : (
					<div className={blanketStyles} />
				)}
				<RDialog.Content
					data-component="modal-content"
					className={twMerge(
						twJoin(
							overlayBaseStyle,
							"xs:min-w-min fixed left-1/2 top-16 z-0 flex max-h-[87svh] w-full min-w-full max-w-2xl -translate-x-1/2 flex-col",
						),
						className,
					)}
					style={style}
					onEscapeKeyDown={(e: KeyboardEvent) => {
						onEscapeKeyDown?.(e)
						if (!shouldCloseOnEscapePress) {
							e.preventDefault()
						}
					}}
					onInteractOutside={
						!shouldCloseOnOverlayClick
							? (e) => e.preventDefault()
							: undefined
					}
					id={id}
					onKeyDown={onKeyDown}
					onKeyUp={onKeyUp}
					onWheel={(e) => {
						e.stopPropagation() // this is necessary or scrolling will not work in the select dropdown menu in the modal
						onWheel?.(e)
					}}
					onTouchStart={onTouchStart}
					onTouchMove={onTouchMove}
					onTouchEnd={onTouchEnd}
					onTouchCancel={onTouchCancel}
					role={role}
					tabIndex={tabIndex}
					aria-describedby={accessibleDialogDescription}
					title={accessibleDialogDescription}
					forceMount={forceMountContent}
					data-testid={testId}
				>
					<VisuallyHidden>
						<RDialog.DialogTitle data-component="modal-title">
							{accessibleDialogTitle}
						</RDialog.DialogTitle>
						<RDialog.DialogDescription data-component="modal-description">
							{accessibleDialogDescription}
						</RDialog.DialogDescription>
					</VisuallyHidden>
					{children}
				</RDialog.Content>
			</>
		),
		[
			children,
			className,
			id,
			shouldCloseOnEscapePress,
			shouldCloseOnOverlayClick,
			style,
			testId,
			useModal,
			accessibleDialogDescription,
			role,
			tabIndex,
			accessibleDialogTitle,
			forceMountContent,
			onEscapeKeyDown,
			onKeyDown,
			onKeyUp,
			onWheel,
			onTouchStart,
			onTouchMove,
			onTouchEnd,
			onTouchCancel,
		],
	)

	return (
		<RDialog.Root
			open={open}
			defaultOpen={defaultOpen}
			onOpenChange={onOpenChange}
			modal={useModal}
		>
			{trigger && (
				<RDialog.Trigger
					data-component="modal-trigger"
					id={triggerId}
					data-testid={triggerTestId}
					asChild
					ref={triggerRef}
				>
					{typeof trigger === "string" ? (
						<Button>{trigger}</Button>
					) : (
						trigger
					)}
				</RDialog.Trigger>
			)}

			{usePortal ? (
				<RDialog.Portal
					container={portalContainer}
					data-component="modal-portal"
				>
					{content}
				</RDialog.Portal>
			) : (
				content
			)}
		</RDialog.Root>
	)
}

function Header({
	children,
	className,
	style,
	id,
	testId,
}: {
	children: ReactNode
	className?: string
	style?: CSSProperties
	id?: string
	testId?: string
}) {
	return (
		<header
			className={twMerge(
				"relative z-0 flex items-center justify-between gap-4 px-8 pt-7",
				className,
			)}
			style={style}
			id={id}
			data-testid={testId}
			data-component="modal-header"
		>
			{children}
		</header>
	)
}

function Footer({
	children,
	className,
	style,
	id,
	testId,
}: {
	children: ReactNode
	className?: string
	style?: CSSProperties
	id?: string
	testId?: string
}) {
	return (
		<footer
			className={twMerge(
				"flex-0 relative z-0 flex justify-end gap-2 overflow-auto px-8 pb-7 pt-2",
				className,
			)}
			style={style}
			id={id}
			data-testid={testId}
			data-component="modal-footer"
		>
			{children}
		</footer>
	)
}

function Title({
	children,
	className,
	style,
	id,
	testId,
}: {
	children: ReactNode
	className?: string
	style?: CSSProperties
	id?: string
	testId?: string
}) {
	return (
		<RDialog.Title
			className={twMerge("text-xl", className)}
			style={style}
			id={id}
			data-testid={testId}
			data-component="modal-title"
		>
			{children}
		</RDialog.Title>
	)
}

function Body({
	className,
	style,
	children,
	id,
	testId,
}: {
	className?: string
	style?: CSSProperties
	children: ReactNode
	id?: string
	testId?: string
}) {
	const ref = useRef<ElementRef<"section">>(null)

	const [showTopBorder, setShowTopBorder] = useState(false)
	const [showBottomBorder, setShowBottomBorder] = useState(false)

	const scrollbarCB = useCallback(() => {
		if (ref.current?.scrollTop) {
			setShowTopBorder(true)
		} else {
			setShowTopBorder(false)
		}

		if (
			ref.current?.scrollHeight != null &&
			ref.current?.clientHeight != null
		) {
			const bottomScroll =
				ref.current.scrollHeight - ref.current.scrollTop - 1 >=
				ref.current.clientHeight
			setShowBottomBorder(bottomScroll)
		}
	}, [])

	useEffect(() => {
		scrollbarCB()
	}, [scrollbarCB])

	return (
		<section
			className={twMerge(
				`${showTopBorder ? "border-t" : ""} ${
					showBottomBorder ? "border-b" : ""
				} border-border relative box-border flex h-full flex-1 flex-col overflow-auto px-8 py-4`,
				className,
			)}
			style={style}
			onScroll={scrollbarCB}
			ref={ref}
			id={id}
			data-testid={testId}
			data-component="modal-body"
		>
			{children}
		</section>
	)
}

function CloseTrigger(props: RDialog.DialogCloseProps) {
	return <RDialog.DialogClose asChild>{props.children}</RDialog.DialogClose>
}

const memoizedContainer = React.memo(Container)

export const Modal = {
	Container: memoizedContainer,
	Header,
	Title,
	Footer,
	CloseTrigger,
	Body,
}
