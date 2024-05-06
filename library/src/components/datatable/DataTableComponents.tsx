import {
	type HTMLAttributes,
	type TdHTMLAttributes,
	type ThHTMLAttributes,
	forwardRef,
} from "react"
import { twMerge } from "tailwind-merge"

const Table = forwardRef<HTMLTableElement, HTMLAttributes<HTMLTableElement>>(
	({ className, ...props }, ref) => (
		<div className="relative size-full overflow-auto">
			<table
				ref={ref}
				className={twMerge("relative w-full caption-bottom", className)}
				{...props}
			/>
		</div>
	),
)
Table.displayName = "Table"

const TableHeader = forwardRef<
	HTMLTableSectionElement,
	HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
	<thead
		ref={ref}
		className={twMerge(
			"bg-surface [&_tr]:hover:bg-surface sticky top-0 z-10",
			className,
		)}
		{...props}
	/>
))
TableHeader.displayName = "TableHeader"

const TableBody = forwardRef<
	HTMLTableSectionElement,
	HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
	<tbody ref={ref} className={className} {...props} />
))
TableBody.displayName = "TableBody"

const TableFooter = forwardRef<
	HTMLTableSectionElement,
	HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
	<tfoot ref={ref} className={className} {...props} />
))
TableFooter.displayName = "TableFooter"

const TableRow = forwardRef<
	HTMLTableRowElement,
	HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
	<tr
		ref={ref}
		className={twMerge(
			"border-border hover:bg-surface-hovered data-[state=selected]:bg-selected data-[state=selected]:hover:bg-selected-hovered border-b",
			className,
		)}
		{...props}
	/>
))
TableRow.displayName = "TableRow"

const TableHead = forwardRef<
	HTMLTableCellElement,
	ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
	<th
		ref={ref}
		className={twMerge(
			"m-0 p-0 align-bottom font-bold [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
			className,
		)}
		{...props}
	/>
))
TableHead.displayName = "TableHead"

const TableCell = forwardRef<
	HTMLTableCellElement,
	TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
	<td
		ref={ref}
		className={twMerge(
			"p-2 [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
			className,
		)}
		{...props}
	/>
))
TableCell.displayName = "TableCell"

const TableCaption = forwardRef<
	HTMLTableCaptionElement,
	HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
	<caption
		ref={ref}
		className={twMerge("mt-4 text-sm", className)}
		{...props}
	/>
))
TableCaption.displayName = "TableCaption"

export {
	Table,
	TableHeader,
	TableBody,
	TableFooter,
	TableHead,
	TableRow,
	TableCell,
	TableCaption,
}
