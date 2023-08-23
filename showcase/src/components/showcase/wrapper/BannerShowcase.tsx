import React from "react"
import ShowcaseWrapperItem, {
	ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
import Banner from "@atlaskit/banner"
import WarningIcon from "@atlaskit/icon/glyph/warning"
import ErrorIcon from "@atlaskit/icon/glyph/error"

function BannerShowcase(props: ShowcaseProps) {
	// region: banner
	const example = (
		<Banner appearance="announcement">
			<span>Content of the banner...</span>
		</Banner>
	)

	const example2 = (
		<Banner appearance="warning" icon={<WarningIcon label="" />}>
			<span>Content of the banner...</span>
		</Banner>
	)

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
	// endregion: banner

	return (
		<ShowcaseWrapperItem
			name="Banner"
			sourceCodeExampleId="banner"
			{...props}
			packages={[
				{
					name: "@atlaskit/banner",
					url: "https://atlassian.design/components/banner/examples",
				},
			]}
			examples={[example, example2, example3]}
		/>
	)
}

export default BannerShowcase
