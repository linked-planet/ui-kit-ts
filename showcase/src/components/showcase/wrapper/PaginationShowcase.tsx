import React, { useState } from "react"
import ShowcaseWrapperItem, {
	ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
import { Pagination } from "@linked-planet/ui-kit-ts"

function PaginationShowcase(props: ShowcaseProps) {
	//#region pagination
	const [selectedPage, setSelectedPage] = useState(0)
	const [pageSize, setPageSize] = useState(10)

	const example = (
		<Pagination
			pages={[...Array(10)].map((item, index) => {
				return index + 1
			})}
			currentPage={selectedPage + 1}
			setCurrentPage={(page) => setSelectedPage(page - 1)}
			totalPages={10}
			maxPageButtons={6}
			pageSize={pageSize}
			pageSizes={[10, 20, 50, 100]}
			setPageSize={setPageSize}
			pageSizeMenuSide="top"
			pageSizeMenuAlign="end"
		/>
	)
	//#endregion pagination

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
					example,
					sourceCodeExampleId: "pagination",
				},
			]}
		/>
	)
}

export default PaginationShowcase
