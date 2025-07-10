import { Popover as RPo } from "@base-ui-components/react/popover"
import { ChevronDownIcon, ChevronUpIcon, XIcon } from "lucide-react"
import { forwardRef, useCallback, useMemo, useRef } from "react"
import { twMerge } from "tailwind-merge"
import { usePortalContainer } from "../utils"
import { Button, type ButtonProps } from "./Button"

const _portalDivId = "uikts-popover" as const

type TriggerProps = RPo.Trigger.Props &
	ButtonProps & {
		hideChevron?: boolean
		chevronClassName?: string
		chevronStyle?: React.CSSProperties
	}

// this is basically a copy of the dropdown trigger
const _Trigger = forwardRef<HTMLButtonElement, TriggerProps>(
	(props: TriggerProps, ref) => {
		const {
			children,
			style,
			className,
			chevronClassName,
			chevronStyle,
			hideChevron = false,
			disabled,
			...rest
		} = props
		return (
			<Button
				ref={ref}
				className={twMerge(
					"group flex items-center justify-between",
					className,
				)}
				style={{
					...style,
				}}
				{...rest}
				disabled={disabled}
			>
				{children}
				<ChevronUpIcon
					size="16"
					strokeWidth={3}
					className={twMerge(
						"hidden text-text-subtlest hover:text-text disabled:text-text-disabled",
						hideChevron ? "" : "group-data-[state=open]:flex",
						chevronClassName,
					)}
					style={chevronStyle}
				/>

				<ChevronDownIcon
					size="16"
					strokeWidth={3}
					className={twMerge(
						"hidden text-text-subtlest hover:text-text disabled:text-text-disabled",
						hideChevron ? "" : "group-data-[state=closed]:flex",
						chevronClassName,
					)}
					style={chevronStyle}
				/>
			</Button>
		)
	},
)

type PositionerProps = Pick<
	RPo.Positioner.Props,
	"side" | "align" | "alignOffset" | "anchor"
>

export type PopoverProps = RPo.Root.Props & {
	portalRoot?: ShadowRoot
	triggerProps?: RPo.Trigger.Props & ButtonProps
	closerProps?: RPo.Close.Props
	testId?: string
	disabled?: boolean
	positionerProps?: PositionerProps
	popupProps?: RPo.Popup.Props
	/** hide the closer button on the top right corner */
	hideCloser?: true
}

// this is a copy of the dropdown menu root
function Root({
	portalRoot,
	open,
	defaultOpen,
	modal,
	children,
	triggerProps,
	closerProps,
	testId,
	onOpenChange,
	positionerProps,
	hideCloser,
	popupProps,
}: PopoverProps) {
	const content = useMemo(() => {
		const basicCloserClassName = "ml-auto"
		const closerCN = (state: RPo.Close.State) => {
			if (typeof closerProps?.className === "function") {
				return twMerge(
					basicCloserClassName,
					closerProps.className(state),
				)
			}
			return twMerge(basicCloserClassName, closerProps?.className)
		}

		const rndr =
			closerProps?.render ||
			((closerProps) => (
				<Button appearance="subtle" {...closerProps}>
					<XIcon size="12" />
				</Button>
			))
		const ret = (
			<>
				{!hideCloser && (
					<RPo.Close
						{...closerProps}
						className={closerCN}
						render={rndr}
					/>
				)}
				{/*_closer && (
					<div className="flex w-full justify-end">{_closer}</div>
				)}*/}
				{children}
			</>
		)
		return ret
	}, [children, closerProps, hideCloser])

	const triggerRef = useRef<HTMLButtonElement>(null)
	const portalContainer = usePortalContainer(
		portalRoot || true,
		_portalDivId,
		triggerRef.current,
	)

	const popupClassName = useCallback(
		(state: RPo.Popup.State) => {
			const basicClassName =
				"p-2 border-border rounded border-solid border"
			if (typeof popupProps?.className === "function") {
				return twMerge(basicClassName, popupProps.className(state))
			}
			return twMerge(basicClassName, popupProps?.className)
		},
		[popupProps?.className],
	)

	return (
		<RPo.Root
			open={open}
			defaultOpen={defaultOpen}
			modal={modal}
			onOpenChange={onOpenChange}
			data-testid={testId}
		>
			<RPo.Trigger {...triggerProps} ref={triggerRef} />
			<RPo.Portal container={portalContainer}>
				<RPo.Positioner {...positionerProps}>
					<RPo.Popup {...popupProps} className={popupClassName}>
						{content}
					</RPo.Popup>
				</RPo.Positioner>
			</RPo.Portal>
		</RPo.Root>
	)
}

const Close = RPo.Close

export const Popover = {
	Root,
	Close,
}
