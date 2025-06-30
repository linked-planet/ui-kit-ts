//import Avatar, { AvatarItem } from "@atlaskit/avatar"
import {
	Avatar as LPAvatar,
	AvatarItem as LPAvatarItem,
} from "@linked-planet/ui-kit-ts"
import ShowcaseWrapperItem, {
	type ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"

//import Avatar, { AvatarItem } from "@atlaskit/avatar"

function AvatarShowcase(props: ShowcaseProps) {
	const example1AK = (
		<>
			{/*<div className="flex gap-4">
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
				</div>*/}
		</>
	)

	//#region avatar1
	const example1 = (
		<div>
			{example1AK}
			<div className="flex flex-wrap gap-4">
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

	const example2AK = (
		<>
			{/*<AvatarItem
				primaryText="Carl Coder"
				secondaryText="Software Engineer"
				avatar={<Avatar size="medium" borderColor="red" />}
			/>
	<Avatar size="medium" />*/}
		</>
	)

	//#region avatar2
	const example2 = (
		<div className="flex flex-col">
			{example2AK}
			<LPAvatarItem
				primaryText="Carl Coder"
				secondaryText="Software Engineer"
				avatar={
					<LPAvatar
						size="large"
						presence="online"
						borderColor="red"
					/>
				}
			/>
			<LPAvatarItem
				primaryText={
					<div>
						<h1>TEST H1</h1>
					</div>
				}
				secondaryText={
					<div>
						<div className="bg-brand text-danger-bold h-4 w-12 flex-none">
							UUU
						</div>
					</div>
				}
				avatar={<LPAvatar size="large" presence="online" />}
			/>
		</div>
	)
	//#endregion avatar2

	const example3AK = (
		<div className="flex flex-1 justify-center border-2">
			{/*<AvatarItem
					primaryText={"Unbekannt"}
					secondaryText={
						<div>
							<div>{"Unbekannt"}</div>
							<div>Summary</div>
							<div>description</div>
						</div>
					}
					avatar={<Avatar size="medium" />}
				/>*/}
		</div>
	)

	//#region avatar3
	const example3 = (
		<div>
			{example3AK}
			<div className="flex flex-1 justify-center border-2">
				<LPAvatarItem
					primaryText={"Unbekannt"}
					secondaryText={
						<div>
							<div>{"Unbekannt"}</div>
							<div>Summary</div>
							<div>description</div>
						</div>
					}
					avatar={<LPAvatar size="medium" />}
				/>
			</div>
		</div>
	)
	//#endregion avatar3

	return (
		<ShowcaseWrapperItem
			name="Avatar"
			description="Avatars are only the round avatar, while AvatarItem is rectangular and has username, and email."
			{...props}
			packages={[
				{
					name: "@linked-planet/ui-kit-ts",
					url: "https://linked-planet.github.io/ui-kit-ts/single#Avatars",
				},
			]}
			examples={[
				{
					title: "Avatar",
					example: example1,
					sourceCodeExampleId: "avatar1",
				},
				{
					title: "Avatar Item",
					example: example2,
					sourceCodeExampleId: "avatar2",
				},
				{
					title: "Avatar Item 2",
					example: example3,
					sourceCodeExampleId: "avatar3",
				},
			]}
		/>
	)
}

export default AvatarShowcase
