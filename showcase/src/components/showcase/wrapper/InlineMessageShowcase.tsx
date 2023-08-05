import React from "react"
import ShowcaseWrapperItem, {
	ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"

import { InlineMessage } from "@linked-planet/ui-kit-ts"
import type { Message } from "@linked-planet/ui-kit-ts"

export default function InlineMessageShowcase(props: ShowcaseProps) {
	const example = (
		<>
			<InlineMessage
				message={{ text: "This is a standard inline message." }}
			/>
			<InlineMessage
				message={{
					text: "This is a success inline message.",
					urgency: "success",
				}}
			/>
			<InlineMessage
				message={{
					text: "This is an error inline message.",
					urgency: "error",
				}}
			/>
			<InlineMessage
				message={{
					text: "This is a danger inline message.",
					urgency: "danger",
				}}
			/>
			<InlineMessage
				message={{
					text: "This is a warning inline message.",
					urgency: "warning",
				}}
			/>
			<InlineMessage
				message={{
					text: "This is an information inline message.",
					urgency: "information",
				}}
			/>
			<InlineMessage
				message={{
					text: "This is a discovery inline message.",
					urgency: "discovery",
				}}
			/>
			<hr />
			<InlineMessage
				message={{
					text: "This is an information message with a timeout.",
					timeOut: 5,
					urgency: "information",
				}}
				openingDirection="topdown"
			/>
			<InlineMessage
				message={{
					text: "This is an discovery message with a timeout and buttomup removal.",
					timeOut: 5,
					urgency: "discovery",
				}}
				openingDirection="bottomup"
			/>
		</>
	)

	return (
		<ShowcaseWrapperItem
			name="Inline Message"
			sourceCodeExampleId="inlinemessage"
			overallSourceCode={props.overallSourceCode}
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
