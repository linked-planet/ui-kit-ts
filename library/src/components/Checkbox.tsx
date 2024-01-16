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

const indeterminateState = "indeterminate" as const

type CheckboxProps2 = Omit<
	InputHTMLAttributes<HTMLInputElement>,
	"type" | "checked"
> & {
	indeterminate?: boolean
	checked?: boolean | typeof indeterminateState
	label?: ReactNode
	onCheckedChange?: (checked: boolean) => void
	labelClassName?: string
	labelStyle?: React.CSSProperties
	invalid?: boolean
	errorMessage?: ReactNode
}

const checkBoxStyles =
	"border-border focus:border-selected-border hover:border-selected-bold-hovered box-border flex flex-none h-[14px] w-[14px]  items-center justify-center mr-2 ease-linear transition duration-150 cursor-default rounded-[3px] border-[2.5px] outline-none outline-0 outline-offset-0 focus:border-2"

const disabledStyles = "cursor-not-allowed border-disabled" as const

const checkBoxCheckedStyles =
	"text-selected-bold hover:text-selected-bold-hovered border-selected-border opacity-100" as const
const checkBoxUncheckedStyles = "border-border text-transparent" as const
const checkBoxInvalidStyles = "border-danger-border" as const

//#region label styles
const labelStyles =
	"text-text-subtlest text-sm aria-disabled:text-disabled-text aria-required:after:content-['*'] aria-required:after:text-danger-bold aria-required:after:ml-0.5"
//#endregion

const Checkbox = forwardRef(
	(
		{
			id,
			className,
			style,
			label,
			disabled,
			required,
			checked: checkedProp,
			defaultChecked,
			indeterminate: indeterminateProp,
			invalid,
			errorMessage,
			onChange,
			onCheckedChange,
			labelClassName,
			labelStyle,
			"aria-invalid": ariaInvalid,
			...props
		}: CheckboxProps2,
		ref: ForwardedRef<HTMLInputElement>,
	) => {
		const [checked, setChecked] = useState(
			checkedProp ?? defaultChecked ?? false,
		)

		const inputRef = useRef<HTMLInputElement>(null)
		const errorRef = useRef<HTMLDivElement>(null)
		// forward the local ref to the forwarded ref
		useImperativeHandle(ref, () => inputRef.current!)

		// update from outside
		if (checkedProp !== undefined && checked !== checkedProp) {
			setChecked(checkedProp)
		}

		const indeterminate =
			indeterminateProp ?? checked === indeterminateState

		// this needs to be in a useEffect to check if the input is checked after react rendered the component, else it will still have the old checked value
		// this is needed because the input is not controlled by react
		// eslint-disable-next-line react-hooks/exhaustive-deps
		useEffect(() => {
			const checked = inputRef.current?.checked
			setChecked(checked ?? false)
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
								"absolute flex items-center justify-center"
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
							ref={inputRef}
							disabled={disabled}
							checked={!!checked}
							required={required}
							className={"mr-2 opacity-0"}
							onChange={(e) => {
								onCheckedChange?.(e.target.checked)
								onChange?.(e)
								setChecked(e.target.checked)
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
	},
)
Checkbox.displayName = "Checkbox"

export { Checkbox }
