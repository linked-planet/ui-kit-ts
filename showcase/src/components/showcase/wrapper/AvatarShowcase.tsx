import React from "react"
import ShowcaseWrapperItem, {
	ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
import Avatar, { AvatarItem } from "@atlaskit/avatar"
import { LPAvatar } from "@linked-planet/ui-kit-ts/components/Avatar"

function AvatarShowcase(props: ShowcaseProps) {
	//#region avatar1
	const example1 = (
		<div>
			<div className="flex gap-4">
				<Avatar size="xsmall" appearance="circle" />
				<AvatarItem
					avatar={
						<Avatar
							size="small"
							appearance="square"
							presence="online"
						/>
					}
				/>
				<AvatarItem
					avatar={<Avatar size="medium" name="M T" presence="busy" />}
				/>
				<AvatarItem avatar={<Avatar size="large" presence="focus" />} />
				<AvatarItem
					avatar={
						<Avatar size="large" isDisabled presence="online" />
					}
				/>
				<AvatarItem
					avatar={
						<Avatar
							size="xlarge"
							appearance="circle"
							label="testlabel"
							name="M T"
							presence="offline"
						/>
					}
				/>
				<Avatar size="xxlarge" />
				<Avatar
					size="xlarge"
					src={"https://source.boringavatars.com/beam/"}
				/>
				<Avatar borderColor="#ff0000" />
				<span>as link:</span>
				<Avatar size="medium" name="M T" href="#" />
				<Avatar href="#" borderColor="#00ff00" />
				<Avatar size="medium" isDisabled={true} name="M T" href="#" />
				<Avatar
					size="medium"
					isDisabled={true}
					href="#"
					src={"https://source.boringavatars.com/beam/"}
				/>
			</div>
			<div className="flex gap-4">
				<LPAvatar size="xsmall" appearance="circle" />
				<LPAvatar size="small" appearance="square" presence="online" />
				<LPAvatar size="medium" presence="busy" />
				<LPAvatar size="large" presence="focus" />
				<LPAvatar size="large" isDisabled presence="online" />
				<LPAvatar
					size="xlarge"
					appearance="circle"
					label="testlabel"
					presence="offline"
				/>
				<LPAvatar size="xxlarge" />
				<LPAvatar
					size="xlarge"
					src={"https://source.boringavatars.com/beam/"}
				/>
				<LPAvatar borderColor="#ff0000" />
				<span>as link:</span>
				<LPAvatar size="medium" name="M T" label="testlabel" href="#" />
				<LPAvatar size="medium" href="#" />
				<LPAvatar href="#" borderColor="#00ff00" />
				<LPAvatar size="medium" isDisabled={true} href="#" />
				<LPAvatar
					size="medium"
					isDisabled={true}
					href="#"
					src={"https://source.boringavatars.com/beam/"}
				/>
			</div>
		</div>
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
