import React, { useMemo, useState } from "react"
import { default as AKPagination } from "@atlaskit/pagination"
import { twMerge } from "tailwind-merge"
import { Dropdown, type DropdownMenuProps } from "./DropdownMenu"

function PageSizeSelector({
	pageSize,
	defaultPageSize = 20,
	pageSizes = [10, 20, 50, 100],
	setPageSize,
	pageSizeMenuPlacement = "bottom",
	pageSizeMenuAlignment = "start",
	pageSizeTitle = "",
}: {
	pageSizes?: number[]
	pageSize?: number
	defaultPageSize?: number
	setPageSize?: (pageSize: number) => void
	pageSizeMenuPlacement?: DropdownMenuProps["placement"]
	pageSizeMenuAlignment?: DropdownMenuProps["align"]
	pageSizeTitle?: string
}) {
	const [pageSizeUsed, setPageSizeUsed] = useState(
		pageSize ?? defaultPageSize,
	)

	if (pageSize && pageSizeUsed !== pageSize) {
		setPageSizeUsed(pageSize)
	}

	const pageSizesItems = useMemo(
		() =>
			pageSizes.map((size) => (
				<Dropdown.Item key={size} isSelected={pageSizeUsed === size}>
					<a
						onClick={() => {
							setPageSizeUsed(size)
							setPageSize?.(size)
						}}
						className="no-underline"
					>
						{size}
					</a>
				</Dropdown.Item>
			)),
		[pageSizeUsed, pageSizes, setPageSize],
	)

	return (
		<>
			<>{pageSizeTitle}</>
			<Dropdown.Menu
				trigger={
					<div>
						<div className="hover:bg-neutral-hovered active:bg-neutral-pressed bg-neutral flex w-10 items-center justify-center rounded p-1.5">
							{pageSizeTitle} {pageSizeUsed}
						</div>
					</div>
				}
				placement={pageSizeMenuPlacement}
				align={pageSizeMenuAlignment}
			>
				{pageSizesItems}
			</Dropdown.Menu>
		</>
	)
}

/**
 * Pagination components (1 indexed!)
 */
export function Pagination({
	totalPages,
	maxPageButtons = 6,
	currentPage,
	defaultPage = 1,
	pages,
	setCurrentPage,
	hidePageSize = false,
	className,
	style,
	...pageSizeSelectorProps
}: {
	totalPages?: number
	currentPage?: number
	defaultPage?: number
	pages?: number[]
	maxPageButtons?: number
	setCurrentPage: (pageNumber: number) => void
	hidePageSize?: boolean
	pageSizes?: number[]
	pageSize?: number
	defaultPageSize?: number
	setPageSize?: (pageSize: number) => void
	pageSizeMenuPlacement?: DropdownMenuProps["placement"]
	pageSizeMenuAlignment?: DropdownMenuProps["align"]
	pageSizeTitle?: string
	className?: string
	style?: React.CSSProperties
}) {
	const pagesUsed = useMemo(() => {
		if (pages) return pages
		if (totalPages)
			return Array.from({ length: totalPages }, (_, i) => i + 1)
		return [1]
	}, [pages, totalPages])

	let currentPageIndex = 0
	if (currentPage) {
		currentPageIndex = pagesUsed.findIndex((it) => it === currentPage)
		if (currentPageIndex === -1) {
			console.warn(
				"Current page is not in pages array!",
				currentPage,
				pagesUsed,
			)
			setCurrentPage(pagesUsed[0])
			currentPageIndex = 0
		}
	}

	return (
		<div
			className={twMerge("flex flex-1 items-center px-1", className)}
			style={style}
		>
			<div className="flex flex-1 items-center justify-center">
				<AKPagination
					pages={pagesUsed}
					max={maxPageButtons}
					selectedIndex={currentPageIndex}
					defaultSelectedIndex={defaultPage}
					onChange={(_, page: number) => {
						setCurrentPage(page)
					}}
				/>
			</div>
			{!hidePageSize && (
				<div className="flex-none">
					<PageSizeSelector {...pageSizeSelectorProps} />
				</div>
			)}
		</div>
	)
}
