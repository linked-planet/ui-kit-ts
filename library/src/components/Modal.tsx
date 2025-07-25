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
	trigger?: ReactNode
	children: ReactNode
	className?: string
	style?: CSSProperties
	shouldCloseOnEscapePress?: boolean
	shouldCloseOnOverlayClick?: boolean
	usePortal?: boolean | ShadowRoot
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
	onEscapeKeyDown,
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
						id={`blanket-${id}`}
					/>
				) : (
					<div className={blanketStyles} />
				)}
				<RDialog.Content
					className={twMerge(
						twJoin(
							overlayBaseStyle,
							"xs:min-w-min fixed left-1/2 top-16 z-0 flex max-h-[87svh] w-full min-w-full max-w-2xl -translate-x-1/2 flex-col",
						),
						className,
					)}
					style={style}
					onEscapeKeyDown={(e) => {
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
					data-testid={testId}
					onWheel={(e) => {
						e.stopPropagation() // this is necessary or scrolling will not work in the select dropdown menu in the modal
					}}
					role={role}
					tabIndex={tabIndex}
					aria-describedby={accessibleDialogDescription}
					title={accessibleDialogDescription}
					forceMount={forceMountContent}
				>
					<VisuallyHidden>
						<RDialog.DialogTitle>
							{accessibleDialogTitle}
						</RDialog.DialogTitle>
						<RDialog.DialogDescription>
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
			onEscapeKeyDown,
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
				<RDialog.Portal container={portalContainer}>
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
	/** The accessible title for the dialog, is visually hidden but announced by screen readers */
	accessibleDialogTitle: string
}) {
	return (
		<RDialog.Title
			className={twMerge("text-xl", className)}
			style={style}
			id={id}
			data-testid={testId}
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
