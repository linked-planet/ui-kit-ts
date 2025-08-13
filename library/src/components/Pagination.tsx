import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { twMerge } from "tailwind-merge"
import { Dropdown, type DropdownMenuProps } from "./DropdownMenu"
import { IconSizeHelper } from "./IconSizeHelper"
import { focusOutlineStyles } from "./styleHelper"

const triggerClassName =
	"h-8 hover:bg-neutral-hovered active:bg-neutral-pressed flex select-none items-center justify-center rounded-xs bg-transparent p-1.5"

export type PageSizeSelectorProps = {
	pageSizes?: number[]
	pageSize?: number
	defaultPageSize?: number
	onPageSizeChange?: (pageSize: number) => void
	pageSizeMenuSide?: DropdownMenuProps["side"]
	pageSizeMenuAlign?: DropdownMenuProps["align"]
	pageSizeTitle?: React.ReactNode
	pageSizeTriggerClassName?: string
}

function PageSizeSelector({
	pageSize,
	defaultPageSize = 20,
	pageSizes = [10, 20, 50, 100],
	onPageSizeChange,
	pageSizeMenuSide = "bottom",
	pageSizeMenuAlign = "start",
	pageSizeTitle = "Items:",
	pageSizeTriggerClassName,
}: PageSizeSelectorProps) {
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
			{pageSizeTitle}
			<Dropdown.Menu
				trigger={pageSize}
				triggerClassName={twMerge(
					triggerClassName,
					pageSizeTriggerClassName,
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
	onNextPage,
	onPreviousPage,
	disableNextPageButton,
	disablePreviousPageButton,
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
	pages: P[] | undefined
	currentPage?: P
	defaultPage?: P
	currentPageIndex?: number
	defaultPageIndex?: number
	onPageIndexChange?: (pageIndex: number) => void
	onPageChange?: (page: P) => void
	onNextPage?: () => void
	onPreviousPage?: () => void
	disableNextPageButton?: boolean
	disablePreviousPageButton?: boolean
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
		currentPage ??
			defaultPage ??
			pages?.[0] ??
			pages?.[defaultPageIndex ?? 0] ??
			(1 as P), // fallback for totalPages case
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
		pages &&
		_currentPage !== pages[currentPageIndex]
	) {
		setCurrentPage(pages[currentPageIndex])
	}

	const { visiblePages, currentIndex } = useMemo(() => {
		if (!pages && !_currentPage)
			return { visiblePages: [], currentIndex: 0 }
		if (!pages && _currentPage) {
			return { visiblePages: [_currentPage], currentIndex: 0 }
		}
		if (!pages) {
			return { visiblePages: [], currentIndex: 0 }
		}
		const currentIndex =
			currentPageIndex ??
			(pages ? Math.max(0, pages.indexOf(_currentPage as P)) : 0)
		const halfMaxPageButtons = Math.ceil(maxPageButtons / 2)
		if (pages.length <= maxPageButtons)
			return { visiblePages: pages, currentIndex }

		const ret: (P | string)[] = []
		for (
			let i = currentIndex;
			i < currentIndex + halfMaxPageButtons && i < pages.length;
			i++
		) {
			ret.push(pages[i])
		}
		for (
			let i = currentIndex - 1;
			i >= 0 &&
			i >= currentIndex - maxPageButtons &&
			ret.length < maxPageButtons;
			i--
		) {
			ret.unshift(pages[i])
		}
		for (let i = ret.length; i < maxPageButtons && i < pages.length; i++) {
			ret.push(pages[i])
		}

		// ellipsis logic
		if (ret[1] !== pages[1]) {
			ret[1] = "..."
			ret[0] = pages[0]
		}
		if (ret[ret.length - 2] !== pages[pages.length - 2]) {
			ret[ret.length - 2] = "..."
			ret[ret.length - 1] = pages[pages.length - 1]
		}
		return { visiblePages: ret, currentIndex }
	}, [_currentPage, maxPageButtons, pages, currentPageIndex])

	const pageButtons = useMemo(() => {
		return visiblePages.map((page) => {
			return (
				<li
					key={
						page !== "..." ? page.toString() : `...${Math.random()}`
					}
					aria-hidden={page === "..."}
					className="m-0"
				>
					{page !== "..." ? (
						<button
							className={twMerge(
								"flex cursor-pointer h-8 min-w-8 select-none items-center justify-center rounded-xs p-1.5 border-0 border-none border-transparent bg-transparent",
								"data-[current=true]:bg-selected data-[current=true]:text-selected-text-inverse data-[current=true]:cursor-default",
								"hover:bg-neutral-hovered active:bg-neutral-pressed",
								focusOutlineStyles,
								pageButtonClassName,
							)}
							onClick={() => {
								if (!pages) return
								const currentIndex = pages.indexOf(page as P)
								setCurrentPage(page as P)
								onPageIndexChange?.(currentIndex)
								onPageChange?.(page as P)
							}}
							onKeyUp={(e) => {
								if (!pages) return
								if (e.key === "Enter") {
									const currentIndex = pages.indexOf(
										page as P,
									)
									setCurrentPage(page as P)
									onPageIndexChange?.(currentIndex)
									onPageChange?.(page as P)
								}
							}}
							disabled={!pages}
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
							className="flex h-8 w-8 select-none items-center justify-center rounded-xs p-1.5"
							aria-hidden="true"
						>
							...
						</div>
					)}
				</li>
			)
		})
	}, [
		visiblePages,
		pageButtonClassName,
		pageButtonStyle,
		pageLabel,
		_currentPage,
		pages,
		onPageIndexChange,
		onPageChange,
	])

	const disablePreviousPage =
		(pages && currentIndex <= 0) ||
		(currentPage == null && !pages) || // only disable if no pages AND no currentPage
		disablePreviousPageButton === true

	const disableNextPage =
		(pages && currentIndex >= pages.length - 1) ||
		(currentPage == null && !pages) || // only disable if no pages AND no currentPage
		disableNextPageButton === true

	return (
		<nav className={className} style={style} aria-label={label}>
			<ul className="flex list-none items-center p-0 m-0">
				<li className="m-0">
					<button
						disabled={disablePreviousPage}
						className={twMerge(
							`flex cursor-pointer disabled:cursor-default h-8 w-8 select-none items-center justify-center rounded p-1.5 border-0 border-none border-transparent bg-transparent ${
								!disablePreviousPage
									? "hover:bg-neutral-hovered active:bg-neutral-pressed text-text"
									: "text-disabled-text"
							} ${focusOutlineStyles}`,
							pageButtonClassName,
						)}
						onClick={() => {
							if (disablePreviousPage) return
							onPreviousPage?.()
							if (!pages || !_currentPage) return
							const currentIndex = pages.indexOf(_currentPage)
							setCurrentPage(pages[currentIndex - 1])
							onPageIndexChange?.(currentIndex - 1)
							onPageChange?.(pages[currentIndex - 1])
						}}
						title={previousLabel}
						type="button"
					>
						<IconSizeHelper>
							<ChevronLeftIcon size="16" aria-label="page left" />
						</IconSizeHelper>
					</button>
				</li>
				{pageButtons}
				<li className="m-0">
					<button
						className={twMerge(
							`flex cursor-pointer disabled:cursor-default h-8 w-8 select-none items-center justify-center rounded p-1.5 bg-transparent border-none border-0 border-transparent ${
								!disableNextPage
									? "hover:bg-neutral-hovered active:bg-neutral-pressed text-text"
									: "text-disabled-text"
							} ${focusOutlineStyles}`,
							pageButtonClassName,
						)}
						onClick={() => {
							onNextPage?.()
							if (!pages || !_currentPage) return
							const _currentIndex = pages.indexOf(_currentPage)
							setCurrentPage(pages[_currentIndex + 1])
							onPageIndexChange?.(_currentIndex + 1)
							onPageChange?.(pages[_currentIndex + 1])
						}}
						disabled={disableNextPage}
						title={nextLabel}
						type="button"
						style={pageButtonStyle}
					>
						<IconSizeHelper>
							<ChevronRightIcon
								size="16"
								laria-abel="page right"
							/>
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
	onNextPage,
	onPreviousPage,
	disableNextPageButton,
	disablePreviousPageButton,
	hidePageSize = false,
	className,
	style,
	label = "Pagination",
	previousLabel = "Previous Page",
	nextLabel = "Next Page",
	pageLabel = "",
	pageButtonClassName,
	pageButtonStyle,
	pageSelectorClassName,
	pageSelectorStyle,
	pageSizeSelectorProps,
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
	onNextPage?: () => void
	onPreviousPage?: () => void
	disableNextPageButton?: boolean
	disablePreviousPageButton?: boolean
	hidePageSize?: boolean
	label?: string
	previousLabel?: string
	nextLabel?: string
	pageLabel?: string
	className?: string
	style?: React.CSSProperties
	pageButtonClassName?: string
	pageButtonStyle?: React.CSSProperties
	pageSelectorClassName?: string
	pageSelectorStyle?: React.CSSProperties
	pageSizeSelectorProps?: PageSizeSelectorProps
}) {
	const _pages = useMemo(() => {
		if (pages) return pages
		if (totalPages) {
			return Array.from(
				{ length: Math.ceil(totalPages) },
				(_, i) => i + 1,
			) as P[]
		}
		return undefined
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
					onNextPage={onNextPage}
					onPreviousPage={onPreviousPage}
					maxPageButtons={maxPageButtons}
					previousLabel={previousLabel}
					nextLabel={nextLabel}
					label={label}
					pageLabel={pageLabel}
					pageButtonClassName={pageButtonClassName}
					pageButtonStyle={pageButtonStyle}
					disableNextPageButton={disableNextPageButton}
					disablePreviousPageButton={disablePreviousPageButton}
					className={pageSelectorClassName}
					style={pageSelectorStyle}
				/>
			</div>
			{!hidePageSize && (
				<div className="flex-none">
					<PageSizeSelector
						{...pageSizeSelectorProps}
						onPageSizeChange={(ps) => {
							pageSizeSelectorProps?.onPageSizeChange?.(ps)
							if (_pages) {
								onPageChange?.(_pages[0])
							}
							onPageIndexChange?.(0)
						}}
					/>
				</div>
			)}
		</div>
	)
}
