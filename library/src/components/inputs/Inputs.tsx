import React, {
	forwardRef,
	type ComponentPropsWithoutRef,
	ForwardedRef,
	type CSSProperties,
	useImperativeHandle,
	useRef,
	useEffect,
	ReactNode,
} from "react"
import { twJoin, twMerge } from "tailwind-merge"

//#region Label
const labelNormalStyles = "text-text-subtlest text-sm pb-1 pt-3 font-semibold"
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
	"p-2 w-full rounded border border-input-border bg-input ease-in-out transition duration-200"
const inputFocusStyles =
	"focus:border-selected-bold focus:bg-input-active outline-none hover:bg-input-hovered"
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
			...props
		}: ComponentPropsWithoutRef<"input"> & {
			helpMessage?: ReactNode
			errorMessage?: ReactNode
			inputClassName?: string
			invalid?: boolean
			inputStyle?: CSSProperties
		},
		ref: ForwardedRef<HTMLInputElement>,
	) => {
		const internalRef = useRef<HTMLInputElement>(null)
		const spanRef = useRef<HTMLParagraphElement>(null)
		useImperativeHandle(ref, () => internalRef.current!)

		useEffect(() => {
			// Function to be called when mutations are observed
			const observer = new MutationObserver((mutationsList) => {
				// Handle mutations here
				for (const mutation of mutationsList) {
					if (
						mutation.type === "attributes" &&
						mutation.attributeName === "aria-invalid"
					) {
						const target = mutation.target as HTMLElement
						if (target.getAttribute("aria-invalid") === "true") {
							spanRef.current?.setAttribute(
								"aria-invalid",
								"true",
							)
						} else {
							spanRef.current?.setAttribute(
								"aria-invalid",
								"false",
							)
						}
					}
				}
			})

			// Start observing the target node for configured mutations
			observer.observe(internalRef.current!, { attributes: true })

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
					{...props}
				/>
				{helpMessage && (
					<p className="text-text-subtle text-2xs m-0 p-0">
						{helpMessage}
					</p>
				)}
				{errorMessage && (
					<p
						ref={spanRef}
						aria-invalid={ariaInvalid || invalid ? "true" : "false"}
						className="text-danger-text text-2xs aria-invalid:scale-y-100 m-0 block origin-top scale-y-0 p-0 transition duration-200 ease-in-out"
					>
						{errorMessage}
					</p>
				)}
			</div>
		)
	},
)
Input.displayName = "Input"

const memoizedInput = React.memo(Input)

export { memoizedInput as Input }
//#endregion
