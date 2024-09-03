import React, {
	forwardRef,
	type ComponentPropsWithoutRef,
	type ForwardedRef,
	type CSSProperties,
	useImperativeHandle,
	useRef,
	type ReactNode,
} from "react"
import { twJoin, twMerge } from "tailwind-merge"
import { inputBaseStyles } from "../styleHelper"
import { ErrorHelpWrapper } from "./ErrorHelpWrapper"

const inputNormalStyle =
	"text-left border-0 border-transparent placeholder:text-text-subtlest placeholder:opacity-100 outline-none bg-transparent"

const inputDisabledStyle =
	"disabled:text-disabled-text disabled:cursor-not-allowed"

const inputStyles = twJoin(inputNormalStyle, inputDisabledStyle, "p-1 m-0")

//#region Input
export type InputProps = ComponentPropsWithoutRef<"input"> & {
	helpMessage?: ReactNode
	errorMessage?: ReactNode
	/* inputClassName targets the input element */
	inputClassName?: string
	inputStyle?: CSSProperties
	/* className targets the div around the input and the help/error messages */
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
	appearance?: "default" | "subtle"
	iconAfter?: ReactNode
	iconBefore?: ReactNode
}

const Input = forwardRef(
	(
		{
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
			"aria-invalid": ariaInvalid = false,
			invalid,
			testId,
			disabled,
			appearance = "default",
			onClick,
			iconAfter,
			iconBefore,
			...props
		}: InputProps,
		ref: ForwardedRef<HTMLInputElement>,
	) => {
		const inputRef = useRef<HTMLInputElement>(null)
		useImperativeHandle(ref, () => inputRef.current as HTMLInputElement)

		const content = iconAfter ? (
			<div
				className={twJoin(
					"flex items-center",
					inputBaseStyles,
					inputClassName,
				)}
			>
				{iconBefore}
				<input
					ref={inputRef}
					className={twMerge(
						"m-0 px-[0.4rem] outline-none",
						inputClassName,
					)}
					style={{
						backgroundColor: "inherit",
						...inputStyle,
					}}
					aria-invalid={ariaInvalid || invalid}
					data-testid={testId}
					disabled={disabled}
					{...props}
				/>
				{iconAfter}
			</div>
		) : (
			<input
				ref={inputRef}
				className={twMerge(
					inputBaseStyles,
					"m-0 px-[0.4rem]",
					inputClassName,
				)}
				style={inputStyle}
				aria-invalid={ariaInvalid || invalid}
				data-testid={testId}
				disabled={disabled}
				{...props}
			/>
		)

		return (
			<ErrorHelpWrapper
				helpMessage={helpMessage}
				errorMessage={errorMessage}
				aria-invalid={ariaInvalid || invalid}
				inputRef={inputRef}
				errorMessageClassName={errorMessageClassName}
				errorMessageStyle={errorMessageStyle}
				className={className}
				helpMessageClassName={helpMessageClassName}
				helpMessageStyle={helpMessageStyle}
				style={style}
			>
				{content}
			</ErrorHelpWrapper>
		)
	},
)
Input.displayName = "Input"

const memoizedInput = React.memo(Input)

export { memoizedInput as Input, inputStyles }
//#endregion

//#region Fieldset
export type FieldsetProps = ComponentPropsWithoutRef<"fieldset"> & {
	legend?: ReactNode
	children?: ReactNode
	className?: string
	style?: CSSProperties
	legendClassName?: string
	legendStyle?: CSSProperties
}

export const Fieldset = ({
	className,
	style,
	legend,
	children,
	legendClassName,
	legendStyle,
	...props
}: FieldsetProps) => {
	return (
		<fieldset
			className={twMerge(
				"m-0 flex flex-col gap-2 border-0 p-0",
				className,
			)}
			style={style}
			{...props}
		>
			{legend && (
				<legend
					className={twMerge(
						"text-text-subtlest text-xs font-semibold",
						legendClassName,
					)}
					style={legendStyle}
				>
					{legend}
				</legend>
			)}
			{children}
		</fieldset>
	)
}

//#endregion
