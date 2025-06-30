import { InlineMessage } from "@linked-planet/ui-kit-ts"

import ShowcaseWrapperItem, {
	type ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"

export default function InlineMessageShowcase(props: ShowcaseProps) {
	//#region inlinemessage
	const example = (
		<>
			<InlineMessage
				message={{ text: "This is a standard inline message." }}
			/>
			<InlineMessage
				message={{
					text: "This is a success inline message.",
					appearance: "success",
				}}
			/>
			<InlineMessage
				message={{
					text: "This is a danger inline message.",
					appearance: "danger",
				}}
			/>
			<InlineMessage
				message={{
					text: "This is a warning inline message.",
					appearance: "warning",
				}}
			/>
			<InlineMessage
				message={{
					text: "This is an information inline message.",
					appearance: "information",
				}}
			/>
			<InlineMessage
				message={{
					text: "This is a discovery inline message.",
					appearance: "discovery",
				}}
			/>
			<hr />
			<InlineMessage
				message={{
					text: "This is an information message with a timeout.",
					timeOut: 5,
					appearance: "information",
				}}
				openingDirection="topdown"
			/>
			<InlineMessage
				message={{
					text: "This is an discovery message with a timeout and bottom up removal.",
					appearance: "discovery",
				}}
				openingDirection="bottomup"
			/>
			<InlineMessage
				message={{
					text: "This is a not removable message.",
					appearance: "information",
				}}
				removable={false}
			/>
		</>
	)
	//#endregion inlinemessage

	return (
		<ShowcaseWrapperItem
			name="Inline Message"
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
					sourceCodeExampleId: "inlinemessage",
				},
			]}
		/>
	)
}
