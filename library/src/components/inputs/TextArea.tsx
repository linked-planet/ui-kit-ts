import React, { useImperativeHandle, useRef } from "react"
import type { ComponentPropsWithRef } from "react"
import { twJoin, twMerge } from "tailwind-merge"
import { inputBaseStyles } from "../styleHelper"
import {
	ErrorHelpWrapper,
	type ErrorHelpWrapperProps,
} from "./ErrorHelpWrapper"

export type TextAreaProps = Pick<
	ComponentPropsWithRef<"textarea">,
	| "aria-label"
	| "aria-invalid"
	| "aria-describedby"
	| "placeholder"
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
	| "minLength"
	| "maxLength"
> &
	ErrorHelpWrapperProps & {
		textAreaClassName?: string
		textAreaStyle?: React.CSSProperties
		invalid?: boolean
		testId?: string
	}

const additionalClassName = "m-0 py-1.5 px-2"

const TextArea = React.forwardRef(
	(
		{
			className,
			disabled,
			textAreaClassName,
			textAreaStyle,
			style,
			errorMessage,
			helpMessage,
			testId,
			errorMessageClassName,
			errorMessageStyle,
			helpMessageClassName,
			helpMessageStyle,
			"aria-invalid": ariaInvalid,
			invalid,

			...props
		}: TextAreaProps,
		ref: React.ForwardedRef<HTMLTextAreaElement>,
	) => {
		const internalRef = useRef<HTMLTextAreaElement>(null)
		useImperativeHandle(
			ref,
			() => internalRef.current as HTMLTextAreaElement,
		)

		return (
			<ErrorHelpWrapper
				errorMessage={errorMessage}
				helpMessage={helpMessage}
				aria-invalid={ariaInvalid || invalid}
				inputRef={internalRef}
				errorMessageClassName={errorMessageClassName}
				errorMessageStyle={errorMessageStyle}
				className={className}
				helpMessageClassName={helpMessageClassName}
				helpMessageStyle={helpMessageStyle}
				style={style}
			>
				<textarea
					ref={internalRef}
					disabled={disabled}
					rows={1}
					className={twMerge(
						twJoin(inputBaseStyles, additionalClassName),
						textAreaClassName,
					)}
					style={textAreaStyle}
					aria-invalid={ariaInvalid || invalid}
					data-testid={testId}
					{...props}
				/>
			</ErrorHelpWrapper>
		)
	},
)

TextArea.displayName = "TextArea"
export { TextArea }
