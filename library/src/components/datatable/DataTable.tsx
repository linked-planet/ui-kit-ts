import {
	type AccessorColumnDef,
	type ColumnDef,
	type ColumnFiltersState,
	type DisplayColumnDef,
	flexRender,
	type GroupColumnDef,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	type OnChangeFn,
	type RowSelectionState,
	type SortingState,
	useReactTable,
	type VisibilityState,
} from "@tanstack/react-table"
import { type CSSProperties, useCallback, useState } from "react"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "./DataTableComponents"

interface DataTableProps<TData, TValue> {
	columns: (
		| ColumnDef<TData, TValue>
		| AccessorColumnDef<TData, TValue>
		| DisplayColumnDef<TData, TValue>
		| GroupColumnDef<TData, TValue>
	)[]
	data: TData[]

	columnFilters?: ColumnFiltersState
	columnVisibility?: VisibilityState

	selectedRows?: RowSelectionState

	sorting?: SortingState
	onRowSelectionChange?: (rowSelection: RowSelectionState) => void

	onColumnVisibilityChange?: (columnVisibility: VisibilityState) => void

	onSortingChange?: (sorting: SortingState) => void

	onColumnFiltersChange?: (filters: ColumnFiltersState) => void

	tableClassName?: string
	tableStyle?: CSSProperties

	tableHeaderClassName?: string
	tableHeaderStyle?: CSSProperties

	tableCellClassName?: string
	tableCellStyle?: CSSProperties

	tableBodyClassName?: string
	tableBodyStyle?: CSSProperties

	tableRowClassName?: string
	tableRowStyle?: CSSProperties

	id?: string
	testId?: string
}

