import React from "react"
import ShowcaseWrapperItem, {
	ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"

import { LoadingSpinner } from "@linked-planet/ui-kit-ts"

export default function LoadingSpinnerShowcase(props: ShowcaseProps) {
	const example = (
		<div>
			<LoadingSpinner height="2rem" />
		</div>
	)

	return (
		<ShowcaseWrapperItem
			name="Loading Spinner"
			sourceCodeExampleId="loadingspinner"
			{...props}
			packages={[
				{
					name: "@linked-planet/ui-kit-ts",
					url: "https://www.github.com/linked-planet/ui-kit-ts",
				},
			]}
			examples={[example]}
		/>
	)
}
