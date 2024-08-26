import React, { type ReactNode, useMemo } from "react"
import ShowcaseWrapperItem, {
	type ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
import {
	DataTable,
	type DataTableTypes,
	Input,
	Label,
	Checkbox,
	Button,
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
	// create by using ColumnDef directly (better to use the helper to have improved typing as seen in the example below)
	const columns = useMemo(() => {
		const ret: DataTableTypes.ColumnDef<RowData>[] = [
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
				//cell: (cellprops) => <b>{cellprops.getValue<string>()}</b>,
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
				cell: (cellprops) => cellprops.getValue<Element>(),
			},
		]
		return ret
	}, [])

	const [fullNameFilter, setFullNameFilter] =
		React.useState<DataTableTypes.ColumnFilter>()
	const [cityFilter, setCityFilter] =
		React.useState<DataTableTypes.ColumnFilter>()
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
				<DataTable.Table<RowData>
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

//#region datatable-coldef-helper-example
function DataTableColumnDefHelperExample() {
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
	// make the helper for better typing
	const columnHelper = DataTable.createColumnHelper<RowData>()

	// make the columns
	const columns = useMemo(() => {
		// display column to show the select state and the checkbox using the cell function (without the cell, it would be display string)
		const selectCol = columnHelper.display({
			id: "select", // either header or ID should be present
			header: (headerProps) => (
				<Checkbox
					checked={
						headerProps.table.getIsAllPageRowsSelected() ||
						headerProps.table.getIsSomePageRowsSelected()
					}
					onCheckedChange={(value) =>
						headerProps.table.toggleAllPageRowsSelected(!!value)
					}
					className="pb-1.5 pl-2"
					indeterminate={headerProps.table.getIsSomePageRowsSelected()}
				/>
			),
			cell: (cellprops) => (
				<Checkbox
					checked={cellprops.row.getIsSelected()}
					onCheckedChange={() => cellprops.row.toggleSelected()}
					className="pl-2"
				/>
			),
		})

		// accessor column using accessor function
		const fullNameCol = columnHelper.accessor(
			(row) => `${row.firstName} ${row.lastName}`,
			{
				header: "Full Name", // either header or ID should be present
			},
		)

		// accessor column using accessor key
		const cityCol = columnHelper.accessor("city", {
			header: "City",
			enableGrouping: true,
			enableSorting: true,
			cell: (cellProps) => <b>{cellProps.getValue<string>()}</b>,
		})

		const zipCol = columnHelper.accessor("zip", {
			header: "Zip",
			enableGrouping: true,
			invertSorting: true,
		})

		const stateCol = columnHelper.accessor("state", {
			header: "State",
			enableGrouping: true,
			invertSorting: true,
		})

		// display column using accessor key, but avoid the toString() of the element
		const buttonCol = columnHelper.accessor("button", {
			header: "Button",
			id: "button",
			cell: (cellProps) => cellProps.getValue<Element>(),
		})

		return [selectCol, fullNameCol, cityCol, zipCol, stateCol, buttonCol]
	}, [columnHelper])

	const [fullNameFilter, setFullNameFilter] =
		React.useState<DataTableTypes.ColumnFilter>()
	const [cityFilter, setCityFilter] =
		React.useState<DataTableTypes.ColumnFilter>()
	const [hideState, setHideState] = React.useState<boolean>(false)

	const filters: DataTableTypes.ColumnFilter[] = []
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
				<DataTable.Table<RowData>
					data={rows}
					columns={columns}
					columnFilters={filters}
					columnVisibility={visibilityState}
				/>
			</div>
		</>
	)
}
//#endregion datatable-coldef-helper-example

function DynamicTableShowcase(props: ShowcaseProps) {
	return (
		<ShowcaseWrapperItem
			name="Dynamic table"
			description="A sortable, filterable and searchable table component, based on tanstack/react-table (see https://tanstack.com/table/)."
			{...props}
			packages={[
				{
					name: "@linked-planet/ui-kit-ts",
					url: "/ui-kit-ts/single?component=DataTable",
				},
			]}
			examples={[
				{
					title: "Data Table ColumnDef Helper",
					example: <DataTableColumnDefHelperExample />,
					sourceCodeExampleId: "datatable-coldef-helper-example",
				},
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
