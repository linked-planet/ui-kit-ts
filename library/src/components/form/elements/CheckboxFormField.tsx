import { useEffect, useRef } from "react"
import type { FieldValues } from "react-hook-form"
import type { FormField } from "../DynamicForm"
import { Label } from "../../inputs"
import { Checkbox } from "../../Checkbox"

export interface CheckboxFormFieldProps<T extends FieldValues>
	extends FormField<T> {
	onChange?: (value: string) => void
}

export function CheckboxFormField<T extends FieldValues>({
	name,
	onChange,
	formProps,
	required,
	description,
	title,
}: CheckboxFormFieldProps<T>) {
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
		<div className="flex flex-1 flex-col">
			<Label htmlFor={name} required={required}>
				{title}
			</Label>
			{description && (
				<p className="mt-0 pb-2">
					<small>{description}</small>
				</p>
			)}
			<Checkbox
				className="mt-2"
				label={"Aktivieren"}
				disabled={formProps.readonly}
				id={inputProps?.name}
				{...inputProps}
			/>
		</div>
	)
}
