import { type IDetectedBarcode, Scanner } from "@yudiel/react-qr-scanner"
import { useCallback, useRef } from "react"
import { Modal } from "./Modal"
import { Button } from "./Button"
import { XIcon } from "lucide-react"

// react-qr-scanner does not work in SSR, so we need to use a client component

export function QrReader({
	className,
	style,
	onScan,
	allowMultiple = false,
	sound = true,
	onError,
}: {
	className?: string
	style?: React.CSSProperties
	onScan: (result: string[]) => void
	allowMultiple?: boolean
	sound?: boolean
	onError?: (error: Error) => void
}) {
	const onScanCB = useCallback(
		(result: IDetectedBarcode[]) => {
			const resultStrings = result.map((r) => r.rawValue)
			onScan(resultStrings)
		},
		[onScan],
	)

	const onErrorCB = useCallback(
		(error: unknown) => {
			console.log("QReader Error", error)
			if (error instanceof Error) {
				onError?.(error)
			}
		},
		[onError],
	)

	return (
		<div className={className} style={style}>
			<Scanner
				onScan={onScanCB}
				allowMultiple={allowMultiple}
				sound={sound}
				components={{
					torch: true,
					finder: true,
					zoom: true,
					onOff: false,
				}}
				scanDelay={0}
				onError={onErrorCB}
			/>
		</div>
	)
}

export function QrReaderDialog({
	title,
	description,
	open,
	defaultOpen,
	onOpenChange,
	shouldCloseOnEscapePress = true,
	shouldCloseOnOverlayClick = true,
	shouldCloseOnScan,
	accessibleDialogTitle,
	accessibleDialogDescription,
	trigger,
	usePortal = true,
	onScan,
	className,
	style,
}: {
	title?: React.ReactNode
	description?: React.ReactNode
	open?: boolean
	defaultOpen?: boolean
	onOpenChange?: (open: boolean) => void
	shouldCloseOnEscapePress?: boolean
	shouldCloseOnOverlayClick?: boolean
	shouldCloseOnScan: boolean
	accessibleDialogTitle: string
	accessibleDialogDescription: string
	trigger: React.ReactNode
	usePortal?: boolean
	onScan: (result: string[]) => void
	className?: string
	style?: React.CSSProperties
}) {
	const closeTriggerRef = useRef<HTMLButtonElement>(null)

	const onScanCB = useCallback(
		(result: string[]) => {
			onScan(result)
			if (shouldCloseOnScan) {
				closeTriggerRef.current?.click()
			}
		},
		[shouldCloseOnScan, onScan],
	)

	return (
		<Modal.Container
			trigger={
				typeof trigger === "string" ? (
					<Button className={className} style={style}>
						{trigger}
					</Button>
				) : (
					trigger
				)
			}
			usePortal={usePortal}
			accessibleDialogDescription={accessibleDialogDescription}
			open={open}
			defaultOpen={defaultOpen}
			onOpenChange={onOpenChange}
			shouldCloseOnEscapePress={shouldCloseOnEscapePress}
			shouldCloseOnOverlayClick={shouldCloseOnOverlayClick}
		>
			<Modal.Header>
				{title && (
					<Modal.Title accessibleDialogTitle={accessibleDialogTitle}>
						{title}
					</Modal.Title>
				)}
				<Modal.CloseTrigger asChild>
					<Button
						appearance="subtle"
						type="button"
						ref={closeTriggerRef}
						className="ml-auto"
					>
						<XIcon aria-label="Close popup" size="16" />
					</Button>
				</Modal.CloseTrigger>
			</Modal.Header>
			<Modal.Body>
				{description && <>{description}</>}
				<QrReader onScan={onScanCB} />
			</Modal.Body>
		</Modal.Container>
	)
}
