import React from "react"
import ShowcaseWrapperItem, {
	type ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
import ErrorIcon from "@atlaskit/icon/glyph/error"
import CheckCircleOutlineIcon from "@atlaskit/icon/glyph/check-circle-outline"
import { Banner, IconSizeHelper } from "@linked-planet/ui-kit-ts"

function BannerShowcase(props: ShowcaseProps) {
	//#region banner-example
	const bannerExample = (
		<div className="flex w-full flex-col gap-4">
			<Banner appearance="announcement">Announcement Banner</Banner>
			<Banner appearance="warning">Warning Banner</Banner>
			<Banner
				appearance="error"
				icon={
					<IconSizeHelper>
						<ErrorIcon
							label=""
							secondaryColor="var(--ds-background-danger-bold, #DE350B)"
						/>
					</IconSizeHelper>
				}
			>
				Error Banner
			</Banner>
			<Banner
				appearance="success"
				icon={
					<IconSizeHelper>
						<CheckCircleOutlineIcon label="" />
					</IconSizeHelper>
				}
			>
				Success Banner
			</Banner>
			<Banner appearance="information">Information Banner</Banner>
		</div>
	)

	return (
		<ShowcaseWrapperItem
			name="Banner"
			{...props}
			packages={[
				{
					name: "@linked-planet/ui-kit-ts",
					url: "single?component=Banner",
				},
			]}
			examples={[
				{
					title: "Example",
					example: bannerExample,
					sourceCodeExampleId: "banner-example",
				},
			]}
		/>
	)
}

export default BannerShowcase
