import { Popover as RPo } from "@base-ui-components/react/popover"
import { ChevronDownIcon, ChevronUpIcon, XIcon } from "lucide-react"
import { forwardRef, useCallback, useMemo } from "react"
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
const _PopoverTrigger = forwardRef<HTMLButtonElement, TriggerProps>(
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
}

function Trigger({
	children,
	style,
	className,
	chevronClassName,
	chevronStyle,
	hideChevron = false,
	disabled,
	render,
	nativeButton = true,
	...rest
}: TriggerProps) {
	const classNameResolved = useCallback(
		(state: RPo.Trigger.State) => {
			const basicClassName = "group flex items-center justify-between"
			if (typeof className === "function") {
				// there seems to be a bug in the type of className ((() => string & string) - 16.07.2025, Markus)
				const cn = (className as (state: RPo.Trigger.State) => string)(
					state,
				)
				return twMerge(basicClassName, cn)
			}
			return twMerge(basicClassName, className)
		},
		[className],
	)

	const triggerContent = useMemo(() => {
		return (
			<>
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
			</>
		)
	}, [children, chevronClassName, chevronStyle, hideChevron])

	return (
		<RPo.Trigger
			className={classNameResolved}
			style={style}
			disabled={disabled}
			nativeButton={nativeButton}
			{...rest}
			render={
				render ??
				((g) => {
					if (nativeButton) {
						return <Button {...g}>{triggerContent}</Button>
					}
					return <div {...g}>{triggerContent}</div>
				})
			}
		/>
	)
}

export type PopupProps = RPo.Popup.Props & {
	portalRoot?: ShadowRoot
	closerProps?: RPo.Close.Props
	hideCloser?: true

	positionerProps?: PositionerProps
}

function Popup({
	children,
	portalRoot,
	positionerProps,
	className,
	closerProps,
	hideCloser,
	...props
}: PopupProps) {
	const classNameResolved = useCallback(
		(state: RPo.Popup.State) => {
			const basicClassName =
				"border-border rounded border-solid border bg-surface-overlay"
			if (typeof className === "function") {
				return twMerge(basicClassName, className(state))
			}
			return twMerge(basicClassName, className)
		},
		[className],
	)

	const popupContent = useMemo(() => {
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

	const portalContainer = usePortalContainer(portalRoot || true, _portalDivId)

	return (
		<RPo.Portal container={portalContainer}>
			<RPo.Positioner {...positionerProps}>
				<RPo.Popup {...props} className={classNameResolved}>
					{popupContent}
				</RPo.Popup>
			</RPo.Positioner>
		</RPo.Portal>
	)
}

function Root({
	portalRoot,
	open,
	defaultOpen,
	modal,
	children,
	onOpenChange,
	onOpenChangeComplete,
	openOnHover,
	...props
}: PopoverProps) {
	return (
		<RPo.Root
			open={open}
			defaultOpen={defaultOpen}
			modal={modal}
			onOpenChange={onOpenChange}
			onOpenChangeComplete={onOpenChangeComplete}
			openOnHover={openOnHover}
			{...props}
		>
			{children}
		</RPo.Root>
	)
}

//export { Popover, PopoverTrigger }

export const Popover = {
	Root,
	Trigger,
	Popup,
}
