import React from "react"
import ShowcaseWrapperItem, {
	ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"

import {
	Button,
	ToastFlagContainer,
	showErrorFlag,
	showFlag,
	showFlagExtended,
	showInformationFlag,
	showSuccessFlag,
	showWarningFlag,
} from "@linked-planet/ui-kit-ts"

//#region toastflagShowExtendedFlag
// add the ToastFlagContainer to the root of your app
function ExampleShowExtendedFlag() {
	return (
		<div className="flex flex-col gap-3">
			<Button
				onClick={() =>
					showFlagExtended({
						title: "1: Whoa a new flag!",
						description: "This is a standard toast flag.",
						autoClose: 2000,
					})
				}
			>
				Standard
			</Button>
			<Button
				onClick={() =>
					showFlagExtended({
						title: "1: Whoa a new flag!",
						description: "This is a standard toast flag.",
						inverted: true,
					})
				}
			>
				Standard Inverted
			</Button>
			<Button
				onClick={() =>
					showFlagExtended({
						title: "1: This flag does not disappear!",
						description:
							"This is a standard not disappearing toast flag.",
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
						title: "1: Whoa a new flag!",
						description:
							"Marzipan croissant pie. Jelly beans gingerbread caramels brownie icing.",
						appearance: "information",
						inverted: true,
					})
				}
			>
				Information Inverted
			</Button>
			<Button
				onClick={() =>
					showFlagExtended({
						title: "error flag",
						description: "This is a error toast flag.",
						appearance: "error",
					})
				}
			>
				Error
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
			<ToastFlagContainer />
		</div>
	)
}
//#endregion toastflagShowExtendedFlag

//#region toastflagShowFlag
function ExampleShowFlags() {
	return (
		<div className="flex flex-col gap-3">
			<Button
				onClick={() =>
					showFlag({
						title: "1: Whoa a new flag!",
						description: "This is a standard toast flag.",
						autoClose: 2000,
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
					showErrorFlag({
						title: "error flag",
						description: "This is a error toast flag.",
					})
				}
			>
				Error
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
			<ToastFlagContainer />
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
