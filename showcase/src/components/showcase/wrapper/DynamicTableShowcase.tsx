import React from "react"
import ShowcaseWrapperItem, {
	ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
import DynamicTable from "@atlaskit/dynamic-table"
import Button from "@atlaskit/button"

function DynamicTableShowcase(props: ShowcaseProps) {
	// region: table
	const example = (
		<div style={{ minWidth: 300 }}>
			<DynamicTable
				caption=""
				head={{
					cells: [
						{
							key: "first",
							content: "First col",
							isSortable: true,
						},
						{
							key: "second",
							content: "Second col",
							isSortable: true,
						},
						{ key: "third", content: <span>Action col</span> },
					],
				}}
				rowsPerPage={3}
				rows={[
					{
						key: "1stRow",
						cells: [
							{ content: "1-1" },
							{ content: "1-2" },
							{
								content: (
									<Button appearance="primary">Delete</Button>
								),
							},
						],
					},
					{
						key: "2ndRow",
						cells: [
							{ content: "2-1" },
							{ content: "2-2" },
							{
								content: (
									<Button appearance="primary">Delete</Button>
								),
							},
						],
					},
					{
						key: "3rdRow",
						cells: [
							{ content: "3-1" },
							{ content: "3-2" },
							{
								content: (
									<Button appearance="primary">Delete</Button>
								),
							},
						],
					},
					{
						key: "4thRow",
						cells: [
							{ content: "4-1" },
							{ content: "4-2" },
							{
								content: (
									<Button appearance="primary">Delete</Button>
								),
							},
						],
					},
					{
						key: "5thRow",
						cells: [
							{ content: "5-1" },
							{ content: "5-2" },
							{
								content: (
									<Button appearance="primary">Delete</Button>
								),
							},
						],
					},
					{
						key: "6thRow",
						cells: [
							{ content: "6-1" },
							{ content: "6-2" },
							{
								content: (
									<Button appearance="primary">Delete</Button>
								),
							},
						],
					},
				]}
				onSort={(item) => console.log("Sorting", item)}
				onSetPage={(pageNumber) =>
					console.log("SetPageNumber", pageNumber)
				}
			></DynamicTable>
		</div>
	)
	// endregion: table

	return (
		<ShowcaseWrapperItem
			name="Dynamic table"
			sourceCodeExampleId="table"
			{...props}
			packages={[
				{
					name: "@atlaskit/dynamic-table",
					url: "https://atlassian.design/components/dynamic-table/examples",
				},
			]}
			examples={[example]}
		/>
	)
}

export default DynamicTableShowcase
