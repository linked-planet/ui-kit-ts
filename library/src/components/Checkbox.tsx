import React, { CSSProperties, useState } from "react"
import * as RCheckbox from "@radix-ui/react-checkbox"
import { twJoin, twMerge } from "tailwind-merge"
import CheckboxIcon from "@atlaskit/icon/glyph/checkbox"
import CheckboxIndeterminateIcon from "@atlaskit/icon/glyph/checkbox-indeterminate"

const indeterminateState = "indeterminate" as const

type CheckboxProps = {
	label: React.ReactChild
	id?: string
	value?: string
	checked?: boolean | typeof indeterminateState
	title?: string
	defaultChecked?: boolean
	disabled?: boolean
	isInvalid?: boolean
	required?: boolean
	isIndeterminate?: boolean
	autoFocus?: boolean
	name?: string
	onChange?: (event: { target: { checked: boolean } }) => void
	onCheckedChange?: (checked: boolean | typeof indeterminateState) => void
	style?: CSSProperties
	className?: string
}

const checkBoxStyles =
	"box-border focus:border-selected-border mx-2 ease-linear transition duration-200 flex flex-none h-[14px] w-[14px] cursor-default items-center justify-center rounded-[3px] border-[2.5px] outline-none outline-0 outline-offset-0 focus:border-2 disabled:border-disabled invalid:border-danger-bold" as const

const checkBoxCheckedStyles =
	"text-selected-text border-selected-border" as const
const checkBoxUncheckedStyles = "border-border" as const
const checkBoxInvalidStyles = "border-danger-border" as const

const disabledLabelStyles = "aria-disabled:text-disabled-text" as const

const requiredLabelStyles =
	"aria-required:after:content-['*'] aria-required:after:text-danger-bold aria-required:after:ml-0.5"

function Checkbox({
	label,
	value,
	checked: checkedProp,
	defaultChecked,
	disabled,
	isInvalid,
	/**
	 * isIndeterminate is a special case where the checkbox is neither checked nor unchecked. It replaces the checked state by a different icon.
	 */
	isIndeterminate,
	required,
	autoFocus,
	onChange,
	onCheckedChange,
	name,
	style,
	className,
	...props
}: CheckboxProps) {
	const [checked, setChecked] = useState<boolean | typeof indeterminateState>(
		checkedProp ?? defaultChecked ?? false,
	)

	if (isIndeterminate) {
		if (checkedProp !== undefined || checkedProp !== undefined) {
			if (checkedProp === true && checked !== indeterminateState) {
				setChecked(indeterminateState)
			} else if (!checkedProp && checked !== false) {
				setChecked(false)
			}
		}
	} else {
		if (checkedProp !== undefined && checked !== checkedProp) {
			setChecked(checkedProp ?? false)
		}
	}

	return (
		<div className={twMerge("flex items-center", className)}>
			<RCheckbox.Root
				name={name}
				value={value}
				style={style}
				checked={checked}
				disabled={disabled}
				required={required}
				aria-invalid={isInvalid}
				autoFocus={autoFocus}
				onCheckedChange={(e: RCheckbox.CheckedState) => {
					onCheckedChange?.(e)
					if (checked === indeterminateState) {
						if (e === true || e === indeterminateState) {
							setChecked(false)
							onChange?.({ target: { checked: false } })
							return
						}
					} else {
						if (isIndeterminate && e === true) {
							setChecked(indeterminateState)
						} else {
							setChecked(e)
						}
						onChange?.({ target: { checked: !!e } })
					}
				}}
				className={`${twMerge(
					checkBoxStyles,
					isInvalid ? checkBoxInvalidStyles : undefined,
				)} ${
					checked ? checkBoxCheckedStyles : checkBoxUncheckedStyles
				} `}
				{...props}
			>
				<RCheckbox.Indicator className="relative box-border flex h-4 w-4 flex-none items-center justify-center">
					{typeof checked === "boolean" && checked === true && (
						<div className="absolute inset-0 flex items-center justify-center">
							<CheckboxIcon label="" />
						</div>
					)}
					{checked === indeterminateState && (
						<div className="absolute inset-0 flex items-center justify-center">
							<CheckboxIndeterminateIcon label="" />
						</div>
					)}
				</RCheckbox.Indicator>
			</RCheckbox.Root>
			<label
				aria-disabled={disabled}
				aria-required={required}
				className={twJoin(disabledLabelStyles, requiredLabelStyles)}
			>
				{label}
			</label>
		</div>
	)
}

const memoizedCheckbox = React.memo(Checkbox)
export { memoizedCheckbox as Checkbox }
