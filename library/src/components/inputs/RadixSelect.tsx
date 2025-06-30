import * as RSelect from "@radix-ui/react-select"
import { ChevronDownIcon } from "lucide-react"
import {
	type CSSProperties,
	type ForwardedRef,
	forwardRef,
	useCallback,
	useMemo,
} from "react"
import { twJoin, twMerge } from "tailwind-merge"
import { getPortal } from "../../utils/getPortal"

type SelectOption = {
	label: string
	value: string
	disabled?: boolean
}

type SelectProps = {
	defaultOpen?: boolean
	open?: boolean
	id?: string
	defaultValue?: string
	value?: string
	name?: string
	placeholder?: string
	side?: RSelect.SelectContentProps["side"]
	align?: RSelect.SelectContentProps["align"]
	required?: boolean
	disabled?: boolean
	ref?: React.Ref<HTMLButtonElement>
	onChange?: (event: { target: { value: string; name: string } }) => void
	onValueChange?: (selectedValue: string) => void
	options: SelectOption[] | { [groupName: string]: SelectOption[] }
	className?: string
	contentClassName?: string
	style?: CSSProperties
	contentStyle?: CSSProperties
	usePortal?: boolean
}

const selectNormalStyles =
	"p-2 select-none text-left bg-input-active rounded-xs border border-input-border ease-in-out transition duration-200 flex items-center justify-between w-full"
const selectFocusStyles =
	"focus:border-selected-bold focus:bg-input-active outline-hidden hover:bg-input-hovered"
const selectDisabledStyles =
	"disabled:bg-disabled disabled:text-disabled-text disabled:cursor-not-allowed disabled:border-transparent"
const selectStyles = twJoin(
	selectNormalStyles,
	selectFocusStyles,
	selectDisabledStyles,
)

const selectGroupLabelStyles =
	"text-text-subtlest text-2xs font-[500] uppercase pt-4 pb-0.5 px-4" as const

const RadixSelect = forwardRef(
	(
		{
			defaultOpen,
			open,
			defaultValue,
			placeholder,
			value,
			side = "bottom",
			align = "start",
			name = "",
			required,
			disabled,
			onChange,
			onValueChange,
			options,
			className,
			contentClassName,
			contentStyle,
			style,
			usePortal,
			...props
		}: SelectProps,
		ref: ForwardedRef<HTMLButtonElement>,
	) => {
		const items = useMemo(() => {
			if (Array.isArray(options)) {
				const items = options.map((option) => {
					return (
						<SelectItem
							value={option.value}
							key={option.label}
							disabled={option.disabled}
						>
							{option.label}
						</SelectItem>
					)
				})
				return <RSelect.Group>{items}</RSelect.Group>
			}
			return Object.entries(options).map(([groupName, options]) => (
				<RSelect.Group key={groupName}>
					<RSelect.Label className={selectGroupLabelStyles}>
						{groupName}
					</RSelect.Label>
					{options.map((option) => {
						return (
							<SelectItem
								value={option.value}
								key={option.label}
								disabled={option.disabled}
							>
								{option.label}
							</SelectItem>
						)
					})}
				</RSelect.Group>
			))
		}, [options])

		const onValueChangeCB = useCallback(
			(newValue: string) => {
				onChange?.({ target: { value: newValue, name } })
				onValueChange?.(newValue)
			},
			[name, onChange, onValueChange],
		)

		const content = useMemo(
			() => (
				<RSelect.Content
					position="popper"
					side={side}
					align={align}
					className={twMerge(
						"bg-surface-raised shadow-overlay z-10 py-2",
						contentClassName,
					)}
					style={contentStyle}
				>
					{items}
				</RSelect.Content>
			),
			[align, contentClassName, contentStyle, items, side],
		)

		return (
			<RSelect.Root
				onValueChange={onValueChangeCB}
				open={open}
				defaultOpen={defaultOpen}
				defaultValue={defaultValue}
				value={value}
				required={required}
				disabled={disabled}
				name={name}
				{...props}
			>
				<RSelect.Trigger
					className={twMerge(selectStyles, className)}
					style={style}
					disabled={disabled}
					aria-required={required}
				>
					<RSelect.Value
						ref={ref}
						placeholder={
							<div className="text-disabled-text">
								{placeholder ?? "Select..."}
							</div>
						}
					/>

					<RSelect.Icon className="flex items-center justify-center">
						<ChevronDownIcon aria-label="open select" size="12" />
					</RSelect.Icon>
				</RSelect.Trigger>

				{usePortal ? (
					<RSelect.Portal container={getPortal("uikts-select")}>
						{content}
					</RSelect.Portal>
				) : (
					content
				)}
			</RSelect.Root>
		)
	},
)
RadixSelect.displayName = "RadixSelect"
export { RadixSelect }

const normalStyles =
	"px-4 normal-case font-normal text-sm text-text py-1.5 outline-hidden border-l-[2.5px] border-l-transparent cursor-pointer" as const
const hoverStyles =
	"hover:bg-surface-overlay-hovered active:bg-surface-overlay-pressed hover:border-l-selected-bold" as const
const selectedStyles =
	"data-[state=checked]:bg-selected-subtle data-[state=checked]:hover:bg-selected-subtle-hovered data-[state=checked]:active:bg-selected-subtle-pressed data-[state=checked]:border-l-selected-bold" as const

const selectItemStyle = twJoin(normalStyles, hoverStyles, selectedStyles)

const SelectItem = forwardRef(
	(
		{ children, className, ...props }: RSelect.SelectItemProps,
		forwardedRef: ForwardedRef<HTMLDivElement>,
	) => {
		return (
			<RSelect.Item
				//disabled={isDisabled}
				className={twMerge(selectItemStyle, className)}
				{...props}
				ref={forwardedRef}
			>
				<RSelect.ItemText>{children}</RSelect.ItemText>
			</RSelect.Item>
		)
	},
)
SelectItem.displayName = "SelectItem"
