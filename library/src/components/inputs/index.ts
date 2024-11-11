export { Label } from "./Label"
export { Input, Fieldset } from "./Inputs"
//export { RadixSelect } from "./RadixSelect"
export { Select } from "./Select"
export { components as selectComponents } from "react-select"
export { DatePicker } from "./datetimepicker/DatePicker"
export { TimePicker } from "./datetimepicker/TimePicker"
export { DateTimePicker } from "./datetimepicker/DateTimePicker"
export { TextArea } from "./TextArea"

export type {
	DatePickerProps,
	DatePickerInFormProps,
} from "./datetimepicker/DatePicker"

export type {
	TimePickerProps,
	TimePickerInFormProps,
} from "./datetimepicker/TimePicker"

export type {
	DateTimePickerProps,
	DateTimePickerInFormProps,
} from "./datetimepicker/DateTimePicker"

export type {
	SelectProps,
	SelectInFormProps,
	SelectClassNamesConfig,
	OptionGroupType,
	OptionType,
	SelectAriaOnChange,
	SelectAriaOnFilter,
	SelectAriaOnFocus,
	SelectAriaGuidance,
	SelectAriaLiveMessages,
} from "./Select"

import type * as rselect from "react-select"
import type { OptionType, OptionGroupType } from "./Select"
export namespace SelectComponentProps {
	export type OptionProps<
		T,
		isMulti extends boolean = boolean,
	> = rselect.OptionProps<OptionType<T>, isMulti, OptionGroupType<T>>
	export type SingleValueProps<
		T,
		isMulti extends boolean = boolean,
	> = rselect.SingleValueProps<OptionType<T>, isMulti, OptionGroupType<T>>
	export type MultiValueProps<
		T,
		isMulti extends boolean = boolean,
	> = rselect.MultiValueProps<OptionType<T>, isMulti, OptionGroupType<T>>

	export type PlaceholderProps<
		T,
		isMulti extends boolean = boolean,
	> = rselect.PlaceholderProps<OptionType<T>, isMulti, OptionGroupType<T>>

	export type ClearIndicatorProps<
		T,
		isMulti extends boolean = boolean,
	> = rselect.ClearIndicatorProps<OptionType<T>, isMulti, OptionGroupType<T>>

	export type DropdownIndicatorProps<
		T,
		isMulti extends boolean = boolean,
	> = rselect.DropdownIndicatorProps<
		OptionType<T>,
		isMulti,
		OptionGroupType<T>
	>

	export type IndicatorSeparatorProps<
		T,
		isMulti extends boolean = boolean,
	> = rselect.IndicatorSeparatorProps<
		OptionType<T>,
		isMulti,
		OptionGroupType<T>
	>

	export type LoadingIndicatorProps<
		T,
		isMulti extends boolean = boolean,
	> = rselect.LoadingIndicatorProps<
		OptionType<T>,
		isMulti,
		OptionGroupType<T>
	>

	export type MenuProps<
		T,
		isMulti extends boolean = boolean,
	> = rselect.MenuProps<OptionType<T>, isMulti, OptionGroupType<T>>

	export type MenuListProps<
		T,
		isMulti extends boolean = boolean,
	> = rselect.MenuListProps<OptionType<T>, isMulti, OptionGroupType<T>>

	export type NoticeProps<
		T,
		isMulti extends boolean = boolean,
	> = rselect.NoticeProps<OptionType<T>, isMulti, OptionGroupType<T>>

	export type MultiValueContainerProps<
		T,
		isMulti extends boolean = boolean,
	> = rselect.MultiValueGenericProps<
		OptionType<T>,
		isMulti,
		OptionGroupType<T>
	>

	export type MultiValueLabelProps<
		T,
		isMulti extends boolean = boolean,
	> = rselect.MultiValueGenericProps<
		OptionType<T>,
		isMulti,
		OptionGroupType<T>
	>

	export type MultiValueRemoveProps<
		T,
		isMulti extends boolean = boolean,
	> = rselect.MultiValueRemoveProps<
		OptionType<T>,
		isMulti,
		OptionGroupType<T>
	>

	export type GroupProps<
		T,
		isMulti extends boolean = boolean,
	> = rselect.GroupProps<OptionType<T>, isMulti, OptionGroupType<T>>

	export type GroupHeadingProps<
		T,
		isMulti extends boolean = boolean,
	> = rselect.GroupHeadingProps<OptionType<T>, isMulti, OptionGroupType<T>>

	export type SelectContainerProps<
		T,
		isMulti extends boolean = boolean,
	> = rselect.ContainerProps<OptionType<T>, isMulti, OptionGroupType<T>>

	export type ValueContainerProps<
		T,
		isMulti extends boolean = boolean,
	> = rselect.ValueContainerProps<OptionType<T>, isMulti, OptionGroupType<T>>

	export type IndicatorsContainerProps<
		T,
		isMulti extends boolean = boolean,
	> = rselect.IndicatorsContainerProps<
		OptionType<T>,
		isMulti,
		OptionGroupType<T>
	>

	export type ControlProps<
		T,
		isMulti extends boolean = boolean,
	> = rselect.ControlProps<OptionType<T>, isMulti, OptionGroupType<T>>
}
