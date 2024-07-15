import React from "react"
import type { ComponentPropsWithRef } from "react"
import { twJoin, twMerge } from "tailwind-merge"
import { inputBaseStyles } from "../styleHelper"

export type TextFieldProps = Pick<
	ComponentPropsWithRef<"textarea">,
	| "aria-label"
	| "aria-invalid"
	| "aria-describedby"
	| "placeholder"
	| "className"
	| "style"
	| "disabled"
	| "aria-disabled"
	| "value"
	| "defaultValue"
	| "onChange"
	| "onBlur"
	| "onFocus"
	| "onKeyDown"
	| "onKeyUp"
	| "onKeyPress"
	| "onClick"
	| "onDoubleClick"
	| "onMouseDown"
	| "onMouseUp"
	| "onMouseEnter"
	| "onMouseLeave"
	| "onMouseOver"
	| "onMouseOut"
	| "onFocus"
	| "onBlur"
	| "onKeyDown"
	| "onKeyPress"
	| "onKeyUp"
	| "onPointerDown"
	| "onTouchStart"
	| "onTouchEnd"
	| "onTouchMove"
	| "onTouchCancel"
	| "title"
	| "name"
	| "role"
> & {
	resize?: boolean
}

const additionalClassName = "m-0 py-1.5 px-2 outline-input-border-focused"

const TextField = React.forwardRef(
	(
		{ className, disabled, resize, ...props }: TextFieldProps,
		ref: React.ForwardedRef<HTMLTextAreaElement>,
	) => {
		return (
			<textarea
				ref={ref}
				disabled={disabled}
				rows={1}
				className={twMerge(
					twJoin(
						inputBaseStyles,
						additionalClassName,
						!resize && "resize-none",
					),
					className,
				)}
				{...props}
			/>
		)
	},
)

TextField.displayName = "TextField"
export { TextField }
