import React, { CSSProperties, useState } from "react"
import * as RCheckbox from "@radix-ui/react-checkbox"
import { twMerge } from "tailwind-merge"
import CheckboxIcon from "@atlaskit/icon/glyph/checkbox"
import CheckboxIndeterminateIcon from "@atlaskit/icon/glyph/checkbox-indeterminate"

const indeterminateState = "indeterminate" as const

type CheckboxProps = {
	label: React.ReactChild
	title?: string
	isChecked?: boolean
	defaultChecked?: boolean
	isDisabled?: boolean
	isInvalid?: boolean
	isRequired?: boolean
	isIndeterminate?: boolean
	autoFocus?: boolean
	name?: string
	onChange?: (checked: boolean) => void
	onCheckedChange?: (checked: boolean | typeof indeterminateState) => void
	style?: CSSProperties
	className?: string
}

const checkBoxStyles =
	"outline-brand-hovered box-border focus:border-brand-hovered mx-2 ease-linear duration-100 transition-colors flex flex-none h-[14px] w-[14px] cursor-default items-center justify-center rounded-sm border-[2.5px] outline-none outline-0 outline-offset-0 focus:border-2 disabled:border-disabled invalid:border-danger-bold" as const

const checkBoxCheckedStyles = "text-brand-bold border-brand-hovered" as const
const checkBoxUncheckedStyles = "border-border" as const
const checkBoxInvalidStyles = "border-danger-border" as const

const disabledLabelStyles = "text-disabled-text" as const
const requiredLabelStyles =
	'after:content-["*"] after:text-danger-bold-hovered' as const

function Checkbox({
	label,
	isChecked,
	defaultChecked,
	isDisabled,
	isInvalid,
	/**
	 * isIndeterminate is a special case where the checkbox is neither checked nor unchecked. It replaces the checked state by a different icon.
	 */
	isIndeterminate,
	isRequired,
	autoFocus,
	onChange,
	onCheckedChange,
	name,
	style,
	className,
}: CheckboxProps) {
	const [checked, setChecked] = useState<boolean | typeof indeterminateState>(
		isChecked ?? defaultChecked ?? false,
	)

	if (isIndeterminate) {
		if (isChecked !== undefined) {
			if (isChecked === true && checked !== indeterminateState) {
				setChecked(indeterminateState)
			} else if (!isChecked && checked !== false) {
				setChecked(false)
			}
		}
	} else {
		if (isChecked !== undefined && checked !== isChecked) {
			setChecked(isChecked ?? false)
		}
	}

	return (
		<div className={twMerge("flex items-center", className)}>
			<RCheckbox.Root
				name={name}
				style={style}
				checked={checked}
				disabled={isDisabled}
				aria-invalid={isInvalid}
				autoFocus={autoFocus}
				onCheckedChange={(e: RCheckbox.CheckedState) => {
					onCheckedChange?.(e)
					if (checked === indeterminateState) {
						if (e === true || e === indeterminateState) {
							setChecked(false)
							onChange?.(false)
							return
						}
					} else {
						if (isIndeterminate && e === true) {
							setChecked(indeterminateState)
						} else {
							setChecked(e)
						}
						onChange?.(!!e)
					}
				}}
				className={`${twMerge(
					checkBoxStyles,
					isInvalid ? checkBoxInvalidStyles : undefined,
				)} ${
					checked ? checkBoxCheckedStyles : checkBoxUncheckedStyles
				} `}
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
				aria-disabled={isDisabled}
				className={
					isDisabled
						? disabledLabelStyles
						: isRequired
						? requiredLabelStyles
						: undefined
				}
			>
				{label}
			</label>
		</div>
	)
}

const memoizedCheckbox = React.memo(Checkbox)
export { memoizedCheckbox as Checkbox }
