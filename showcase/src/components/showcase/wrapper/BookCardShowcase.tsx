import { BookCardComponents } from "@linked-planet/ui-kit-ts/components/BookCard"
import React from "react"
import ShowcaseWrapperItem, {
	ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"

//#region bookcard
function BookCardComponentsExample() {
	return (
		<div>
			<BookCardComponents.BookCardBase>
				<BookCardComponents.BookCardHeader>
					<BookCardComponents.BookCardHeaderTitle>
						Book Title
					</BookCardComponents.BookCardHeaderTitle>
					<BookCardComponents.BookCardHeaderSubtitle>
						Book Subtitle
					</BookCardComponents.BookCardHeaderSubtitle>
				</BookCardComponents.BookCardHeader>
				<BookCardComponents.BookCardBody>
					<BookCardComponents.BookCardBodyEntry>
						<BookCardComponents.BookCardBodyEntryTitle>
							Book Entry Title
						</BookCardComponents.BookCardBodyEntryTitle>
						<div>Book Entry Content</div>
					</BookCardComponents.BookCardBodyEntry>
					<BookCardComponents.BookCardBodyEntry>
						<BookCardComponents.BookCardBodyEntryTitle>
							Book Entry Title
						</BookCardComponents.BookCardBodyEntryTitle>
						<div>Book Entry Content</div>
					</BookCardComponents.BookCardBodyEntry>
				</BookCardComponents.BookCardBody>
			</BookCardComponents.BookCardBase>
		</div>
	)
}

function BookCardExample() {
	return <></>
}
//#endregion

export default function BookCardShowcase(props: ShowcaseProps) {
	return (
		<ShowcaseWrapperItem
			name="Book Card (Components)"
			sourceCodeExampleId="bookcard"
			{...props}
			packages={[
				{
					name: "@linked-planet/ui-kit-ts",
					url: "https://www.github.com/linked-planet/ui-kit-ts",
				},
			]}
			examples={[
				<BookCardComponentsExample key="bookcardcomponentexample" />,
				<BookCardExample key="bookcardexample" />,
			]}
		/>
	)
}
