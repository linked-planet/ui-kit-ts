import React, { type CSSProperties, type ReactNode, useMemo } from "react"
import * as RDialog from "@radix-ui/react-dialog"
import { twMerge } from "tailwind-merge"
import { getPortal } from "../utils/getPortal"

type ModalDialogProps = {
	open?: boolean
	onOpenChange?: (open: boolean) => void
	trigger?: ReactNode
	children: ReactNode
	className?: string
	style?: CSSProperties
	shouldCloseOnEscapePress?: boolean
	shouldCloseOnOverlayClick?: boolean
	usePortal?: boolean
}

const blanketStyles =
	"fixed inset-0 bg-blanket ease-out transition-opacity duration-200 animate-fade-in"

function Container({
	shouldCloseOnEscapePress,
	shouldCloseOnOverlayClick,
	open = true,
	onOpenChange,
	trigger,
	className,
	style,
	usePortal = true,
	children,
}: ModalDialogProps) {
	const content = useMemo(
		() => (
			<>
				<RDialog.Overlay
					className={blanketStyles}
					role="presentation"
				/>
				<RDialog.Content
					className={twMerge(
						"xs:w-auto fixed left-1/2 top-16 z-0 w-full -translate-x-1/2",
						className,
					)}
					style={style}
					onEscapeKeyDown={
						!shouldCloseOnEscapePress
							? (e) => e.preventDefault()
							: undefined
					}
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
			shouldCloseOnEscapePress,
			shouldCloseOnOverlayClick,
			style,
		],
	)

	return (
		<RDialog.Root open={open} onOpenChange={onOpenChange}>
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
				"bg-surface relative z-0 flex items-center justify-between gap-4 p-5",
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
				"bg-surface shadow-overlay relative z-0 flex flex-1 justify-end gap-2 rounded-sm p-5",
				className,
			)}
			style={style}
		>
			{children}
		</footer>
	)
}

const titleStyles = "text-xl"
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
		<RDialog.Title
			className={twMerge(titleStyles, className)}
			style={style}
		>
			{children}
		</RDialog.Title>
	)
}

const bodyStyles = "px-5 z-[1] relative transform bg-surface"

function Body({
	className,
	style,
	children,
}: {
	className?: string
	style?: CSSProperties
	children: ReactNode
}) {
	return (
		<section className={twMerge(bodyStyles, className)} style={style}>
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
