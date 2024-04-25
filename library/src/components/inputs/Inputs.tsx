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
const inputNormalStyles =
	"p-1 w-full box-border rounded border-2 border-solid border-input-border placeholder:text-text-subtlest bg-input ease-in-out transition duration-200"
const inputFocusStyles =
	"focus:border-input-border-focused focus:bg-input-active outline-none hover:bg-input-hovered"
const inputDisabledStyles =
	"disabled:bg-disabled disabled:text-disabled-text disabled:cursor-not-allowed disabled:border-transparent"
const invalidInputStyles = "aria-invalid:border-danger-border"

const inputStyles = twJoin(
	inputNormalStyles,
	inputFocusStyles,
	inputDisabledStyles,
	invalidInputStyles,
)

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
			testId,
			...props
		}: ComponentPropsWithoutRef<"input"> & {
			helpMessage?: ReactNode
			errorMessage?: ReactNode
			inputClassName?: string
			invalid?: boolean
			inputStyle?: CSSProperties
			testId?: string
		},
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
				<input
					ref={internalRef}
					className={twMerge(inputStyles, inputClassName)}
					style={inputStyle}
					aria-invalid={ariaInvalid || invalid}
					data-testid={testId}
					{...props}
				/>
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
