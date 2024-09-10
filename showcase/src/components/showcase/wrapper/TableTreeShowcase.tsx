import ShowcaseWrapperItem, {
	type ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
import TableTree, {
	Cell,
	Header,
	Headers,
	Row,
	Rows,
} from "@atlaskit/table-tree"

function TableTreeShowcase(props: ShowcaseProps) {
	//#region tabletree
	interface BookData {
		title: string
		description: string
	}

	interface TableTreeItem {
		id: string
		title: string
		description: string
		children: TableTreeItem[]
	}

	const bookDataTree = [
		{
			id: "1",
			content: { title: "It is lonely at the top.", description: "1" },
			hasChildren: true,
			children: [
				{
					id: "1.1",
					content: {
						title: "Look at me! I am nested.",
						description: "1.1",
					},
					hasChildren: true,
					children: [
						{
							id: "1.1.1",
							content: {
								title: "I am deeply nested.",
								description: "1.1.1",
							},
							hasChildren: false,
						},
					],
				},
			],
		},
		/*{
			id: "2",
			content: { title: "Typescript is fun", description: "2" },
			hasChildren: false,
		},*/
	]

	const bookDataTree2: TableTreeItem[] = [
		{
			id: "1",
			title: "It is lonely at the top.",
			description: "1",
			children: [
				{
					id: "1.1",
					title: "Look at me! I am nested.",
					description: "1.1",
					children: [
						{
							id: "1.1.1",
							title: "I am deeply nested.",
							description: "1.1.1",
							children: [],
						},
					],
				},
			],
		},
		{
			id: "2",
			title: "Typescript is fun",
			description: "2",
			children: [],
		},
	]
	const example1 = (
		<TableTree
			headers={["Title", "Numbering"]}
			columns={[
				(bookData: BookData) => <span>{bookData.title}</span>,
				(bookData: BookData) => <span>{bookData.description}</span>,
			]}
			columnWidths={[300, 100]}
			items={bookDataTree}
		/>
	)
	//#endregion tabletree

	//#region tabletree2
	const example2 = (
		<TableTree>
			<Headers>
				<Header
					width="400px"
					onClick={() => window.alert("OnClick Chapter Title Header")}
				>
					Chapter Title (Click me)
				</Header>
				<Header width="100px">Numbering</Header>
			</Headers>
			<Rows
				items={bookDataTree2}
				render={(data: TableTreeItem) => (
					<Row
						itemId={data.description}
						items={data.children}
						hasChildren={
							data?.children !== undefined &&
							data.children.length > 0
						}
						isDefaultExpaned={false}
					>
						<Cell singleLine={true}>
							<div
								onClick={() =>
									window.alert(`onClick: ${data.title}`)
								}
								onKeyUp={(e) => {
									if (e.key === "Enter") {
										window.alert(`onKeyUp: ${data.title}`)
									}
								}}
							>
								{data.title}
							</div>
						</Cell>
						<Cell singleLine={true}>
							<div
								onClick={() =>
									window.alert(`onClick: ${data.description}`)
								}
								onKeyUp={(e) => {
									if (e.key === "Enter") {
										window.alert(
											`onKeyUp: ${data.description}`,
										)
									}
								}}
							>
								{data.description}
							</div>
						</Cell>
					</Row>
				)}
			/>
		</TableTree>
	)
	//#endregion tabletree2

	return (
		<ShowcaseWrapperItem
			name="TableTree"
			{...props}
			packages={[
				{
					name: "@atlaskit/table-tree",
					url: "https://atlassian.design/components/table-tree",
				},
			]}
			examples={[
				{
					title: "Example 1",
					example: example1,
					sourceCodeExampleId: "tabletree",
				},
				{
					title: "Example 2",
					example: example2,
					sourceCodeExampleId: "tabletree2",
				},
			]}
		/>
	)
}

export default TableTreeShowcase
