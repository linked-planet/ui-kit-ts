import React from "react"
import ShowcaseWrapperItem, {
	ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"

import {
	Button,
	showDangerFlag,
	showFlag,
	showFlagExtended,
	showInformationFlag,
	showSuccessFlag,
	showWarningFlag,
} from "@linked-planet/ui-kit-ts"
import { ToastContainer } from "react-toastify"

//#region toastflagShowExtendedFlag
function ExampleShowExtendedFlag() {
	return (
		<div className="flex flex-col gap-3">
			<Button
				onClick={() =>
					showFlagExtended({
						title: "1: Whoa a new flag!",
						description: "This is a standard toast flag.",
						appearance: undefined,
					})
				}
			>
				Standard
			</Button>
			<Button
				onClick={() =>
					showFlagExtended({
						title: "1: This flag does not disappear!",
						description:
							"This is a standard not disappearing toast flag.",
						appearance: undefined,
						autoClose: false,
					})
				}
			>
				Standard Not Dissapearing
			</Button>
			<Button
				onClick={() =>
					showFlagExtended({
						title: "1: Whoa a new flag!",
						description:
							"Marzipan croissant pie. Jelly beans gingerbread caramels brownie icing.",
						appearance: "success",
					})
				}
			>
				Success
			</Button>
			<Button
				onClick={() =>
					showFlagExtended({
						title: "1: Whoa a new flag!",
						description:
							"Marzipan croissant pie. Jelly beans gingerbread caramels brownie icing.",
						appearance: "information",
					})
				}
			>
				Information
			</Button>
			<Button
				onClick={() =>
					showFlagExtended({
						title: "danger flag",
						description: "This is a danger toast flag.",
						appearance: "danger",
					})
				}
			>
				Danger
			</Button>
			<Button
				onClick={() =>
					showFlagExtended({
						title: "warning flag",
						description: (
							<div>
								<h2>This is a discovery!</h2>
								<p>
									Lorem ipsum, dolor sit amet consectetur
									adipisicing elit. Maxime doloribus unde
									laboriosam, beatae accusantium quasi itaque,
									illum necessitatibus amet aspernatur,
									nostrum velit quo earum error nihil.
									Obcaecati totam harum quibusdam!
								</p>
							</div>
						),
						appearance: "warning",
					})
				}
			>
				Warning
			</Button>
			<ToastContainer />
		</div>
	)
}
//#endregion toastflagShowExtendedFlag

//#region toastflagShowEFlag
function ExampleShowFlags() {
	return (
		<div className="flex flex-col gap-3">
			<Button
				onClick={() =>
					showFlag({
						title: "1: Whoa a new flag!",
						description: "This is a standard toast flag.",
					})
				}
			>
				Standard
			</Button>
			<Button
				onClick={() =>
					showFlag({
						title: "1: This flag does not disappear!",
						description: "...and is at the bottom left",
						autoClose: false,
						position: "bottom-left",
					})
				}
			>
				Standard Not Dissapearing Bottom Left
			</Button>
			<Button
				onClick={() =>
					showSuccessFlag({
						title: "1: Whoa a new flag!",
						description:
							"Marzipan croissant pie. Jelly beans gingerbread caramels brownie icing.",
						autoClose: false,
					})
				}
			>
				Success
			</Button>
			<Button
				onClick={() =>
					showInformationFlag({
						title: "1: Whoa a new information flag!",
						description:
							"Marzipan croissant pie. Jelly beans gingerbread caramels brownie icing.",
					})
				}
			>
				Information
			</Button>
			<Button
				onClick={() =>
					showDangerFlag({
						title: "danger flag",
						description: "This is a danger toast flag.",
					})
				}
			>
				Danger
			</Button>
			<Button
				onClick={() =>
					showWarningFlag({
						title: "warning flag",
						description: (
							<div>
								<h2>This is a warning flag!</h2>
								<p>
									Lorem ipsum, dolor sit amet consectetur
									adipisicing elit. Maxime doloribus unde
									laboriosam, beatae accusantium quasi itaque,
									illum necessitatibus amet aspernatur,
									nostrum velit quo earum error nihil.
									Obcaecati totam harum quibusdam!
								</p>
							</div>
						),
					})
				}
			>
				Warning
			</Button>
			<ToastContainer />
		</div>
	)
}
//#endregion toastflagShowFlag

export default function ToastFlagShowcase(props: ShowcaseProps) {
	return (
		<ShowcaseWrapperItem
			name="Toast Flag Notification"
			{...props}
			packages={[
				{
					name: "@linked-planet/ui-kit-ts",
					url: "https://www.github.com/linked-planet/ui-kit-ts",
				},
			]}
			description="A toast flag notification is a small notification that appears at the bottom of the screen. It is based on the react-toastify library, and you need to add the ToastContainer component to your app."
			examples={[
				{
					title: "Example Show Flags",
					example: <ExampleShowFlags />,
					sourceCodeExampleId: "toastflagShowFlag",
				},
				{
					title: "Example Show Exended Flag",
					example: <ExampleShowExtendedFlag />,
					sourceCodeExampleId: "toastflagShowExtendedFlag",
				},
			]}
		/>
	)
}
