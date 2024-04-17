import React, { useEffect, useMemo, useState } from "react"
import { twMerge } from "tailwind-merge"
import ChevronUpIcon from "@atlaskit/icon/glyph/chevron-up"
import ChevronDownIcon from "@atlaskit/icon/glyph/chevron-down"
import ChevronRightLargeIcon from "@atlaskit/icon/glyph/chevron-right-large"
import ChevronLeftLargeIcon from "@atlaskit/icon/glyph/chevron-left-large"
import { type DropdownMenuProps, Dropdown } from "./DropdownMenu"

function PageSizeSelector({
	pageSize,
	defaultPageSize = 20,
	pageSizes = [10, 20, 50, 100],
	onPageSizeChange,
	pageSizeMenuSide = "bottom",
	pageSizeMenuAlign = "start",
	pageSizeTitle = "Items:",
}: {
	pageSizes?: number[]
	pageSize?: number
	defaultPageSize?: number
	onPageSizeChange?: (pageSize: number) => void
	pageSizeMenuSide?: DropdownMenuProps["side"]
	pageSizeMenuAlign?: DropdownMenuProps["align"]
	pageSizeTitle?: React.ReactNode
}) {
	const [_pageSize, setPageSizeUsed] = useState(pageSize ?? defaultPageSize)

	if (pageSize && _pageSize !== pageSize) {
		setPageSizeUsed(pageSize)
	}

	const pageSizesItems = useMemo(
		() =>
			pageSizes.map((size) => (
				<Dropdown.Item
					key={size}
					selected={_pageSize === size}
					onClick={() => {
						if (_pageSize === size) return
						setPageSizeUsed(size)
						onPageSizeChange?.(size)
					}}
				>
					{size}
				</Dropdown.Item>
			)),
		[_pageSize, pageSizes, onPageSizeChange],
	)

	return (
		<div className="flex items-center gap-2">
			<span>{pageSizeTitle}</span>
			<Dropdown.Menu
				trigger={({ opened }: { opened: boolean }) => (
					<div className="hover:bg-neutral-hovered active:bg-neutral-pressed flex select-none items-center justify-center rounded bg-transparent p-1.5">
						{_pageSize}
						{opened ? (
							<ChevronDownIcon size="small" label="" />
						) : (
							<ChevronUpIcon size="small" label="" />
						)}
					</div>
				)}
				side={pageSizeMenuSide}
				align={pageSizeMenuAlign}
			>
				{pageSizesItems}
			</Dropdown.Menu>
		</div>
	)
}

function PaginationPageHandler<P extends string | number>({
	pages,
	currentPage,
	defaultPage,
	currentPageIndex,
	defaultPageIndex,
	onPageIndexChange,
	onPageChange,
	maxPageButtons,
	previousLabel,
	nextLabel,
	label,
}: {
	pages: P[]
	currentPage?: P
	defaultPage?: P
	currentPageIndex?: number
	defaultPageIndex?: number
	onPageIndexChange?: (pageIndex: number) => void
	onPageChange?: (page: P) => void
	maxPageButtons: number
	previousLabel?: string
	nextLabel?: string
	label?: string
}) {
	const [_currentPage, setCurrentPage] = useState(
		currentPage ?? defaultPage ?? pages[0],
	)

	useEffect(() => {
		if (
			currentPage == null &&
			currentPageIndex == null &&
			defaultPage == null &&
			defaultPageIndex != null &&
			pages
		) {
			setCurrentPage(pages[defaultPageIndex])
		}
	}, [currentPage, currentPageIndex, defaultPage, defaultPageIndex, pages])

	if (currentPage != null && _currentPage !== currentPage) {
		setCurrentPage(currentPage)
	}

	if (
		currentPage == null &&
		currentPageIndex != null &&
		_currentPage !== pages[currentPageIndex]
	) {
		setCurrentPage(pages[currentPageIndex])
	}

	const visiblePages = useMemo(() => {
		const halfMaxPageButtons = Math.floor(maxPageButtons / 2)
		if (pages.length <= maxPageButtons) return pages
		const _currentIndex = pages.indexOf(_currentPage)

		let ret: (P | string)[] = []

		if (_currentIndex < halfMaxPageButtons) {
			ret = pages.slice(0, maxPageButtons)
			if (maxPageButtons >= 5 && pages.length > maxPageButtons) {
				ret[maxPageButtons - 2] = "..."
				ret[maxPageButtons - 1] = pages[pages.length - 1]
			}
		} else if (_currentIndex > pages.length - halfMaxPageButtons) {
			ret = pages.slice(pages.length - maxPageButtons)
			if (maxPageButtons >= 5 && pages.length > maxPageButtons) {
				ret[1] = "..."
				ret[0] = pages[0]
			}
		} else {
			let start = _currentIndex - halfMaxPageButtons
			let addEnd = true
			if (start >= pages.length - maxPageButtons) {
				start = pages.length - maxPageButtons
				addEnd = false
			}
			ret = pages.slice(start, start + maxPageButtons)
			if (addEnd) {
				if (maxPageButtons >= 5 && pages.length > maxPageButtons) {
					ret[ret.length - 2] = "..."
					ret[ret.length - 1] = pages[pages.length - 1]
				}
			}
			if (start > 0) {
				if (maxPageButtons >= 5 && pages.length > maxPageButtons) {
					ret[1] = "..."
					ret[0] = pages[0]
				}
			}
		}

		return ret
	}, [_currentPage, maxPageButtons, pages])

	const currentIdx = pages.indexOf(_currentPage)

	return (
		<div className="flex" title={label} aria-label={label}>
			<button
				disabled={currentIdx <= 0}
				className={`flex h-8 w-8 select-none items-center justify-center rounded p-1.5 ${
					currentIdx > 0
						? "hover:bg-neutral-hovered active:bg-neutral-pressed text-text"
						: "text-disabled-text"
				}`}
				onClick={() => {
					const currentIndex = pages.indexOf(_currentPage)
					setCurrentPage(pages[currentIndex - 1])
					onPageIndexChange?.(currentIndex - 1)
					onPageChange?.(pages[currentIndex - 1])
				}}
				title={previousLabel}
				aria-label={previousLabel}
				aria-disabled={currentIdx >= pages.length - 1}
			>
				<ChevronLeftLargeIcon size="medium" label="" />
			</button>
			{visiblePages.map((page, i) => (
				<div key={page + i.toString()}>
					{page !== "..." ? (
						<button
							key={page + i.toString()}
							className={twMerge(
								"flex h-8 min-w-8 select-none items-center justify-center rounded p-1.5",
								page === _currentPage
									? "bg-selected text-selected-text-inverse"
									: "hover:bg-neutral-hovered active:bg-neutral-pressed",
							)}
							onClick={() => {
								const currentIndex = pages.indexOf(page as P)
								setCurrentPage(page as P)
								onPageIndexChange?.(currentIndex)
								onPageChange?.(page as P)
							}}
						>
							{page}
						</button>
					) : (
						<div
							key={page}
							className="flex h-8 w-8 select-none items-center justify-center rounded p-1.5"
						>
							{page}
						</div>
					)}
				</div>
			))}
			<button
				className={`flex h-8 w-8 select-none items-center justify-center rounded p-1.5 ${
					currentIdx < pages.length - 1
						? "hover:bg-neutral-hovered active:bg-neutral-pressed text-text"
						: "text-disabled-text"
				}`}
				onClick={() => {
					const _currentIndex = pages.indexOf(_currentPage)
					setCurrentPage(pages[_currentIndex + 1])
					onPageIndexChange?.(_currentIndex + 1)
					onPageChange?.(pages[_currentIndex + 1])
				}}
				disabled={currentIdx >= pages.length - 1}
				title={nextLabel}
				aria-label={nextLabel}
				aria-disabled={currentIdx >= pages.length - 1}
			>
				<ChevronRightLargeIcon size="medium" label="" />
			</button>
		</div>
	)
}

