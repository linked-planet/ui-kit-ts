import {
	type Path,
	useForm,
	type Control,
	type DefaultValues,
	type FieldValues,
	type RegisterOptions,
	type UseFormRegisterReturn,
	type UseFormWatch,
} from "react-hook-form"
import { twMerge } from "tailwind-merge"
import { Button } from "../Button"

export interface FormProps<T extends FieldValues> {
	control: Control<T>
	watch: UseFormWatch<T>
	register: (
		name: Path<T>,
		options?: RegisterOptions<T>,
	) => UseFormRegisterReturn
	readonly?: boolean
}

export interface FormField<T extends FieldValues> {
	name: Path<T>
	title: string
	description?: string
	required?: boolean
	formProps: FormProps<T>
}

export interface DynamicFormProps<T extends FieldValues>
	extends Omit<
		React.FormHTMLAttributes<HTMLFormElement>,
		"children" | "onSubmit"
	> {
	obj: DefaultValues<T>
	children: (
		formProps: FormProps<T>,
		reset: (newDefaultValue?: T) => void,
	) => React.JSX.Element
	onSubmit: (obj: T) => void
	readonly?: boolean
	horizontal?: boolean
	hideReset?: boolean
	hideSave?: boolean
}

export function DynamicForm<T extends FieldValues>({
	obj,
	children,
	onSubmit,
	readonly,
	horizontal,
	className,
	hideSave,
	hideReset,
	...props
}: DynamicFormProps<T>) {
	const {
		register,
		handleSubmit,
		formState: { isDirty, isValid },
		control,
		reset,
		watch,
	} = useForm<T>({
		defaultValues: obj,
	})

	const onReset = (e: React.FormEvent) => {
		e.preventDefault()
		reset()
	}

	return (
		<form
			{...props}
			className={twMerge(
				`flex ${horizontal ? "flex-row" : "flex-col"} gap-4`,
				className,
			)}
			onSubmit={handleSubmit(onSubmit)}
			onReset={onReset}
		>
			{children(
				{
					control: control,
					watch: watch,
					register: register,
					readonly: readonly,
				},
				reset,
			)}

			<hr className="border border-border" />

			<div className="flex flex-row items-end w-full justify-end mt-4">
				{!hideReset && (
					<Button
						type="reset"
						appearance="subtle"
						disabled={!isDirty}
					>
						Reset
					</Button>
				)}
				{!hideSave && (
					<Button
						appearance="primary"
						type="submit"
						disabled={!isValid}
					>
						Save
					</Button>
				)}
			</div>
		</form>
	)
}
