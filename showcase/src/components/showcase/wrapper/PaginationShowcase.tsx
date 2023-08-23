import React, { useState } from "react"
import ShowcaseWrapperItem, {
	ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
import Pagination from "@atlaskit/pagination"

function PaginationShowcase(props: ShowcaseProps) {
	// region: pagination
	const [selectedPage, setSelectedPage] = useState(0)
	const example = (
		<Pagination
			pages={[...Array(10)].map((item, index) => {
				return index + 1
			})}
			defaultSelectedIndex={0}
			max={10}
			selectedIndex={selectedPage}
			onChange={(event, page) => setSelectedPage(page - 1)}
		/>
	)
	// endregion: pagination

	return (
		<ShowcaseWrapperItem
			name="Pagination"
			sourceCodeExampleId="pagination"
			{...props}
			packages={[
				{
					name: "@atlaskit/pagination",
					url: "https://atlassian.design/components/pagination/examples",
				},
			]}
			examples={[example]}
		/>
	)
}

export default PaginationShowcase
