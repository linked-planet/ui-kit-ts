import EditorCloseIcon from "@atlaskit/icon/glyph/editor/close"
import EditorDoneIcon from "@atlaskit/icon/glyph/editor/done"
import * as Switch from "@radix-ui/react-switch"
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
				"bg-neutral-full hover:bg-neutral-full-pressed data-[state=checked]:bg-success-bold-hovered data-[state=checked]:hover:bg-success-bold-pressed relative mx-1.5 flex h-[15px] w-[32px] items-center overflow-hidden rounded-full",
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
			<span className="text-icon-inverse flex flex-none items-center justify-center">
				<EditorDoneIcon label="" size="small" />
			</span>
			<Switch.Thumb className="bg-icon-inverse text-text absolute left-[2px] my-auto block h-[12px]  w-[12px] rounded-full transition-transform duration-150 will-change-transform data-[state=checked]:translate-x-[16px]" />
			<span className="text-icon-inverse flex items-center justify-center">
				<EditorCloseIcon label="" size="small" />
			</span>
		</Switch.Root>
	)
}
