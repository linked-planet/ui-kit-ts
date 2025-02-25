import * as Switch from "@radix-ui/react-switch"
import { CheckIcon, XIcon } from "lucide-react"
import type React from "react"
import { twMerge } from "tailwind-merge"

export function Toggle({
	id,
	testId,
	value,
	onChange,
	label,
	name,
	isChecked,
	isDisabled,
	defaultChecked,
	className,
	style,
	onBlur,
	onFocus,
}: {
	id?: string
	testId?: string
	value?: string
	onChange?: (checked: boolean) => void
	label?: string
	name?: string
	isChecked?: boolean
	defaultChecked?: boolean
	isDisabled?: boolean
	className?: string
	style?: React.CSSProperties
	onBlur?: (event: React.FocusEvent<HTMLButtonElement, Element>) => void
	onFocus?: (event: React.FocusEvent<HTMLButtonElement, Element>) => void
}) {
	return (
		<Switch.Root
			id={id}
			className={twMerge(
				"border-none bg-neutral-full hover:bg-neutral-full-pressed data-[state=checked]:bg-success-bold-hovered data-[state=checked]:hover:bg-success-bold-pressed relative mx-1.5 p-0 flex h-4 w-9 items-center overflow-hidden rounded-full justify-between",
				className,
			)}
			style={style}
			onCheckedChange={onChange}
			checked={isChecked}
			defaultChecked={defaultChecked}
			disabled={isDisabled}
			aria-label={label ?? "toggle"}
			name={name}
			value={value}
			onBlur={onBlur}
			onFocus={onFocus}
			data-testid={testId}
		>
			<div className="text-icon-inverse flex flex-none items-center justify-center ml-0.5">
				<CheckIcon size="12" strokeWidth={3} />
			</div>
			<Switch.Thumb className="bg-icon-inverse text-text absolute left-0.75 my-auto block size-3 rounded-full transition-transform duration-150 will-change-transform data-[state=checked]:translate-x-4.5" />
			<div className="text-icon-inverse flex items-center justify-center mr-0.5">
				<XIcon size="12" strokeWidth={3} />
			</div>
		</Switch.Root>
	)
}
