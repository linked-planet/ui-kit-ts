import React, {
	type InputHTMLAttributes,
	forwardRef,
	useState,
	type ForwardedRef,
	ReactNode,
	useImperativeHandle,
	useRef,
	useEffect,
} from "react"
import { twMerge } from "tailwind-merge"
import CheckboxIcon from "@atlaskit/icon/glyph/checkbox"
import CheckboxIndeterminateIcon from "@atlaskit/icon/glyph/checkbox-indeterminate"
import { SlidingErrorMessage } from "./inputs/SlidingErrorMessage"

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
		labelStyle?: React.CSSProperties
		invalid?: boolean
		errorMessage?: ReactNode
		testId?: string
	}

const checkBoxStyles =
	"border-border focus:border-selected-border hover:border-selected-bold-hovered box-border flex flex-none h-[14px] w-[14px]  items-center justify-center mr-2 ease-linear transition duration-150 cursor-default rounded-[3px] border-[2.5px] outline-none outline-0 outline-offset-0 focus:border-2"

const disabledStyles =
	"cursor-not-allowed border-disabled hover:border-transparent" as const

const checkBoxCheckedStyles =
	"text-selected-bold hover:text-selected-bold-hovered border-selected-border opacity-100" as const
const checkBoxUncheckedStyles = "border-border text-transparent" as const
const checkBoxInvalidStyles = "border-danger-border" as const

//#region label styles
const labelStyles =
	"text-text-subtlest text-sm aria-disabled:text-disabled-text aria-required:after:content-['*'] aria-required:after:text-danger-bold aria-required:after:ml-0.5"
//#endregion

const CheckboxI = (
	{
		id,
		className,
		style,
		label,
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
	useImperativeHandle(ref, () => inputRef.current!)

	// update from outside
	if (
		checkedProp != undefined &&
		checked !== checkedProp &&
		inputRef.current
	) {
		inputRef.current.checked = checkedProp
		setChecked(checkedProp)
	}

	// this needs to be in a useEffect to check if the input is has the same state after react rendered the component, else the state will still have the old checked value
	// while something else (i.g. the form handling) has changed the checked value
	// this is needed because the input itself is not controlled by react
	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => {
		const checkedRef = inputRef.current?.checked
		if (checkedRef !== undefined && checkedRef != checked) {
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

		observer.observe(inputRef.current!, { attributes: true })

		return () => {
			observer.disconnect()
		}
	}, [])

	return (
		<>
			<div
				className={twMerge(
					"relative flex items-center justify-start",
					className,
				)}
				style={style}
			>
				<div
					className={twMerge(
						checkBoxStyles,
						checked
							? checkBoxCheckedStyles
							: checkBoxUncheckedStyles,
						invalid ? checkBoxInvalidStyles : undefined,
						disabled ? disabledStyles : undefined,
					)}
				>
					<div
						className={
							"pointer-events-none absolute flex items-center justify-center"
						}
					>
						{!indeterminate ? (
							<CheckboxIcon label="" />
						) : (
							<CheckboxIndeterminateIcon label="" />
						)}
					</div>
					<input
						type="checkbox"
						id={id}
						data-testid={testId}
						ref={inputRef}
						disabled={disabled}
						checked={!!checked}
						required={required}
						className={
							"absolute box-border h-[20px] w-[20px] appearance-none"
						}
						onChange={(e) => {
							if (checkedProp == undefined) {
								setChecked(e.target.checked)
							}
							onCheckedChange?.(e.target.checked)
							onChange?.(e)
						}}
						{...props}
					/>
				</div>

				<label
					htmlFor={id}
					aria-disabled={disabled}
					aria-required={required}
					aria-invalid={invalid}
					className={twMerge(labelStyles, labelClassName)}
					style={labelStyle}
					onClick={(e) => {
						if (disabled) {
							e.preventDefault()
							e.stopPropagation()
						}
						inputRef.current?.click()
					}}
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
