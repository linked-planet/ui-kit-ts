import React, { type ReactNode, useMemo } from "react"
import ShowcaseWrapperItem, {
	type ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
import DynamicTable from "@atlaskit/dynamic-table"
import Button from "@atlaskit/button"
import {
	type ColumnDef,
	type ColumnFilter,
	DataTable,
	Input,
	Label,
	Checkbox,
} from "@linked-planet/ui-kit-ts"

//#region datatable-example
type RowData = {
	firstName: string
	lastName: string
	city: string
	zip: number
	state: string
	button: ReactNode
}

function DataTableExample() {
	const rows = useMemo(() => {
		// create 100 example rows
		const rows: RowData[] = []
		for (let i = 0; i < 100; i++) {
			rows.push({
				firstName: `First ${i}`,
				lastName: `Last ${i}`,
				city: `City ${Math.floor(i / 2)}`,
				zip: i,
				state: `State ${i}`,
				button: <Button appearance="primary">Delete</Button>,
			})
		}
		return rows
	}, [])

	// see: https://tanstack.com/table/v8/docs/guide/column-defs#creating-accessor-columns
	const columns = useMemo(() => {
		const ret: ColumnDef<RowData>[] = [
			{
				id: "select", // either header or ID should be present
				header: (headerprops) => (
					<Checkbox
						checked={
							headerprops.table.getIsAllPageRowsSelected() ||
							headerprops.table.getIsSomePageRowsSelected()
						}
						onCheckedChange={(value) =>
							headerprops.table.toggleAllPageRowsSelected(!!value)
						}
						className="pb-1.5 pl-2"
						indeterminate={headerprops.table.getIsSomePageRowsSelected()}
					/>
				),
				cell: (cellprops) => (
					<Checkbox
						checked={cellprops.row.getIsSelected()}
						onCheckedChange={() => {
							cellprops.row.toggleSelected()
						}}
						className="pl-2"
					/>
				),
			},
			{
				id: "Full Name", // either header or ID should be present
				accessorFn: (row) => `${row.firstName} ${row.lastName}`,
			},
			{
				//accessorFn: (row) => row.city,
				header: "City",
				accessorKey: "city",
				enableGrouping: true,
				enableSorting: true,
				cell: (cellprops) => <b>{cellprops.getValue()}</b>,
			},
			{
				header: "Zip",
				accessorKey: "zip",
				enableGrouping: true,
				invertSorting: true,
			},
			{
				header: "State",
				accessorKey: "state",
				enableGrouping: true,
				invertSorting: true,
			},
			{
				header: "Button",
				accessorKey: "button",
				cell: (cellprops) => cellprops.getValue(),
			},
		]
		return ret
	}, [])

	const [fullNameFilter, setFullNameFilter] = React.useState<ColumnFilter>()
	const [cityFilter, setCityFilter] = React.useState<ColumnFilter>()
	const [hideState, setHideState] = React.useState<boolean>(false)

	const filters = []
	if (fullNameFilter) filters.push(fullNameFilter)
	if (cityFilter) filters.push(cityFilter)

	const visibilityState = {
		state: !hideState,
	}

	return (
		<>
			<Label htmlFor="search">Search Full Name</Label>
			<Input
				type="text"
				placeholder="Search"
				onChange={(e) => {
					const val = e.target.value
					setFullNameFilter({ id: "Full Name", value: val })
				}}
			/>
			<Label htmlFor="search">Search City</Label>
			<Input
				type="text"
				placeholder="Search"
				onChange={(e) => {
					const val = e.target.value
					setCityFilter({ id: "city", value: val })
				}}
				className="mb-4"
			/>
			<Label htmlFor="hideState">Hide State</Label>
			<Checkbox
				label="Hide State"
				checked={hideState}
				onCheckedChange={setHideState}
			/>
			<div className="bg-surface h-96 overflow-hidden">
				<DataTable
					data={rows}
					columns={columns}
					columnFilters={filters}
					columnVisibility={visibilityState}
				/>
			</div>
		</>
	)
}
//#endregion datatable-example

function DynamicTableShowcase(props: ShowcaseProps) {
	return (
		<ShowcaseWrapperItem
			name="Dynamic table"
			{...props}
			packages={[
				{
					name: "@atlaskit/dynamic-table",
					url: "https://atlassian.design/components/dynamic-table/examples",
				},
			]}
			examples={[
				{
					title: "Data Table",
					example: <DataTableExample />,
					sourceCodeExampleId: "datatable-example",
				},
			]}
		/>
	)
}

export default DynamicTableShowcase