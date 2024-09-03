import ChevronLeftLargeIcon from "@atlaskit/icon/glyph/chevron-left-large"
import ChevronRightLargeIcon from "@atlaskit/icon/glyph/chevron-right-large"
import { useEffect, useMemo, useState } from "react"
import { twMerge } from "tailwind-merge"
import { Dropdown, type DropdownMenuProps } from "./DropdownMenu"
import { IconSizeHelper } from "./IconSizeHelper"

const triggerClassName =
	"h-8 hover:bg-neutral-hovered active:bg-neutral-pressed flex select-none items-center justify-center rounded bg-transparent p-1.5"

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
				trigger={pageSize}
				triggerClassName={triggerClassName}
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
	label = "Pagination",
	className,
	style,
	pageLabel,
	pageButtonClassName,
	pageButtonStyle,
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
	pageLabel?: string
	className?: string
	style?: React.CSSProperties
	pageButtonClassName?: string
	pageButtonStyle?: React.CSSProperties
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
		<nav className={className} style={style} aria-label={label}>
			<ul className="flex list-none items-center">
				<li className="m-0">
					<button
						disabled={currentIdx <= 0}
						className={twMerge(
							`flex h-8 w-8 select-none items-center justify-center rounded p-1.5 ${
								currentIdx > 0
									? "hover:bg-neutral-hovered active:bg-neutral-pressed text-text"
									: "text-disabled-text"
							}`,
							pageButtonClassName,
						)}
						onClick={() => {
							const currentIndex = pages.indexOf(_currentPage)
							setCurrentPage(pages[currentIndex - 1])
							onPageIndexChange?.(currentIndex - 1)
							onPageChange?.(pages[currentIndex - 1])
						}}
						title={previousLabel}
						aria-label={previousLabel}
						aria-disabled={currentIdx >= pages.length - 1}
						type="button"
					>
						<IconSizeHelper>
							<ChevronLeftLargeIcon size="medium" label="" />
						</IconSizeHelper>
					</button>
				</li>
				{visiblePages.map((page) => (
					<li key={page} aria-hidden={page === "..."} className="m-0">
						{page !== "..." ? (
							<button
								className={twMerge(
									"flex h-8 min-w-8 select-none items-center justify-center rounded p-1.5",
									"data-[current=true]:bg-selected data-[current=true]:text-selected-text-inverse",
									"hover:bg-neutral-hovered active:bg-neutral-pressed",
									pageButtonClassName,
								)}
								onClick={() => {
									const currentIndex = pages.indexOf(
										page as P,
									)
									setCurrentPage(page as P)
									onPageIndexChange?.(currentIndex)
									onPageChange?.(page as P)
								}}
								onKeyUp={(e) => {
									if (e.key === "Enter") {
										const currentIndex = pages.indexOf(
											page as P,
										)
										setCurrentPage(page as P)
										onPageIndexChange?.(currentIndex)
										onPageChange?.(page as P)
									}
								}}
								aria-label={`${pageLabel} ${page}`}
								type="button"
								aria-current={
									page === _currentPage ? "page" : undefined
								}
								style={pageButtonStyle}
								data-current={page === _currentPage}
							>
								{page}
							</button>
						) : (
							<div
								key={page}
								className="flex h-8 w-8 select-none items-center justify-center rounded p-1.5"
								aria-hidden="true"
							>
								{page} {/* is "..." */}
							</div>
						)}
					</li>
				))}
				<li className="m-0">
					<button
						className={twMerge(
							`flex h-8 w-8 select-none items-center justify-center rounded p-1.5 ${
								currentIdx < pages.length - 1
									? "hover:bg-neutral-hovered active:bg-neutral-pressed text-text"
									: "text-disabled-text"
							}`,
							pageButtonClassName,
						)}
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
						type="button"
						style={pageButtonStyle}
					>
						<IconSizeHelper>
							<ChevronRightLargeIcon size="medium" label="" />
						</IconSizeHelper>
					</button>
				</li>
			</ul>
		</nav>
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
	pageLabel = "",
	pageButtonClassName,
	pageButtonStyle,
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
	pageLabel?: string
	className?: string
	style?: React.CSSProperties
	pageButtonClassName?: string
	pageButtonStyle?: React.CSSProperties
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
					pageLabel={pageLabel}
					pageButtonClassName={pageButtonClassName}
					pageButtonStyle={pageButtonStyle}
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
