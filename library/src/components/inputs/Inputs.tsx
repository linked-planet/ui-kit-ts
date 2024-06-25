import React, {
	forwardRef,
	type ComponentPropsWithoutRef,
	type ForwardedRef,
	type CSSProperties,
	useImperativeHandle,
	useRef,
	useEffect,
	type ReactNode,
} from "react"
import { twJoin, twMerge } from "tailwind-merge"
import { SlidingErrorMessage } from "./SlidingErrorMessage"
import { inputBaseStyle } from "../styleHelper"

//#region Label
const labelNormalStyles =
	"text-text-subtlest block text-sm pb-1 pt-3 font-semibold"
const requiredStyles =
	"data-[required=true]:after:content-['*'] data-[required=true]:after:text-danger-bold data-[required=true]:after:ml-0.5"

const labelStyles = twJoin(labelNormalStyles, requiredStyles)
export function Label({
	required = false,
	className,
	...props
}: ComponentPropsWithoutRef<"label"> & { required?: boolean }) {
	return (
		<label
			data-required={required}
			className={twMerge(labelStyles, className)}
			{...props}
		/>
	)
}
//#endregion

//#region Input
const inputNormalStyles =
	"w-full text-left rounded border-0 border-transparent placeholder:text-text-subtlest placeholder:opacity-100 outline-none bg-transparent"

const inputDisabledStyles =
	"disabled:text-disabled-text disabled:cursor-not-allowed"

const inputStyles = twJoin(inputNormalStyles, inputDisabledStyles, "p-1 m-0")

export type InputProps = ComponentPropsWithoutRef<"input"> & {
	helpMessage?: ReactNode
	errorMessage?: ReactNode
	/* inputClassName targets the input element */
	inputClassName?: string
	inputStyle?: CSSProperties
	/* containerClassName targets the outer container which includes the error message */
	containerClassName?: string
	containerStyle?: CSSProperties
	/* className targets the div around the input and the icon */
	className?: string
	style?: CSSProperties
	/* helpMessageClassName targets the help message container p element */
	helpMessageClassName?: string
	helpMessageStyle?: CSSProperties
	/* errorMessageClassName targets the error message */
	errorMessageClassName?: string
	errorMessageStyle?: CSSProperties
	invalid?: boolean
	testId?: string
	iconAfter?: ReactNode
	active?: boolean
	onClick?: () => void
	appearance?: "default" | "subtle"
}

const Input = forwardRef(
	(
		{
			containerClassName,
			containerStyle,
			className,
			style,
			inputClassName,
			inputStyle,
			helpMessageClassName,
			helpMessageStyle,
			errorMessageClassName,
			errorMessageStyle,
			helpMessage,
			errorMessage,
			invalid = false,
			"aria-invalid": ariaInvalid = false,
			active = false,
			testId,
			iconAfter,
			disabled,
			appearance = "default",
			onClick,
			...props
		}: InputProps,
		ref: ForwardedRef<HTMLInputElement>,
	) => {
		const internalRef = useRef<HTMLInputElement>(null)
		const errorRef = useRef<HTMLDivElement>(null)
		useImperativeHandle(ref, () => internalRef.current as HTMLInputElement)

		useEffect(() => {
			const observer = new MutationObserver((mutationsList) => {
				for (const mutation of mutationsList) {
					if (
						mutation.type === "attributes" &&
						mutation.attributeName === "aria-invalid"
					) {
						const target = mutation.target as HTMLElement
						if (target.getAttribute("aria-invalid") === "true") {
							errorRef.current?.setAttribute(
								"aria-invalid",
								"true",
							)
						} else {
							errorRef.current?.setAttribute(
								"aria-invalid",
								"false",
							)
						}
					}
				}
			})
			if (internalRef.current) {
				observer.observe(internalRef.current, { attributes: true })
			}

			return () => {
				observer.disconnect()
			}
		}, [])

		return (
			<div className={containerClassName} style={containerStyle}>
				<div
					className={twJoin(
						"inline-flex",
						inputBaseStyle,
						appearance === "subtle"
							? "border-transparent bg-transparent"
							: undefined,
						"data-[active=true]:bg-input-active hover:data-[active=true]:bg-input-active",
						"hover:bg-input-hovered hover:focus-within:bg-input-active focus-within:bg-input-active",
						"data-[disabled=true]:bg-disabled data-[disabled=true]:cursor-not-allowed data-[disabled=true]:border-transparent",
						className,
					)}
					data-disabled={disabled}
					data-invalid={invalid}
					data-active={active}
					onClick={onClick}
					onKeyUp={(e) => {
						if (e.key === "Enter") {
							onClick?.()
						}
					}}
					style={style}
				>
					<input
						ref={internalRef}
						className={twMerge(
							inputNormalStyles,
							inputDisabledStyles,
							"m-0 px-1",
							inputClassName,
						)}
						style={inputStyle}
						aria-invalid={ariaInvalid || invalid}
						data-testid={testId}
						disabled={disabled}
						{...props}
					/>
					{iconAfter && iconAfter}
				</div>
				{helpMessage && (
					<p
						className={twMerge(
							"text-text-subtle text-2xs m-0 p-0 pt-1",
							helpMessageClassName,
						)}
						style={helpMessageStyle}
					>
						{helpMessage}
					</p>
				)}

				{errorMessage && (
					<SlidingErrorMessage
						ref={errorRef}
						invalid={invalid}
						aria-invalid={ariaInvalid}
						className={errorMessageClassName}
						style={errorMessageStyle}
					>
						{errorMessage}
					</SlidingErrorMessage>
				)}
			</div>
		)
	},
)
Input.displayName = "Input"

const memoizedInput = React.memo(Input)

export { memoizedInput as Input, inputStyles }
//#endregion
