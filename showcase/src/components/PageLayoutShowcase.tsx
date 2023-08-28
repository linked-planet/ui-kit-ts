import { PageLayout } from "@linked-planet/ui-kit-ts"
import React from "react"
import ShowcaseWrapperItem, {
	ShowcaseProps,
} from "./ShowCaseWrapperItem/ShowcaseWrapperItem"

function PageLayoutExample() {
	//#region pagelayout
	return (
		<div
			style={{
				height: "40vh",
			}}
		>
			<PageLayout.Page>
				<PageLayout.PageHeader>
					<PageLayout.PageHeaderTitle>
						<h1>Page Header Title</h1>
					</PageLayout.PageHeaderTitle>
					<PageLayout.PageHeaderSubTitle>
						<h2>Page Header Sub Title</h2>
					</PageLayout.PageHeaderSubTitle>
					<PageLayout.PageHeaderLine>
						<div>Page Header Line</div>
						<div>Page Header Line</div>
						<div>Page Header Line</div>
					</PageLayout.PageHeaderLine>
				</PageLayout.PageHeader>
				<PageLayout.PageBody>
					<PageLayout.PageBodyHeader>
						Page Body Header
					</PageLayout.PageBodyHeader>
					<PageLayout.PageBodyContent>
						<div>TEST</div>
						{Array(100)
							.fill(null)
							.map((_, i) => (
								<div key={i}>Page Body Content {i}</div>
							))}
					</PageLayout.PageBodyContent>
					<PageLayout.PageBodyFooter>
						Page Body Footer
					</PageLayout.PageBodyFooter>
				</PageLayout.PageBody>
			</PageLayout.Page>
		</div>
	)
	//#endregion pagelayout
}

export default function PageLayoutShowcase(props: ShowcaseProps) {
	return (
		<ShowcaseWrapperItem
			name="PageLayout"
			{...props}
			packages={[
				{
					name: "@linked-planet/ui-kit-ts",
					url: "https://github.com/linked-planet/ui-kit-ts",
				},
			]}
			examples={[
				{
					title: "Page Layout",
					example: <PageLayoutExample />,
					sourceCodeExampleId: "pagelayout",
				},
			]}
		/>
	)
}
