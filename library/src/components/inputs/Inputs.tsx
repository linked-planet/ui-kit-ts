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

//#region Label
const labelNormalStyles =
	"text-text-subtlest block text-sm pb-1 pt-3 font-semibold"
const requiredStyles =
	"aria-required:after:content-['*'] aria-required:after:text-danger-bold aria-required:after:ml-0.5"
const invalidStyles = "aria-invalid:text-danger-text"

const labelStyles = twJoin(labelNormalStyles, requiredStyles, invalidStyles)
export function Label({
	required = false,
	className,
	...props
}: ComponentPropsWithoutRef<"label"> & { required?: boolean }) {
	return (
		<label
			aria-required={required}
			className={twMerge(labelStyles, className)}
			{...props}
		/>
	)
}
//#endregion

//#region Input
const inputContainerBorderBeforeStyles =
	"m-[0.05rem] rounded border border-input-border before:pointer-events-none before:z-10 before:content-[''] before:absolute before:-inset-0.5 before:box-border focus-within:before:border-2 before:border-1 focus-within:before:border-input-border-focused before:rounded"
const inputActiveContainerBorderBeforeStyles =
	"data-[active=true]:before:border-2 data-[active=true]:before:border-input-border-focused"

const inputContainerColorDivStyles =
	"w-full relative bg-input ease-in-out hover:bg-input-hovered hover:focus-within:bg-input-active transition duration-200 focus-within:bg-input-active data-[disabled]:bg-input-disabled p-0"
const inputContainerActiveColorDivStyles =
	"data-[active=true]:bg-input-active hover:data-[active=true]:bg-input-active"

const inputNormalStyles =
	"w-full text-left rounded placeholder:text-text-subtlest placeholder:opacity-100 outline-none bg-transparent"

const inputDisabledStyles =
	"disabled:text-disabled-text disabled:cursor-not-allowed"

const invalidInputStyles =
	"data-[invalid=true]:before:border-danger-border data-[invalid=true]:before:border-2"

const inputContainerDivStyles = twJoin(
	inputContainerBorderBeforeStyles,
	inputContainerColorDivStyles,
	"data-[disabled=true]:bg-disabled data-[disabled=true]:border-transparent data-[disabled=true]:cursor-not-allowed",
	invalidInputStyles,
)

const inputStyles = twJoin(inputNormalStyles, inputDisabledStyles, "p-1 m-0")

export type InputProps = ComponentPropsWithoutRef<"input"> & {
	helpMessage?: ReactNode
	errorMessage?: ReactNode
	inputClassName?: string
	invalid?: boolean
	inputStyle?: CSSProperties
	testId?: string
	iconAfter?: ReactNode
	active?: boolean
}

const Input = forwardRef(
	(
		{
			className,
			inputClassName,
			helpMessage,
			errorMessage,
			invalid = false,
			"aria-invalid": ariaInvalid = false,
			style,
			inputStyle,
			active = false,
			testId,
			iconAfter,
			disabled,
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
			<div className={className} style={style}>
				<div
					className={twJoin(
						"inline-flex",
						active
							? inputActiveContainerBorderBeforeStyles
							: undefined,
						active ? inputContainerActiveColorDivStyles : undefined,
						inputContainerDivStyles,
					)}
					data-disabled={disabled}
					data-invalid={invalid}
					data-active={active}
					onClick={onClick}
				>
					<input
						ref={internalRef}
						className={twMerge(inputStyles, "p-1", inputClassName)}
						style={inputStyle}
						aria-invalid={ariaInvalid || invalid}
						data-testid={testId}
						disabled={disabled}
						{...props}
					/>
					{iconAfter && iconAfter}
				</div>
				{helpMessage && (
					<p className="text-text-subtle text-2xs m-0 p-0">
						{helpMessage}
					</p>
				)}

				{errorMessage && (
					<SlidingErrorMessage
						ref={errorRef}
						invalid={invalid}
						aria-invalid={ariaInvalid}
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
