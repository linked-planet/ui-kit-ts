import { Banner, IconSizeHelper } from "@linked-planet/ui-kit-ts"
import { CircleCheckIcon, OctagonAlertIcon } from "lucide-react"
import ShowcaseWrapperItem, {
	type ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"

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
						<OctagonAlertIcon
							aria-label="Error"
							size="24"
							strokeWidth={2}
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
						<CircleCheckIcon
							aria-label="Check Circle"
							size="24"
							strokeWidth={2}
						/>
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
