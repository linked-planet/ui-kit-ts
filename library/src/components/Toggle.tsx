import * as Switch from "@radix-ui/react-switch"
import React from "react"
import { twMerge } from "tailwind-merge"
import EditorDoneIcon from "@atlaskit/icon/glyph/editor/done"
import EditorCloseIcon from "@atlaskit/icon/glyph/editor/close"

export function Toggle({
	id,
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
				"bg-neutral-full hover:bg-neutral-full-pressed data-[state=checked]:bg-success-bold-hovered data-[state=checked]:hover:bg-success-bold-pressed relative mx-2 flex h-[16px] w-[32px] items-center overflow-hidden rounded-full p-0.5",
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
		>
			<span className="text-text-inverse flex h-4 w-5 flex-none items-center justify-center">
				<EditorDoneIcon label="" size="small" />
			</span>
			<Switch.Thumb className="bg-text-inverse text-text absolute my-auto block h-[12px] w-[12px] translate-x-[0.5px] rounded-full transition-transform duration-150 will-change-transform data-[state=checked]:translate-x-[16px]" />
			<span className="text-text-inverse flex h-4 w-5 items-center justify-center">
				<EditorCloseIcon label="" size="small" />
			</span>
		</Switch.Root>
	)
}