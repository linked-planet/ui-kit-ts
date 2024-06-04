import type React from "react"
import {
	type CSSProperties,
	forwardRef,
	useCallback,
	useState,
	type ForwardedRef,
	useMemo,
} from "react"
import { Input } from "../Inputs"
import type { TimeType } from "../../../utils/DateUtils"
import { Dropdown, DropdownMenuProps } from "../../DropdownMenu"
import { DateUtils } from "@linked-planet/ui-kit-ts/utils"
import dayjs from "dayjs"
import { IconSizeHelper } from "../../IconSizeHelper"
import { Button } from "../../Button"
import SelectClearIcon from "@atlaskit/icon/glyph/select-clear"

type TimePickerProps = Pick<
	DropdownMenuProps,
	| "usePortal"
	| "modal"
	| "testId"
	| "side"
	| "sideOffset"
	| "align"
	| "alignOffset"
	| "id"
	| "onOpenChange"
	| "aria-label"
	| "open"
	| "defaultOpen"
	| "disabled"
> & {
	value?: TimeType
	defaultValue?: TimeType
	placeholder?: string
	readOnly?: boolean
	required?: boolean
	onChange?: (value: TimeType | undefined) => void
	className?: string
	style?: CSSProperties
	errorMessage?: string
	/* time take preference over startTime + intervall  */
	times?: TimeType[]
	startTime?: TimeType
	endTime?: TimeType
	/* intervall in minutes */
	interval?: number
	lang?: string
	clearButtonLabel?: string
}

const onInputChange = () => {}

const TimePickerBase = forwardRef(
	(
		{
			value: _value,
			defaultValue,
			placeholder = "Select a time",
			readOnly,
			required,
			onChange,
			side,
			sideOffset,
			align,
			alignOffset,
			id,
			"aria-label": ariaLabel,
			onOpenChange,
			testId,
			disabled,
			open: _open,
			defaultOpen = false,
			errorMessage,
			className,
			times: _times,
			startTime = "00:00",
			endTime = "00:00",
			interval = 60,
			lang,
			clearButtonLabel = "Clear Selection",
			style,
			usePortal = true,
			modal = false,
		}: TimePickerProps,
		ref: ForwardedRef<HTMLInputElement>,
	) => {
		const [value, setValue] = useState<TimeType | "">(
			_value ?? defaultValue ?? "",
		)
		const renderedValue = useMemo(() => {
			if (!value) return ""
			return DateUtils.formatTime(value, undefined, lang)
		}, [value, lang])
		const [open, setOpen] = useState(_open ?? defaultOpen)

		const onChangeCB = useCallback(
			(value: TimeType) => {
				setValue(value)
				onChange?.(value)
			},
			[onChange],
		)

		const times = useMemo(() => {
			if (_times) return _times
			const slots: TimeType[] = []
			const startHourMin = startTime
				.split(":")
				.map((it) => Number.parseInt(it) ?? 0)
			const endHourMin = endTime
				.split(":")
				.map((it) => Number.parseInt(it) ?? 0)
			let end = dayjs().hour(endHourMin[0]).minute(endHourMin[1])
			let curr = dayjs().hour(startHourMin[0]).minute(startHourMin[1])
			if (end.isSame(curr)) {
				end = end.add(1, "day")
			}

			while (curr.isBefore(end)) {
				slots.push(DateUtils.toTimeType(curr))
				curr = curr.add(interval, "minutes")
			}
			return slots
		}, [_times, startTime, endTime, interval])

		const trigger = useMemo(() => {
			return (
				<Input
					type="text"
					value={renderedValue}
					placeholder={placeholder}
					ref={ref}
					readOnly={readOnly}
					required={required}
					inputClassName="cursor-pointer"
					className={className}
					style={style}
					disabled={disabled}
					errorMessage={errorMessage}
					onChange={onInputChange}
					active={open}
					aria-readonly={readOnly}
					data-testId={testId}
					aria-label={ariaLabel}
					id={id}
					iconAfter={
						<>
							{value && !readOnly && (
								<div className="pointer-events-none">
									<Button
										appearance="link"
										className="text-disabled-text hover:text-text pointer-events-auto m-0 h-full w-8 px-1 py-0"
										onClick={(e) => {
											e.stopPropagation()
											setOpen(false)
											setValue("")
											onChange?.(undefined)
										}}
										label={clearButtonLabel}
									>
										<IconSizeHelper
											size="medium"
											className=""
										>
											<SelectClearIcon
												label=""
												size="small"
											/>
										</IconSizeHelper>
									</Button>
								</div>
							)}
						</>
					}
				/>
			)
		}, [
			renderedValue,
			placeholder,
			ref,
			readOnly,
			required,
			className,
			style,
			disabled,
			errorMessage,
			open,
			clearButtonLabel,
			testId,
		])

		const timeItems = useMemo(() => {
			const ret: JSX.Element[] = times.map((time) => {
				const timeStr = DateUtils.formatTime(time, undefined, lang)

				return (
					<Dropdown.Item
						key={time}
						onClick={() => setValue(time)}
						selected={value === time}
						onKeyUp={(e) => {
							if (e.key === "Enter") {
								setValue(time)
							}
						}}
					>
						{timeStr}
					</Dropdown.Item>
				)
			})
			return ret
		}, [times, lang, value])

		return (
			<Dropdown.Menu
				triggerComponent={trigger}
				usePortal={usePortal}
				onOpenChange={() => {
					setOpen(!open)
					onOpenChange?.(!open)
				}}
				open={open}
				side={side}
				sideOffset={sideOffset}
				align={align}
				alignOffset={alignOffset}
				disabled={disabled}
				modal={modal}
				triggerAsChild={true}
			>
				{timeItems}
			</Dropdown.Menu>
		)
	},
)

export function TimePicker(props: TimePickerProps) {
	return <TimePickerBase {...props} />
}
