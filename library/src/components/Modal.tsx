import React, {
	type CSSProperties,
	type ReactNode,
	useMemo,
	useRef,
	type ElementRef,
	useEffect,
	useState,
	useCallback,
} from "react"
import * as RDialog from "@radix-ui/react-dialog"
import { twMerge } from "tailwind-merge"
import { getPortal } from "../utils/getPortal"

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
	usePortal?: boolean
	useModal?: boolean
}

const blanketStyles =
	"fixed inset-0 bg-blanket ease-out transition-opacity duration-200 animate-fade-in"

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
}: ModalDialogProps) {
	const content = useMemo(
		() => (
			<>
				{useModal ? (
					<RDialog.Overlay
						className={blanketStyles}
						role="presentation"
						id="blanket"
					/>
				) : (
					<div className={blanketStyles} />
				)}
				<RDialog.Content
					className={twMerge(
						"xs:min-w-min bg-surface shadow-overflow fixed left-1/2 top-16 z-0 flex max-h-[87svh] w-full min-w-full max-w-2xl -translate-x-1/2 flex-col rounded",
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
				>
					{children}
				</RDialog.Content>
			</>
		),
		[
			children,
			className,
			onEscapeKeyDown,
			shouldCloseOnEscapePress,
			shouldCloseOnOverlayClick,
			style,
			useModal,
		],
	)

	return (
		<RDialog.Root
			open={open}
			defaultOpen={defaultOpen}
			onOpenChange={onOpenChange}
			modal={useModal}
		>
			{trigger && <RDialog.Trigger>{trigger}</RDialog.Trigger>}

			{usePortal ? (
				<RDialog.Portal container={getPortal("uikts-modal")}>
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
}: {
	children: ReactNode
	className?: string
	style?: CSSProperties
}) {
	return (
		<header
			className={twMerge(
				"relative z-0 flex items-center justify-between gap-4 px-8 pt-7",
				className,
			)}
			style={style}
		>
			{children}
		</header>
	)
}

function Footer({
	children,
	className,
	style,
}: {
	children: ReactNode
	className?: string
	style?: CSSProperties
}) {
	return (
		<footer
			className={twMerge(
				"flex-0 relative z-0 flex justify-end gap-2 overflow-auto px-8 pb-7 pt-2",
				className,
			)}
			style={style}
		>
			{children}
		</footer>
	)
}

function Title({
	children,
	className,
	style,
}: {
	children: ReactNode
	className?: string
	style?: CSSProperties
}) {
	return (
		<RDialog.Title className={twMerge("text-xl", className)} style={style}>
			{children}
		</RDialog.Title>
	)
}

function Body({
	className,
	style,
	children,
}: {
	className?: string
	style?: CSSProperties
	children: ReactNode
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
