import ShowcaseWrapperItem, {
	type ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
import { SectionMessage } from "@linked-planet/ui-kit-ts"

function SectionMessageShowcase(props: ShowcaseProps) {
	//#region section-message
	const example = (
		<div className="flex gap-3">
			<div className="flex flex-col gap-3">
				<SectionMessage
					title="Section Message Title"
					actions={[
						{
							content: "Action",
						},
						{
							content: "Action2",
						},
					]}
				>
					Default Section Message
				</SectionMessage>
				<SectionMessage appearance="success">
					Success Section Message
				</SectionMessage>
				<SectionMessage appearance="warning">
					Warning Section Message
				</SectionMessage>
				<SectionMessage appearance="error">
					Error Section Message
				</SectionMessage>
				<SectionMessage appearance="information">
					Information Section Message
				</SectionMessage>
				<SectionMessage appearance="discovery">
					Discovery Section Message
				</SectionMessage>
			</div>
		</div>
	)
	//#endregion section-message

	return (
		<ShowcaseWrapperItem
			name="Section Messsage"
			{...props}
			packages={[
				{
					name: "@linked-planet/ui-kit-ts",
					url: "/single?component=SectionMessage",
				},
			]}
			description="Drop in replacement for the @atlaskit/section-message component. Practically the same as the Flag."
			examples={[
				{
					title: "Example",
					example,
					sourceCodeExampleId: "section-message",
				},
			]}
		/>
	)
}

export default SectionMessageShowcase
