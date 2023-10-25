import React from "react"
import ShowcaseWrapperItem, {
	ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"

import { LoadingSpinner } from "@linked-planet/ui-kit-ts"

export default function LoadingSpinnerShowcase(props: ShowcaseProps) {
	//#region loadingspinner
	const example = (
		<div className="flex gap-4">
			<LoadingSpinner />
			<LoadingSpinner size="xsmall" />
			<LoadingSpinner size="small" />
			<LoadingSpinner size="medium" />
			<LoadingSpinner size="large" />
			<LoadingSpinner size="xlarge" />
		</div>
	)
	//#endregion loadingspinner

	return (
		<ShowcaseWrapperItem
			name="Loading Spinner"
			{...props}
			packages={[
				{
					name: "@linked-planet/ui-kit-ts",
					url: "https://www.github.com/linked-planet/ui-kit-ts",
				},
			]}
			examples={[
				{
					title: "Example",
					example,
					sourceCodeExampleId: "loadingspinner",
				},
			]}
		/>
	)
}
