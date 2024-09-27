import React, {useEffect} from "react"
import {FieldValues, Path} from "react-hook-form"
import {FormField} from "../DynamicForm";
import {Input, Label} from "../../inputs";

export interface InputFormField<T extends FieldValues>
	extends FormField<T> {
	onChange?: (value: string) => void
}

export function InputFormField<T extends FieldValues>(
	props: InputFormField<T>,
) {
	console.info("formProps", props.formProps)
	const fieldValue = props.formProps?.watch(props.objKey as Path<T>)

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (props.onChange) {
			// @ts-ignore
			props.onChange(fieldValue)
		}
	}, [fieldValue])

	const inputProps = props.formProps?.register(props.objKey)

	return (
		<div className="flex flex-1 flex-col">
			<Label
				htmlFor={inputProps?.name}
				required={props.required}
			>
				{props.title}
			</Label>
			{props.description && (
				<p className="mt-0 pb-2">
					<small>{props.description}</small>
				</p>
			)}
			<Input
				id={inputProps?.name}
				{...(inputProps as React.InputHTMLAttributes<HTMLInputElement>)}
				disabled={props.formProps?.readonly === true}
			/>
		</div>
	)
}
