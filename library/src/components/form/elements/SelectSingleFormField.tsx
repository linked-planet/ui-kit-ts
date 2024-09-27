import React, {useEffect} from "react"
import {FieldValues, Path} from "react-hook-form"
import {FormField} from "../DynamicForm";
import {Label, Select} from "../../inputs";

export interface SelectSingleFormField<
	T extends FieldValues,
	A extends string | number,
> extends FormField<T> {
	options: Array<{ label: string; value: A }>
	onChange?: (value: string) => void
}

export function SelectSingleFormField<
	T extends FieldValues,
	A extends string | number,
>(props: SelectSingleFormField<T, A>) {
	const fieldValue = props.formProps?.watch(props.objKey as Path<T>)

	useEffect(() => {
		console.info("FieldChange", props.objKey, fieldValue, props.onChange)
		if (props.onChange) {
			console.info(
				"FieldChange EXECUTING",
				props.objKey,
				fieldValue,
				props.onChange,
			)
			// @ts-ignore
			props.onChange(fieldValue)
		}
	}, [fieldValue])

	const inputProps = props.formProps?.register(props.objKey)

	return (
		<div className="flex flex-1 flex-col">
			<Label htmlFor={inputProps?.name} required={props.required}>
				{props.title}
			</Label>
			<Select<T, A, false>
				id={inputProps?.name}
				name={inputProps?.name as Path<T>}
				control={props.formProps!.control}
				options={props.options}
				required
				disabled={props.formProps?.readonly === true}
			/>
		</div>
	)
}
