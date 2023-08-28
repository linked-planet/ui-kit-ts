import React from "react"
import ShowcaseWrapperItem, {
	ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
import Banner from "@atlaskit/banner"
import WarningIcon from "@atlaskit/icon/glyph/warning"
import ErrorIcon from "@atlaskit/icon/glyph/error"

function BannerShowcase(props: ShowcaseProps) {
	//#region banner1
	const example = (
		<Banner appearance="announcement">
			<span>Content of the banner...</span>
		</Banner>
	)
	//#endregion banner1

	//#region banner2
	const example2 = (
		<Banner appearance="warning" icon={<WarningIcon label="" />}>
			<span>Content of the banner...</span>
		</Banner>
	)
	//#endregion banner2

	//#region banner3
	const example3 = (
		<Banner
			appearance="error"
			icon={
				<ErrorIcon
					secondaryColor="var(--ds-background-danger-bold, #DE350B)"
					label=""
				/>
			}
		>
			<span>Content of the banner...</span>
		</Banner>
	)
	//#endregion banner3

	return (
		<ShowcaseWrapperItem
			name="Banner"
			{...props}
			packages={[
				{
					name: "@atlaskit/banner",
					url: "https://atlassian.design/components/banner/examples",
				},
			]}
			examples={[
				{
					title: "Example 1",
					example: example,
					sourceCodeExampleId: "banner1",
				},
				{
					title: "Example 2",
					example: example2,
					sourceCodeExampleId: "banner2",
				},
				{
					title: "Example 3",
					example: example3,
					sourceCodeExampleId: "banner3",
				},
			]}
		/>
	)
}

export default BannerShowcase
