import React, { useEffect, useMemo, useState } from "react"
import { twMerge } from "tailwind-merge"
import { Dropdown, type DropdownMenuProps } from "./DropdownMenu"
import ChevronUpIcon from "@atlaskit/icon/glyph/chevron-up"
import ChevronRightLargeIcon from "@atlaskit/icon/glyph/chevron-right-large"
import ChevronLeftLargeIcon from "@atlaskit/icon/glyph/chevron-left-large"

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
	const [pageSizeUsed, setPageSizeUsed] = useState(
		pageSize ?? defaultPageSize,
	)

	if (pageSize && pageSizeUsed !== pageSize) {
		setPageSizeUsed(pageSize)
	}

	const pageSizesItems = useMemo(
		() =>
			pageSizes.map((size) => (
				<Dropdown.Item
					key={size}
					isSelected={pageSizeUsed === size}
					onClick={() => {
						if (pageSizeUsed === size) return
						setPageSizeUsed(size)
						onPageSizeChange?.(size)
					}}
				>
					{size}
				</Dropdown.Item>
			)),
		[pageSizeUsed, pageSizes, onPageSizeChange],
	)

	return (
		<div className="flex items-center gap-2">
			<span>{pageSizeTitle}</span>
			<Dropdown.Menu
				trigger={
					<div className="hover:bg-neutral-hovered active:bg-neutral-pressed flex select-none items-center justify-center rounded bg-transparent p-1.5">
						{pageSizeUsed}
						<ChevronUpIcon size="small" label="" />
					</div>
				}
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
}: {
	pages: P[]
	currentPage?: P
	defaultPage?: P
	currentPageIndex?: number
	defaultPageIndex?: number
	onPageIndexChange?: (pageIndex: number) => void
	onPageChange?: (page: P) => void
	maxPageButtons: number
}) {
	const [currentPageUsed, setCurrentPageUsed] = useState(
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
			setCurrentPageUsed(pages[defaultPageIndex])
		}
	}, [currentPage, currentPageIndex, defaultPage, defaultPageIndex, pages])

	if (currentPage != null && currentPageUsed !== currentPage) {
		setCurrentPageUsed(currentPage)
	}

	if (
		currentPage == null &&
		currentPageIndex != null &&
		currentPageUsed !== pages[currentPageIndex]
	) {
		setCurrentPageUsed(pages[currentPageIndex])
	}

	const visiblePages = useMemo(() => {
		const halfMaxPageButtons = Math.floor(maxPageButtons / 2)
		if (pages.length <= maxPageButtons) return pages
		const currentIndexUsed = pages.indexOf(currentPageUsed)

		let ret: (P | string)[] = []

		if (currentIndexUsed < halfMaxPageButtons) {
			ret = pages.slice(0, maxPageButtons)
			if (maxPageButtons >= 5 && pages.length > maxPageButtons) {
				ret[maxPageButtons - 2] = "..."
				ret[maxPageButtons - 1] = pages[pages.length - 1]
			}
		} else if (currentIndexUsed > pages.length - halfMaxPageButtons) {
			ret = pages.slice(pages.length - maxPageButtons)
			if (maxPageButtons >= 5 && pages.length > maxPageButtons) {
				ret[1] = "..."
				ret[0] = pages[0]
			}
		} else {
			let start = currentIndexUsed - halfMaxPageButtons
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
	}, [currentPageUsed, maxPageButtons, pages])

	const currentIdx = pages.indexOf(currentPageUsed)

	return (
		<div className="flex">
			<button
				disabled={currentIdx <= 0}
				className={`flex h-8 w-8 select-none items-center justify-center rounded p-1.5 ${
					currentIdx > 0
						? "hover:bg-neutral-hovered active:bg-neutral-pressed text-text"
						: "text-disabled-text"
				}`}
				onClick={() => {
					const currentIndex = pages.indexOf(currentPageUsed)
					setCurrentPageUsed(pages[currentIndex - 1])
					onPageIndexChange?.(currentIndex - 1)
					onPageChange?.(pages[currentIndex - 1])
				}}
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
								page === currentPageUsed
									? "bg-selected text-selected-text-inverse"
									: "hover:bg-neutral-hovered active:bg-neutral-pressed",
							)}
							onClick={() => {
								const currentIndex = pages.indexOf(page as P)
								setCurrentPageUsed(page as P)
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
					const currentIndexUsed = pages.indexOf(currentPageUsed)
					setCurrentPageUsed(pages[currentIndexUsed + 1])
					onPageIndexChange?.(currentIndexUsed + 1)
					onPageChange?.(pages[currentIndexUsed + 1])
				}}
				disabled={currentIdx >= pages.length - 1}
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
	maxPageButtons = 5,
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
	className?: string
	style?: React.CSSProperties
}) {
	const pagesUsed = useMemo(() => {
		if (pages) return pages
		if (totalPages)
			return Array.from({ length: totalPages }, (_, i) => i + 1) as P[]
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
					pages={pagesUsed}
					currentPage={currentPage}
					defaultPage={defaultPage}
					currentPageIndex={currentPageIndex}
					defaultPageIndex={defaultPageIndex}
					onPageChange={onPageChange}
					onPageIndexChange={onPageIndexChange}
					maxPageButtons={maxPageButtons}
				/>
			</div>
			{!hidePageSize && (
				<div className="flex-none">
					<PageSizeSelector
						onPageSizeChange={(ps) => {
							onPageSizeChange?.(ps)
							onPageChange?.(pagesUsed[0])
							onPageIndexChange?.(0)
						}}
						{...pageSizeSelectorProps}
					/>
				</div>
			)}
		</div>
	)
}
