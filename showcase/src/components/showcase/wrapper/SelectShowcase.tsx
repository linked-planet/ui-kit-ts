//import { default as AKSelect } from "@atlaskit/select"
import {
	Button,
	ButtonGroup,
	Label,
	Select,
	type SelectComponentProps,
	type OptionGroupType,
	selectComponents,
} from "@linked-planet/ui-kit-ts"
import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import ShowcaseWrapperItem, {
	type ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"

//#region select2form-uncontrolled

type FormData = {
	singleValue: string | null // null because react-hook-form does not support undefined values (doesn't react on them)
	multiValues: string[] | null
	groupedMultiValues: string[] | null
}

function FormExample() {
	const availableOptions = [
		{ label: "First option", value: "first" },
		{ label: "Second option", value: "second" },
		{ label: "Third option", value: "third" },
		{ label: "Fourth option", value: "fourth" },
	]

	const availableGroupOptions: OptionGroupType<string>[] = [
		{
			label: "First group",
			options: [
				{ label: "First option", value: "first" },
				{ label: "Second option", value: "second" },
			],
		},
		{
			label: "Second group",
			options: [
				{ label: "Third option", value: "third" },
				{ label: "Fourth option", value: "fourth", isDisabled: true },
			],
		},
	]

	const { handleSubmit, control, reset, setValue } = useForm<FormData>({
		defaultValues: {
			singleValue: availableOptions[0].value,
			multiValues: [availableOptions[0].value, availableOptions[1].value],
			groupedMultiValues: [availableGroupOptions[0].options[0].value],
		},
	})

	return (
		<form
			onSubmit={handleSubmit((data) => console.log(data))}
			onReset={(e) => {
				e.preventDefault()
				reset()
			}}
		>
			<Label>Single Uncontrolled</Label>
			<Select<FormData, string>
				control={control}
				name="singleValue"
				options={availableOptions}
				usePortal
				errorMessage="TEST"
				invalid
			/>
			<Label>Multi Uncontrolled</Label>
			<Select<FormData, string>
				control={control}
				isMulti
				name="multiValues"
				options={availableOptions}
				usePortal
			/>
			<Label>Grouped Multi</Label>
			{/* string is the value type, FormData the type of the form data for the control, true is the isMulti flag */}
			<Select<FormData, string, true>
				isMulti
				control={control}
				name="groupedMultiValues"
				options={availableGroupOptions}
				usePortal
			/>
			<ButtonGroup className="mt-2 w-full justify-end">
				<Button type="reset">Reset</Button>
				<Button type="submit" appearance="primary">
					Submit
				</Button>
			</ButtonGroup>
		</form>
	)
}
//#endregion select2form-uncontrolled

//#region select2form-controlled
type FormDataControlled = {
	singleValue: string
	multiValues: string[]
}

function ControlledFormExample() {
	const availableOptions = [
		{ label: "First option", value: "first" },
		{ label: "Second option", value: "second" },
		{ label: "Third option", value: "third" },
		{ label: "Fourth option", value: "fourth" },
	]

	const { handleSubmit, control } = useForm<FormDataControlled>()

	const [selectedControlled, setSelectedControlled] = useState<
		{ label: string; value: string } | undefined | null
	>(availableOptions[1])

	const [selectedControlledMulti, setSelectedControlledMulti] = useState<
		readonly { label: string; value: string }[] | undefined | null
	>([availableOptions[1], availableOptions[2]])

	return (
		<>
			<form onSubmit={handleSubmit((data) => console.log(data))}>
				<Label htmlFor="controlled">Controlled Single</Label>
				<Select<FormDataControlled, string, false>
					id="controlled"
					control={control}
					name="singleValue"
					options={availableOptions}
					value={selectedControlled}
					onChange={(value) => setSelectedControlled(value)}
				/>

				<Label htmlFor="controlledmulti">Controlled Multi</Label>
				<Select<FormDataControlled, string, true>
					id="controlledmulti"
					isMulti
					control={control}
					name="multiValues"
					options={availableOptions}
					value={selectedControlledMulti}
					onChange={(value) => setSelectedControlledMulti(value)}
				/>

				<ButtonGroup className="mt-2 w-full justify-end">
					<Button type="submit" appearance="primary">
						Submit
					</Button>
				</ButtonGroup>
			</form>
		</>
	)
}
//#endregion select2form-controlled

//#region select-custom-component
type Book = {
	title: string
	author: string
	isbn: string
	language: string
}

const books: Book[] = [
	{
		title: "The Lord of the Rings",
		author: "J.R.R. Tolkien",
		isbn: "978-3-86680-192-9",
		language: "English",
	},
	{
		title: "Harry Potter",
		author: "J.K. Rowling",
		isbn: "978-3-86680-192-9",
		language: "English",
	},
	{
		title: "The Historical Development of the Heart from Its Formation in the Primitive Vertebrate to Its Most Recent Manifestation in Modern Homo Sapiens as Seen in the Context of the Evolutionary Process, Along with Reflections on Its Influence upon Social, Cultural, and Economic Development with Reference to the Views of Charles Darwin and Other Prominent Thinkers, and Including Detailed Examinations of the Physiological and Anatomical Aspects of the Organ, with Illustrations Drawn from Various Epochs and Regions of the World, as well as a Comprehensive Study of Heart Disease and Its Treatment from Ancient Times to the Present Day, Covering Both Eastern and Western Medical Practices, with a Special Section Devoted to the Role of Diet and Lifestyle in the Maintenance of Cardiovascular Health, Alongside a Discussion of the Spiritual and Symbolic Significance of the Heart in World Religions, and an Appendix on the Potential Future Developments in Heart Transplantation and Artificial Heart Research in the 21st Century",
		author: "Nigel Tomm",
		isbn: "123-4-56789-234-5",
		language: "English",
	},
	{
		title: "ABC",
		author: "Sir Augustus Maximilian Percival Thaddeus Leopold Ambrose Fitzwilliam Kensington-Rutherford de la Croix Montmorency Beaumont Windsor St. John Alistair Edward Victor Montgomery Hawthorne-Darcy Fitzgerald, Duke of Abernathy, Marquess of Silverwood, Earl of Whitehall, Viscount Longfellow, Baron Cresswell of Eversfield",
		isbn: "123-4-56789-234-5",
		language: "English",
	},
]

// https://react-select.com/components
function BookOption(props: SelectComponentProps.OptionProps<Book>) {
	const value = props.data.value
	return (
		<selectComponents.Option {...props}>
			<div className="py-2">
				<h3 className="font-bold">{value.title}</h3>
				<div
					className="grid pt-1"
					style={{
						gridTemplateColumns: "1fr 12rem auto",
					}}
				>
					<p className="truncate text-left">{value.author}</p>
					<p className="truncate text-center px-2">{value.isbn}</p>
					<p className="truncate text-right pl-2">{value.language}</p>
				</div>
			</div>
		</selectComponents.Option>
	)
}

function CustomComponentExample() {
	const [selectedBook, setSelectedBook] = useState<Book | null>(null)

	const options = useMemo(() => {
		return books.map((book) => ({
			label: book.title,
			value: book,
		}))
	}, [])

	const value =
		options?.find((option) => option.value === selectedBook) ?? null

	return (
		<Select<Book, false>
			options={options}
			value={value}
			onChange={(opt) => {
				setSelectedBook(opt?.value ?? null)
			}}
			components={{
				Option: BookOption,
			}}
		/>
	)
}
//#endregion select-custom-component


//#region select-async
function SelectAsyncExample() {
	
}
//#endregion select-async

function SelectShowcase(props: ShowcaseProps) {
	//#region select

	const options = [
		{ label: "First option", value: { test: "first" } },
		{ label: "Second option", value: { test: "second" } },
		{
			label: "Third option",
			value: { test: "third" },
		},
		{
			label: "Disabled option",
			value: { test: "disabled" },
			isDisabled: true,
		},
		{
			label: "Fixed option",
			value: { test: "fixed" },
			isFixed: true,
		},
	]

	const example1 = (
		<div className="flex flex-col gap-4">
			<Select
				isCreateable
				isClearable
				tabSelectsValue
				placeholder="Select an option"
				onChange={(value) => {
					console.log("on change", value)
				}}
				onCreateOption={(value) => {
					console.log("on create", value)
				}}
				options={[
					{ label: "First option", value: { test: "first" } },
					{ label: "Second option", value: { test: "second" } },
					{ label: "Third option", value: { test: "third" } },
				]}
				defaultValue={{
					label: "Second option",
					value: { test: "second" },
				}}
			/>

			<Select<{ test: string }, true>
				placeholder="Select an option"
				onChange={(value) => {
					console.log("value", value)
				}}
				isMulti
				options={options}
				defaultValue={options[4]}
				/** adding some custom classnames to the styling */
				classNames={{
					control: () => "bg-warning",
				}}
			/>

			<Select<{ test: string }, true>
				placeholder="Select an option"
				disabled
				isMulti
				options={[
					{ label: "First option", value: { test: "first" } },
					{ label: "Second option", value: { test: "second" } },
					{ label: "Third option", value: { test: "third" } },
				]}
			/>
		</div>
	)
	//#endregion select
	//#region select2
	const example2 = (
		<div className="flex flex-col gap-4">
			{/*<AKSelect
				inputId="select-s"
				options={[
					{
						label: "First group",
						options: [
							{ label: "First option", value: "first" },
							{ label: "Second option", value: "second" },
						],
					},
					{
						label: "Second group",
						options: [
							{ label: "Third option", value: "third" },
							{ label: "Fourth option", value: "fourth" },
						],
					},
				]}
			/>*/}
			{/*<RadixSelect
				placeholder="Select a value"
				options={{
					"First Group": [{ label: "First option", value: "first" }],
					"Second Group": [
						{ label: "Second option", value: "second" },
					],
				}}
			/>*/}

			<Select
				placeholder="Select a value 2"
				invalid
				options={[
					{
						label: "First group",
						options: [{ label: "First option", value: "first" }],
					},
					{
						label: "Second group",
						options: [{ label: "Second option", value: "second" }],
					},
				]}
			/>

			<Select
				placeholder="Select a value 3"
				isMulti
				inputId="input-id-test"
				instanceId="instance-id-test"
				id="id-test"
				options={[
					{
						label: "First group",
						options: [{ label: "First option", value: "first" }],
					},
					{
						label: "Second group",
						options: [{ label: "Second option", value: "second" }],
					},
				]}
				dropdownLabel={(isOpen) => (isOpen ? "Close :(" : "Open :)")}
				clearValuesButtonLabel="Clear values!!!"
				removeValueButtonLabel="Remove value!!!"
			/>

			<Select
				placeholder="Select a value 3"
				isMulti
				disabled
				inputId="input-id-test"
				instanceId="instance-id-test"
				id="id-test"
				options={[
					{
						label: "First group",
						options: [{ label: "First option", value: "first" }],
					},
					{
						label: "Second group",
						options: [{ label: "Second option", value: "second" }],
					},
				]}
				dropdownLabel={(isOpen) => (isOpen ? "Close :(" : "Open :)")}
				clearValuesButtonLabel="Clear values!!!"
				removeValueButtonLabel="Remove value!!!"
			/>
		</div>
	)
	//#endregion select2

	return (
		<ShowcaseWrapperItem
			name="Select"
			{...props}
			description={
				<>
					Select component with support for single and multi select,
					grouped options, custom styling and react-hook-form
					integration.
					<br />
					If used in a form and you want to clear the selected option
					use <b>NULL</b>, not undefined. React-hook-form does not
					support undefined values.
				</>
			}
			packages={[
				{
					name: "@linked-planet/ui-kit-ts",
					url: "https://linked-planet.github.io/ui-kit-ts/single?component=Select",
				},
			]}
			examples={[
				{
					title: "Example 1",
					example: example1,
					sourceCodeExampleId: "select",
				},
				{
					title: "Example 2",
					example: example2,
					sourceCodeExampleId: "select2",
				},
				{
					title: "Form Uncontrolled",
					example: <FormExample />,
					sourceCodeExampleId: "select2form-uncontrolled",
				},
				{
					title: "Form Controlled",
					example: <ControlledFormExample />,
					sourceCodeExampleId: "select2form-controlled",
				},
				{
					title: "Custom Component",
					example: <CustomComponentExample />,
					sourceCodeExampleId: "select-custom-component",
				},
			]}
		/>
	)
}

export default SelectShowcase
