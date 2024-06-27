import React from "react"
import ShowcaseWrapperItem, {
	type ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"

export default function AppLayoutShowcase(props: ShowcaseProps) {
	const iframe = (
		<div>
			<iframe
				src="/ui-kit-ts/applayoutexample/index.html"
				title="App Layout"
				width="1100"
				height="800"
			/>
		</div>
	)

	return (
		<ShowcaseWrapperItem
			name="App Layout"
			{...props}
			packages={[
				{
					name: "@linked-planet/ui-kit-ts",
					url: "https://linked-planet.github.io/ui-kit-ts/applayoutexample/index.html",
				},
			]}
			examples={[
				{
					title: "App Layout",
					example: iframe,
					sourceCodeExampleId: "applayoutexample",
				},
			]}
		/>
	)
}
