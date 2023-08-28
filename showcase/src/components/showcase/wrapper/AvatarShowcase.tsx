import React from "react"
import ShowcaseWrapperItem, {
	ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
import Avatar, { AvatarItem } from "@atlaskit/avatar"

function AvatarShowcase(props: ShowcaseProps) {
	//#region avatar1
	const example1 = (
		<AvatarItem avatar={<Avatar size="large" presence="online" />} />
	)
	//#endregion avatar1

	//#region avatar2
	const example2 = (
		<AvatarItem
			primaryText="Carl Coder"
			secondaryText="Software Engineer"
			avatar={<Avatar size="large" presence="online" />}
		/>
	)
	//#endregion avatar2

	return (
		<ShowcaseWrapperItem
			name="Avatar"
			{...props}
			packages={[
				{
					name: "@atlaskit/avatar",
					url: "https://atlassian.design/components/avatar/examples",
				},
			]}
			examples={[
				{
					title: "Example 1",
					example: example1,
					sourceCodeExampleId: "avatar1",
				},
				{
					title: "Example 2",
					example: example2,
					sourceCodeExampleId: "avatar2",
				},
			]}
		/>
	)
}

export default AvatarShowcase
