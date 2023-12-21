import React, { useMemo, useState } from "react"
import ShowcaseWrapperItem, {
	ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
import { Pagination } from "@linked-planet/ui-kit-ts"
import { default as AKPagination } from "@atlaskit/pagination"

function PageExample() {
	//#region pagination
	const [selectedPage, setSelectedPage] = useState(1)
	const [pageSize, setPageSize] = useState(10)

	const pages = useMemo(
		() => [...Array(100)].map((item, index) => index + 1),
		[],
	)

	console.log("PAGE SIZE", pageSize)

	return (
		<>
			<Pagination
				pages={pages}
				currentPage={selectedPage}
				onPageChange={(page) => setSelectedPage(page)}
				totalPages={10}
				maxPageButtons={10}
				pageSize={pageSize}
				pageSizes={[10, 20, 50, 100]}
				onPageSizeChange={setPageSize}
				pageSizeMenuSide="top"
				pageSizeMenuAlign="end"
			/>
		</>
	)
	//#endregion pagination
}

function IndexExample() {
	//#region pagination
	const [selectedIndex, setSelectedIndex] = useState(0)
	const [pageSize, setPageSize] = useState(10)

	const pages = useMemo(
		() => [...Array(10)].map((item, index) => index + 1),
		[],
	)

	return (
		<>
			<Pagination
				pages={pages}
				currentPageIndex={selectedIndex}
				onPageIndexChange={(i) => setSelectedIndex(i)}
				totalPages={10}
				maxPageButtons={6}
				pageSize={pageSize}
				pageSizes={[10, 20, 50, 100]}
				onPageSizeChange={setPageSize}
				pageSizeMenuSide="top"
				pageSizeMenuAlign="end"
			/>
			{/*<AKPagination pages={pages} max={6} selectedIndex={selectedIndex} />*/}
		</>
	)
	//#endregion pagination
}

function PaginationShowcase(props: ShowcaseProps) {
	return (
		<ShowcaseWrapperItem
			name="Pagination"
			{...props}
			packages={[
				{
					name: "@linked-planet/ui-kit-ts",
					url: "https://linked-planet.github.io/ui-kit-ts/single#Pagination",
				},
			]}
			examples={[
				{
					title: "Example",
					example: <PageExample />,
					sourceCodeExampleId: "pagination",
				},
				{
					title: "Example Index",
					example: <IndexExample />,
					sourceCodeExampleId: "pagination",
				},
			]}
		/>
	)
}

export default PaginationShowcase
