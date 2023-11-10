import React, { CSSProperties, useMemo, useState } from "react"
import {
	BookCard,
	BookCardComponents,
} from "@linked-planet/ui-kit-ts/components/BookCard"

import ShowcaseWrapperItem, {
	ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"

import Button, { ButtonGroup } from "@atlaskit/button"
import { Fieldset } from "@atlaskit/form"
import { Badge, SimpleTag, TagGroup } from "@linked-planet/ui-kit-ts"

//#region bookcardcomponents
function BookCardComponentsExample() {
	return (
		<BookCardComponents.CardBase
			header={
				<BookCardComponents.CardHeader>
					<BookCardComponents.CardHeaderMeta>
						<BookCardComponents.CardHeaderTitle>
							Book Title very very very very very very very very
							very very very very very very very long
						</BookCardComponents.CardHeaderTitle>
						<BookCardComponents.CardHeaderSubtitle>
							Book Subtitle
						</BookCardComponents.CardHeaderSubtitle>
					</BookCardComponents.CardHeaderMeta>
					<BookCardComponents.CardHeaderActions>
						<BookCardComponents.CardHeaderActionsInfo>
							<Badge appearance="default">action</Badge>
						</BookCardComponents.CardHeaderActionsInfo>
					</BookCardComponents.CardHeaderActions>
				</BookCardComponents.CardHeader>
			}
			defaultOpen={true}
		>
			<BookCardComponents.CardGridBody>
				<BookCardComponents.CardBodyEntry>
					<BookCardComponents.CardBodyEntryTitle>
						Book Entry Title very very very very very very very very
						very very very very very very very long
					</BookCardComponents.CardBodyEntryTitle>
					<div>Book Entry Content</div>
				</BookCardComponents.CardBodyEntry>
				<BookCardComponents.CardBodyEntry>
					<BookCardComponents.CardBodyEntryTitle>
						Book Entry Title 2
					</BookCardComponents.CardBodyEntryTitle>
					<div>Book Entry Content 2</div>
				</BookCardComponents.CardBodyEntry>
			</BookCardComponents.CardGridBody>
		</BookCardComponents.CardBase>
	)
}
//#endregion bookcardcomponents

function BookCardExample() {
	//#region bookcard
	const [bodyLayout, setBodyLayout] = useState<"row" | "grid" | "column">(
		"grid",
	)

	const [isClosed, setIsClosed] = useState<boolean | undefined>(undefined)

	const children = useMemo(() => {
		const childCount = bodyLayout === "column" ? 10 : 100
		const ret = Array(childCount)
		for (let i = 0; i < childCount; i++) {
			ret[i] = (
				<BookCardComponents.CardBodyEntry key={i}>
					<BookCardComponents.CardBodyEntryTitle>
						Book Entry Title {i}
					</BookCardComponents.CardBodyEntryTitle>
					<div>Book Entry Content {i}</div>
				</BookCardComponents.CardBodyEntry>
			)
		}
		return ret
	}, [bodyLayout])

	const bodyStyle = useMemo(() => {
		switch (bodyLayout) {
			case "row":
				break
			case "grid":
				return {
					maxHeight: "400px",
					overflowY: "auto",
					overflowX: "hidden",
				} satisfies CSSProperties
			case "column":
				return {
					maxHeight: "400px",
					overflowY: "auto",
					overflowX: "hidden",
				} satisfies CSSProperties
			default:
				break
		}
	}, [bodyLayout])

	const bookCardExample = (
		<>
			<BookCard
				title="Book Title very very very very very very very very very
						very very very very very very long"
				subtitle="Book Subtitle"
				bodyLayout={bodyLayout}
				bodyStyle={bodyStyle}
				closed={isClosed}
				actionsInfo={"Action:"}
				actions={
					<>
						<TagGroup>
							<SimpleTag
								key="action"
								text="action item"
								color="lightblue"
							/>
							<SimpleTag
								key="action 1"
								text="action item 1"
								color="lightgreen"
							/>
						</TagGroup>
					</>
				}
			>
				<>
					<BookCardComponents.CardBodyEntry>
						<BookCardComponents.CardBodyEntryTitle>
							Book Entry Title
						</BookCardComponents.CardBodyEntryTitle>
						<div>Book Entry Content</div>
					</BookCardComponents.CardBodyEntry>
					{children}
				</>
			</BookCard>
		</>
	)
	//#endregion bookcard

	return (
		<div>
			<div
				style={{
					display: "flex",
					flexDirection: "row",
					justifyContent: "space-between",
					marginBottom: "8px",
				}}
			>
				<Fieldset legend="Book Card Collapsible">
					<ButtonGroup>
						<Button
							isSelected={isClosed === false}
							onClick={() => setIsClosed(false)}
						>
							Opened
						</Button>
						<Button
							isSelected={isClosed === true}
							onClick={() => setIsClosed(true)}
						>
							Closed
						</Button>
						<Button
							isSelected={isClosed === undefined}
							onClick={() => setIsClosed(undefined)}
						>
							Closed Undefined
						</Button>
					</ButtonGroup>
				</Fieldset>
				<Fieldset legend="Book Card Body Layout">
					<ButtonGroup>
						<Button
							isSelected={bodyLayout === "row"}
							onClick={() => setBodyLayout("row")}
						>
							Row
						</Button>
						<Button
							isSelected={bodyLayout === "grid"}
							onClick={() => setBodyLayout("grid")}
						>
							Grid
						</Button>
						<Button
							isSelected={bodyLayout === "column"}
							onClick={() => setBodyLayout("column")}
						>
							Column
						</Button>
					</ButtonGroup>
				</Fieldset>
			</div>
			{bookCardExample}
		</div>
	)
}

export default function BookCardShowcase(props: ShowcaseProps) {
	return (
		<ShowcaseWrapperItem
			name="Book Card (Components)"
			{...props}
			packages={[
				{
					name: "@linked-planet/ui-kit-ts",
					url: "https://www.github.com/linked-planet/ui-kit-ts",
				},
			]}
			description={
				<>
					<p>
						Book Card is a card component that is used to display
						search result information or similar. It can be used as
						a collapsible component or as a static component.
					</p>
					<p>
						If <b>closed</b> is used, the collapse state is
						controlled. By <b>defaultOpen</b> if it collapsible but
						uncontrolled. If both are undefined, the component is
						static.
					</p>
					<p>
						Book Card is a composition of several components. The
						components can be used individually or as a whole.
					</p>
				</>
			}
			examples={[
				{
					title: "Complete Bookcard",
					example: <BookCardExample key="bookcardexample" />,
					sourceCodeExampleId: "bookcard",
				},
				{
					title: "Components",
					example: (
						<BookCardComponentsExample key="bookcardcomponentexample" />
					),
					sourceCodeExampleId: "bookcardcomponents",
				},
			]}
		/>
	)
}
