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
import { SimpleTag } from "@atlaskit/tag"

//#region bookcardcomponents
function BookCardComponentsExample() {
	return (
		<BookCardComponents.CardBase
			header={
				<BookCardComponents.CardHeader>
					<BookCardComponents.CardHeaderMeta>
						<BookCardComponents.CardHeaderTitle>
							Book Title
						</BookCardComponents.CardHeaderTitle>
						<BookCardComponents.CardHeaderSubtitle>
							Book Subtitle
						</BookCardComponents.CardHeaderSubtitle>
					</BookCardComponents.CardHeaderMeta>
				</BookCardComponents.CardHeader>
			}
			defaultClosed={false}
		>
			<BookCardComponents.CardGridBody>
				<BookCardComponents.CardBodyEntry>
					<BookCardComponents.CardBodyEntryTitle>
						Book Entry Title
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
	const [bodyLayout, setBodyLayout] = useState<"row" | "grid" | "column">(
		"grid",
	)

	const [defaultClosed, setDefaultClosed] = useState<
		boolean | undefined | null
	>(false)

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

	//#region bookcard
	const bookCardExample = (
		<BookCard
			title="Book Title"
			subtitle="Book Subtitle"
			bodyLayout={bodyLayout}
			bodyStyle={bodyStyle}
			defaultClosed={defaultClosed}
			actionsInfo={"Actions Informations:"}
			actions={
				<>
					<SimpleTag key="action" text="action item" color="blue" />
					<SimpleTag
						key="action 1"
						text="action item 1"
						color="green"
					/>
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
							isSelected={defaultClosed === false}
							onClick={() => setDefaultClosed(false)}
						>
							Default Closed False
						</Button>
						<Button
							isSelected={defaultClosed === true}
							onClick={() => setDefaultClosed(true)}
						>
							Default Closed True
						</Button>
						<Button
							isSelected={defaultClosed === undefined}
							onClick={() => setDefaultClosed(undefined)}
						>
							Default Closed Undefined
						</Button>
					</ButtonGroup>
					<p
						style={{
							marginBottom: "1rem",
						}}
					>
						<b>defaultClosed: </b>
						<br></br>
						<em>true/false</em> - card is collapsible<br></br>
						<em>undefined/null</em> - card is not collapsible
					</p>
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
			examples={[
				{
					title: "Components",
					example: (
						<BookCardComponentsExample key="bookcardcomponentexample" />
					),
					sourceCodeExampleId: "bookcardcomponents",
				},
				{
					title: "Complete Bookcard",
					example: <BookCardExample key="bookcardexample" />,
					sourceCodeExampleId: "bookcard",
				},
			]}
		/>
	)
}
