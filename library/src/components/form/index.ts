import {
	CheckboxFormField,
	type CheckboxFormFieldProps as _CheckboxFormFieldProps,
} from "./elements/CheckboxFormField"
import {
	InputFormField,
	type InputFormFieldProps as _InputFormFieldProps,
} from "./elements/InputFormField"
import {
	SelectMultiFormField,
	type SelectMultiFormFieldProps as _SelectMultiFormFieldProps,
} from "./elements/SelectMultiFormField"
import {
	SelectSingleFormField,
	type SelectSingleFormFieldProps as _SelectSingleFormFieldProps,
} from "./elements/SelectSingleFormField"
import {
	DynamicForm as Form,
	type FormField as _FormField,
	type FormProps as _FormProps,
	type DynamicFormProps as _DynamicFormProps,
} from "./DynamicForm"
import type { FieldValues } from "react-hook-form"

const DynamicForm = {
	CheckboxFormField,
	InputFormField,
	SelectMultiFormField,
	SelectSingleFormField,
	Form,
}
export { DynamicForm }

export namespace DynamicFormTypes {
	export type CheckboxFormFieldProps<T extends FieldValues> =
		_CheckboxFormFieldProps<T>
	export type InputFormFieldProps<T extends FieldValues> =
		_InputFormFieldProps<T>
	export type SelectMultiFormFieldProps<
		T extends FieldValues,
		A extends string | number,
	> = _SelectMultiFormFieldProps<T, A>
	export type SelectSingleFormFieldProps<
		T extends FieldValues,
		A extends string | number,
	> = _SelectSingleFormFieldProps<T, A>
	export type FormField<T extends FieldValues> = _FormField<T>
	export type FormProps<T extends FieldValues> = _FormProps<T>
	export type DynamicFormProps<T extends FieldValues> = _DynamicFormProps<T>
}
