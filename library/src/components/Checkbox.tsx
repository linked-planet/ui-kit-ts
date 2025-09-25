import { cx } from "class-variance-authority"
import { CheckIcon, MinusIcon } from "lucide-react"
import type React from "react"
import {
	type ForwardedRef,
	forwardRef,
	type InputHTMLAttributes,
	type ReactNode,
	useEffect,
	useId,
	useImperativeHandle,
	useRef,
	useState,
} from "react"
import { twMerge } from "tailwind-merge"
import { SlidingErrorMessage } from "./inputs/ErrorHelpWrapper"

type AdditionalCheckboxPropsWithIndeterminate = {
	checked?: boolean
	defaultChecked?: boolean
	onCheckedChange?: (checked: boolean) => void
	indeterminate: true
}

type AdditionalCheckboxPropsWithoutIndeterminate = {
	checked?: boolean
	defaultChecked?: boolean
	onCheckedChange?: (checked: boolean) => void
	indeterminate?: false
}

type CheckboxProps = Omit<
	InputHTMLAttributes<HTMLInputElement>,
	"type" | "checked" | "defaultChecked"
> &
	(
		| AdditionalCheckboxPropsWithIndeterminate
		| AdditionalCheckboxPropsWithoutIndeterminate
	) & {
		label?: ReactNode
		labelClassName?: string
		labelId?: string
		labelStyle?: React.CSSProperties
		invalid?: boolean
		errorMessage?: ReactNode
		testId?: string
	}

const checkBoxSize = "size-4 box-border" as const

const checkBoxStyles = cx(
	"bg-input m-0 p-0 hover:bg-input-hovered focus:bg-input-active border-border-bold border-solid border-2 box-border flex flex-none items-center justify-center ease-linear transition duration-150 cursor-default",
	"rounded-sm focus:outline-offset-2 focus:outline-2 focus:outline-brand-bold",
	checkBoxSize,
)

const disabledStyles =
	"disabled:cursor-not-allowed disabled:bg-disabled border-disabled" as const

const checkBoxInvalidStyles =
	"border-danger-border hover:border-danger-border checked:border-danger-border" as const

//#region label styles
const labelStyles =
	"text-text-subtle text-sm ml-0.5 aria-disabled:text-disabled-text aria-required:after:content-['*'] aria-required:after:text-danger-bold aria-required:after:ml-0.5"
//#endregion

const CheckboxI = (
	{
		id,
		className,
		style,
		label,
		labelId,
		disabled,
		required,
		checked: checkedProp,
		defaultChecked = false,
		indeterminate,
		invalid,
		errorMessage,
		onChange,
		onCheckedChange,
		labelClassName,
		labelStyle,
		"aria-invalid": ariaInvalid,
		testId,
		...props
	}: CheckboxProps,
	ref: ForwardedRef<HTMLInputElement>,
) => {
	const [checked, setChecked] = useState(checkedProp ?? defaultChecked)

	const inputRef = useRef<HTMLInputElement>(null)
	const errorRef = useRef<HTMLDivElement>(null)
	// forward the local ref to the forwarded ref
	// biome-ignore lint/style/noNonNullAssertion: is defined at this place
	useImperativeHandle(ref, () => inputRef.current!)

	// update from outside
	if (checkedProp != null && checked !== checkedProp && inputRef.current) {
		inputRef.current.checked = checkedProp
		setChecked(checkedProp)
	}

	// this needs to be in a useEffect to check if the input is has the same state after react rendered the component, else the state will still have the old checked value
	// while something else (i.g. the form handling) has changed the checked value
	// this is needed because the input itself is not controlled by react
	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => {
		const checkedRef = inputRef.current?.checked
		if (checkedRef !== undefined && checkedRef !== checked) {
			setChecked(checkedRef)
		}
	})

	useEffect(() => {
		const observer = new MutationObserver((mutationsList) => {
			for (const mutation of mutationsList) {
				if (
					mutation.type === "attributes" &&
					mutation.attributeName === "aria-invalid"
				) {
					const target = mutation.target as HTMLElement
					if (target.getAttribute("aria-invalid") === "true") {
						errorRef.current?.setAttribute("aria-invalid", "true")
					} else {
						errorRef.current?.setAttribute("aria-invalid", "false")
					}
				}
			}
		})

		if (inputRef.current) {
			observer.observe(inputRef.current, { attributes: true })
		}

		return () => {
			observer.disconnect()
		}
	}, [])

	const bid = useId()

	return (
		<>
			<div
				className={twMerge(
					"flex items-center justify-start gap-x-1",
					className,
				)}
				style={style}
			>
				<div className={"relative flex items-center justify-center"}>
					<input
						type="checkbox"
						id={id ?? bid}
						data-testid={testId}
						ref={inputRef}
						disabled={disabled}
						checked={!!checked}
						required={required}
						className={twMerge(
							"appearance-none",
							checkBoxStyles,
							invalid ? checkBoxInvalidStyles : undefined,
							disabled ? disabledStyles : undefined,
						)}
						onChange={(e) => {
							if (checkedProp == null) {
								setChecked(e.target.checked)
							}
							onCheckedChange?.(e.target.checked)
							onChange?.(e)
						}}
						{...props}
					/>

					<div
						className={`flex justify-center items-center absolute inset-0 border-2 border-solid border-transparent ${invalid ? "border-danger-bold" : undefined} pointer-events-none duration-150 ease-linear ${checked ? "bg-brand-bold" : "bg-transparent"} rounded-sm`}
					>
						{!indeterminate ? (
							<CheckIcon
								className={`size-3 duration-150 ease-linear text-text-inverse ${checked ? null : "opacity-0"}`}
								style={{
									strokeWidth: 4,
								}}
							/>
						) : (
							<MinusIcon
								className={`size-3 duration-150 ease-linear text-text-inverse ${checked ? null : "opacity-0"}`}
								style={{
									strokeWidth: 4,
								}}
							/>
						)}
					</div>
				</div>

				<label
					htmlFor={id ?? bid}
					id={labelId}
					aria-disabled={disabled}
					aria-invalid={invalid}
					className={twMerge(labelStyles, labelClassName)}
					style={labelStyle}
				>
					{label}
				</label>
			</div>
			{errorMessage && (
				<SlidingErrorMessage
					ref={errorRef}
					invalid={invalid}
					aria-invalid={ariaInvalid}
				>
					{errorMessage}
				</SlidingErrorMessage>
			)}
		</>
	)
}

CheckboxI.displayName = "Checkbox"

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(CheckboxI)

export { Checkbox }
