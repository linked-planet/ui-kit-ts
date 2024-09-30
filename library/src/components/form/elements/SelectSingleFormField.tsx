import { useEffect, useRef } from "react"
import type { FieldValues, Path } from "react-hook-form"
import type { FormField } from "../DynamicForm"
import { Label, Select } from "../../inputs"

export interface SelectSingleFormField<
	T extends FieldValues,
	A extends string | number,
> extends FormField<T> {
	options: Array<{ label: string; value: A }>
	onChange?: (value: string) => void
	placeholder?: string
}

export function SelectSingleFormField<
	T extends FieldValues,
	A extends string | number,
>({
	name,
	description,
	title,
	formProps,
	onChange,
	required,
	options,
	placeholder,
}: SelectSingleFormField<T, A>) {
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
			<Label htmlFor={inputProps?.name} required={required}>
				{title}
			</Label>
			{description && (
				<p className="mt-0 pb-2">
					<small>{description}</small>
				</p>
			)}
			<Select<T, A, false>
				id={inputProps?.name}
				name={inputProps?.name as Path<T>}
				control={formProps.control}
				options={options}
				required={required}
				disabled={formProps.readonly}
				placeholder={placeholder}
			/>
		</div>
	)
}
