import { useEffect, useRef } from "react"
import type { FieldValues } from "react-hook-form"
import type { FormField } from "../DynamicForm"
import { Input, Label } from "../../inputs"

export interface InputFormFieldProps<T extends FieldValues>
	extends FormField<T> {
	onChange?: (value: string) => void
	placeholder?: string
}

export function InputFormField<T extends FieldValues>({
	onChange,
	formProps,
	name,
	required,
	description,
	title,
	placeholder,
}: InputFormFieldProps<T>) {
	const fieldValue = formProps.watch(name)
	const onChangeCB = useRef(onChange)
	if (onChangeCB.current !== onChange) {
		onChangeCB.current = onChange
	}

	useEffect(() => {
		onChangeCB.current?.(fieldValue)
	}, [fieldValue])

	const inputProps = formProps.register(name)

	return (
		<div className="flex flex-1 flex-col min-w-max">
			<Label htmlFor={name} required={required}>
				{title}
			</Label>
			{description && (
				<p className="mt-0 pb-2">
					<small>{description}</small>
				</p>
			)}
			<Input
				id={name}
				{...inputProps}
				disabled={formProps?.readonly}
				placeholder={placeholder}
			/>
		</div>
	)
}
