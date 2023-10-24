import React from "react"
import ShowcaseWrapperItem, {
	ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
import Avatar, { AvatarItem } from "@atlaskit/avatar"
import {
	Avatar as LPAvatar,
	AvatarItem as LPAvatarItem,
} from "@linked-planet/ui-kit-ts/components/Avatar"

function AvatarShowcase(props: ShowcaseProps) {
	//#region avatar1
	const example1 = (
		<div>
			<div className="flex gap-4">
				<AvatarItem
					avatar={
						<Avatar
							size="xsmall"
							appearance="circle"
							presence="online"
							status="approved"
						/>
					}
				/>
				<AvatarItem
					avatar={
						<Avatar
							size="small"
							appearance="square"
							presence="online"
							status="approved"
						/>
					}
				/>
				<AvatarItem
					avatar={
						<Avatar
							size="medium"
							name="M T"
							presence="busy"
							status="declined"
						/>
					}
				/>
				<AvatarItem
					avatar={
						<Avatar size="large" presence="focus" status="locked" />
					}
				/>
				<AvatarItem
					avatar={
						<Avatar size="large" isDisabled presence="online" />
					}
				/>
				<AvatarItem
					avatar={
						<Avatar
							size="xlarge"
							appearance="square"
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
				<Avatar size="xlarge" href="#" />
				<Avatar href="#" borderColor="#00ff00" />
				<Avatar size="medium" isDisabled={true} name="M T" href="#" />
				<Avatar
					isDisabled={true}
					href="#"
					src={"https://source.boringavatars.com/beam/"}
					size="xlarge"
				/>
				<Avatar href="#" src={"images/github-logo.png"} size="xlarge" />
			</div>
			<div className="flex gap-4">
				<LPAvatar
					size="xsmall"
					appearance="circle"
					presence="online"
					status="approved"
				/>
				<LPAvatar
					size="small"
					appearance="square"
					presence="online"
					status="approved"
				/>
				<LPAvatar size="medium" presence="busy" status="declined" />
				<LPAvatar size="large" presence="focus" status="locked" />
				<LPAvatar size="large" isDisabled presence="online" />
				<LPAvatar
					size="xlarge"
					appearance="square"
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
				<LPAvatar size="xlarge" href="#" />
				<LPAvatar size="medium" href="#" />
				<LPAvatar href="#" borderColor="#00ff00" />
				<LPAvatar size="medium" isDisabled={true} href="#" />
				<LPAvatar
					isDisabled={true}
					href="#"
					src={"https://source.boringavatars.com/beam/"}
					size="xlarge"
				/>
				<LPAvatar
					href="#"
					src={"images/github-logo.png"}
					size="xlarge"
				/>
			</div>
		</div>
	)
	//#endregion avatar1

	//#region avatar2
	const example2 = (
		<>
			<AvatarItem
				primaryText="Carl Coder"
				secondaryText="Software Engineer"
				avatar={<Avatar size="large" presence="online" />}
			/>
			<LPAvatarItem
				primaryText="Carl Coder"
				secondaryText="Software Engineer"
				avatar={<Avatar size="large" presence="online" />}
			/>
		</>
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