/**
 * Pagination components (1 indexed!)
 */
export function Pagination<P extends string | number>({
	totalPages,
	maxPageButtons = 11,
	currentPage,
	currentPageIndex,
	defaultPage,
	defaultPageIndex = 0,
	pages,
	onPageChange,
	onPageIndexChange,
	hidePageSize = false,
	className,
	style,
	onPageSizeChange,
	label = "Pagination",
	previousLabel = "Previous Page",
	nextLabel = "Next Page",
	...pageSizeSelectorProps
}: {
	totalPages?: number
	currentPage?: P
	currentPageIndex?: number
	defaultPage?: P
	defaultPageIndex?: number
	pages?: P[]
	maxPageButtons?: number
	onPageChange?: (page: P) => void
	onPageIndexChange?: (pageIndex: number) => void
	hidePageSize?: boolean
	pageSizes?: number[]
	pageSize?: number
	defaultPageSize?: number
	onPageSizeChange?: (pageSize: number) => void
	pageSizeMenuSide?: DropdownMenuProps["side"]
	pageSizeMenuAlign?: DropdownMenuProps["align"]
	pageSizeTitle?: string
	label?: string
	previousLabel?: string
	nextLabel?: string
	className?: string
	style?: React.CSSProperties
}) {
	const _pages = useMemo(() => {
		if (pages) return pages
		if (totalPages)
			return Array.from(
				{ length: Math.ceil(totalPages) },
				(_, i) => i + 1,
			) as P[]
		return [1] as P[]
	}, [pages, totalPages])

	return (
		<div
			className={twMerge(
				"relative flex flex-1 items-center px-1",
				className,
			)}
			style={style}
		>
			<div className="flex flex-1 items-center justify-center">
				<PaginationPageHandler<P>
					pages={_pages}
					currentPage={currentPage}
					defaultPage={defaultPage}
					currentPageIndex={currentPageIndex}
					defaultPageIndex={defaultPageIndex}
					onPageChange={onPageChange}
					onPageIndexChange={onPageIndexChange}
					maxPageButtons={maxPageButtons}
					previousLabel={previousLabel}
					nextLabel={nextLabel}
					label={label}
				/>
			</div>
			{!hidePageSize && (
				<div className="flex-none">
					<PageSizeSelector
						onPageSizeChange={(ps) => {
							onPageSizeChange?.(ps)
							onPageChange?.(_pages[0])
							onPageIndexChange?.(0)
						}}
						{...pageSizeSelectorProps}
					/>
				</div>
			)}
		</div>
	)
}