// biome-ignore lint/suspicious/noExplicitAny: any is required to avoid the need to specify all the row types as union, rows should handle the type safety
export function DataTable<TData, TValue = any>({
	columns,
	data,
	columnFilters: _columnFilters,
	columnVisibility: _columnVisibility,
	selectedRows,
	sorting: _sorting,
	onRowSelectionChange,
	onColumnVisibilityChange,
	onSortingChange,
	onColumnFiltersChange,
	tableClassName,
	tableStyle,
	tableHeaderClassName,
	tableHeaderStyle,
	tableCellClassName,
	tableCellStyle,
	tableBodyClassName,
	tableBodyStyle,
	tableRowClassName,
	tableRowStyle,
	id,
	testId,
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = useState<SortingState>(_sorting ?? [])
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
		_columnFilters ?? [],
	)
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
		_columnVisibility ?? {},
	)
	const [rowSelection, setRowSelection] = useState(selectedRows ?? {})
	if (selectedRows && selectedRows !== rowSelection) {
		setRowSelection(selectedRows ?? {})
	}

	if (_columnFilters && _columnFilters !== columnFilters) {
		setColumnFilters(_columnFilters ?? [])
	}
	if (_columnVisibility && columnVisibility !== _columnVisibility) {
		setColumnVisibility(_columnVisibility ?? {})
	}
	if (_sorting && sorting !== _sorting) {
		setSorting(_sorting ?? [])
	}

	const onRowSelectionChangeCB: OnChangeFn<RowSelectionState> = useCallback(
		(selectionUpdateFn) => {
			setRowSelection((prev) => {
				if (typeof selectionUpdateFn === "function") {
					const selection = selectionUpdateFn(prev)
					onRowSelectionChange?.(selection)
					return selection
				}
				return selectionUpdateFn
			})
		},
		[onRowSelectionChange],
	)

	const onColumnVisibilityChangeCB: OnChangeFn<VisibilityState> = useCallback(
		(visibilityUpdateFn) => {
			setColumnVisibility((prev) => {
				if (typeof visibilityUpdateFn === "function") {
					const newVisibility = visibilityUpdateFn(prev)
					onColumnVisibilityChange?.(newVisibility)
					return newVisibility
				}
				return visibilityUpdateFn
			})
		},
		[onColumnVisibilityChange],
	)

	const onSortingChangeCB: OnChangeFn<SortingState> = useCallback(
		(sortingUpdateFn) => {
			setSorting((prev) => {
				if (typeof sortingUpdateFn === "function") {
					const newSorting = sortingUpdateFn(prev)
					onSortingChange?.(newSorting)
					return newSorting
				}
				return sortingUpdateFn
			})
		},
		[onSortingChange],
	)

	const onColumnFiltersChangeCB: OnChangeFn<ColumnFiltersState> = useCallback(
		(filtersUpdateFn) => {
			setColumnFilters((prev) => {
				if (typeof filtersUpdateFn === "function") {
					const filters = filtersUpdateFn(prev)
					onColumnFiltersChange?.(filters)
					return filters
				}
				return filtersUpdateFn
			})
		},
		[onColumnFiltersChange],
	)

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		onSortingChange: onSortingChangeCB,
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: onColumnFiltersChangeCB,
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: onColumnVisibilityChangeCB,
		onRowSelectionChange: onRowSelectionChangeCB,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
		},
	})

	const tableHeaderGroups = table.getHeaderGroups()
	const tableRowModel = table.getRowModel()

	// should not be in a useMemo, else things like the chevrons on the ordered headers do not work
	const tableHeaderGroupElements = tableHeaderGroups.map((headerGroup) => (
		<TableRow key={headerGroup.id}>
			{headerGroup.headers.map((header) => {
				const inner = header.isPlaceholder
					? null
					: flexRender(
							header.column.columnDef.header,
							header.getContext(),
						)

				const content = header.column.columnDef.enableSorting ? (
					<button
						onClick={() =>
							header.column.toggleSorting(
								header.column.getIsSorted() === "asc",
							)
						}
						onKeyUp={(e) => {
							if (e.key === "Enter") {
								header.column.toggleSorting(
									header.column.getIsSorted() === "asc",
								)
							}
						}}
						aria-label={`Sort column ${
							header.column.columnDef.id
						} ${
							!header.column.getIsSorted()
								? "unsorted"
								: header.column.getIsSorted() === "asc"
									? "ascending"
									: "descending"
						}`}
						type="button"
					>
						<div className="flex items-center px-2">
							{inner}
							<div className="ml-1 inline-block">
								<div
									className={
										header.column.getIsSorted() === "asc"
											? "text-text text-3xs leading-[0.6rem]"
											: "text-disabled-text text-3xs leading-[0.7rem]"
									}
								>
									▲
								</div>
								<div
									className={
										header.column.getIsSorted() === "desc"
											? "text-text text-3xs leading-[0.6rem]"
											: "text-disabled-text text-3xs leading-[0.7rem]"
									}
								>
									▼
								</div>
							</div>
						</div>
					</button>
				) : (
					inner
				)

				return (
					<TableHead key={header.id}>
						<div className="border-border text-text-subtlest block border-b p-1 text-sm font-semibold">
							{content}
						</div>
					</TableHead>
				)
			})}
		</TableRow>
	))

	// should not be in a useMemo, else things like column visibility do not get updated
	const tableRows = tableRowModel.rows?.length ? (
		tableRowModel.rows.map((row) => (
			<TableRow
				key={row.id}
				data-state={row.getIsSelected() && "selected"}
				className={tableRowClassName}
				style={tableRowStyle}
			>
				{row.getVisibleCells().map((cell) => (
					<TableCell
						key={cell.id}
						className={tableCellClassName}
						style={tableCellStyle}
					>
						{flexRender(
							cell.column.columnDef.cell,
							cell.getContext(),
						)}
					</TableCell>
				))}
			</TableRow>
		))
	) : (
		<TableRow className={tableRowClassName} style={tableRowStyle}>
			<TableCell
				colSpan={columns.length}
				className={tableCellClassName}
				style={tableCellStyle}
			>
				No results.
			</TableCell>
		</TableRow>
	)

	return (
		<Table
			className={tableClassName}
			style={tableStyle}
			id={id}
			data-testid={testId}
		>
			<TableHeader
				className={tableHeaderClassName}
				style={tableHeaderStyle}
			>
				{tableHeaderGroupElements}
			</TableHeader>
			<TableBody className={tableBodyClassName} style={tableBodyStyle}>
				{tableRows}
			</TableBody>
		</Table>
	)
}
