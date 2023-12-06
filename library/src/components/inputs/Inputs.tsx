import React, {
	forwardRef,
	type ComponentPropsWithoutRef,
	ForwardedRef,
} from "react"
import { twJoin, twMerge } from "tailwind-merge"

//#region Label
const labelNormalStyles = "text-text-subtlest text-xs font-semibold"
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
const inputActiveStyles =
	"p-2 rounded border border-input-border bg-input ease-in-out transition duration-200"
const inputFocusStyles =
	"focus:border-selected-bold focus:bg-input-active outline-none hover:bg-input-hovered"
const inputDisabledStyles =
	"disabled:bg-disabled disabled:text-disabled-text disabled:cursor-not-allowed disabled:border-transparent"
const invalidInputStyles = "aria-invalid:border-danger-border"

const inputStyles = twJoin(
	inputActiveStyles,
	inputFocusStyles,
	inputDisabledStyles,
	invalidInputStyles,
)

const Input = forwardRef(
	(
		{ className, ...props }: ComponentPropsWithoutRef<"input">,
		ref: ForwardedRef<HTMLInputElement>,
	) => {
		return (
			<input
				ref={ref}
				className={twMerge(inputStyles, className)}
				{...props}
			/>
		)
	},
)
Input.displayName = "Input"

export { Input }
//#endregion
