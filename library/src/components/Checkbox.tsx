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
import { twJoin, twMerge } from "tailwind-merge"
import CheckboxIcon from "@atlaskit/icon/glyph/checkbox"
import CheckboxIndeterminateIcon from "@atlaskit/icon/glyph/checkbox-indeterminate"

const indeterminateState = "indeterminate" as const

type CheckboxProps2 = Omit<
	InputHTMLAttributes<HTMLInputElement>,
	"type" | "checked"
> & {
	indeterminate?: boolean
	checked?: boolean | typeof indeterminateState
	label?: ReactNode
	invalid?: boolean
	onCheckedChange?: (checked: boolean) => void
}

const checkBoxStyles =
	"border-border focus:border-selected-border hover:border-selected-bold-hovered box-border flex flex-none h-[14px] w-[14px]  items-center justify-center mr-2 ease-linear transition duration-150 cursor-default rounded-[3px] border-[2.5px] outline-none outline-0 outline-offset-0 focus:border-2"

const disabledStyles = "cursor-not-allowed border-disabled" as const

const checkBoxCheckedStyles =
	"text-selected-bold hover:text-selected-bold-hovered border-selected-border opacity-100" as const
const checkBoxUncheckedStyles = "border-border text-transparent" as const
const checkBoxInvalidStyles = "border-danger-border" as const

//#region label styles
const disabledLabelStyles = "aria-disabled:text-disabled-text" as const

const requiredLabelStyles =
	"aria-required:after:content-['*'] aria-required:after:text-danger-bold aria-required:after:ml-0.5"
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
			onChange,
			onCheckedChange,
			...props
		}: CheckboxProps2,
		ref: ForwardedRef<HTMLInputElement>,
	) => {
		const [checked, setChecked] = useState(
			checkedProp ?? defaultChecked ?? false,
		)

		const inputRef = useRef<HTMLInputElement>(null)
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

		return (
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
						className={"absolute flex items-center justify-center"}
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
					className={twJoin(disabledLabelStyles, requiredLabelStyles)}
				>
					{label}
				</label>
			</div>
		)
	},
)
Checkbox.displayName = "Checkbox"

export { Checkbox }
