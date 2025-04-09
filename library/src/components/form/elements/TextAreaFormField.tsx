import {
	type Control,
	Controller,
	type FieldPath,
	type FieldValues,
} from "react-hook-form"
import { Label, TextArea } from "../../inputs"
import type { TextAreaProps } from "../../inputs/TextArea"

export type TextareaFormFieldProps<T extends FieldValues> = {
	name: FieldPath<T>
	title: string
	description?: string
	rows?: number
	formProps: {
		control: Control<T>
	}
	required?: boolean
} & Partial<TextAreaProps>

export function TextareaFormField<T extends FieldValues>({
	name,
	title,
	description,
	rows = 5,
	formProps,
	required,
	...rest
}: TextareaFormFieldProps<T>) {
	return (
		<div className="flex flex-col gap-1">
			<Label htmlFor={name} required={required}>
				{title}
			</Label>
			{description && (
				<p className="mt-0 pb-2">
					<small>{description}</small>
				</p>
			)}
			<Controller
				name={name}
				control={formProps.control}
				render={({ field, fieldState }) => (
					<TextArea
						{...rest}
						{...field}
						rows={rows}
						invalid={!!fieldState.error || rest.invalid}
						aria-invalid={!!fieldState.error || rest.invalid}
						textAreaClassName="w-full"
					/>
				)}
			/>
		</div>
	)
}
