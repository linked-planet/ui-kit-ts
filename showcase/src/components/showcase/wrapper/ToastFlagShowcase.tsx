import React from "react"
import ShowcaseWrapperItem, {
	ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"

import { showFlag } from "@linked-planet/ui-kit-ts"
import { ToastContainer } from "react-toastify"
import Button from "@atlaskit/button"

//#region toastflag
function Example() {
	return (
		<div className="flex flex-col gap-3">
			<Button
				onClick={() =>
					showFlag({
						title: "1: Whoa a new flag!",
						content: "This is a standard toast flag.",
						urgency: undefined,
					})
				}
			>
				Standard
			</Button>
			<Button
				onClick={() =>
					showFlag({
						title: "1: Whoa a new flag!",
						content:
							"Marzipan croissant pie. Jelly beans gingerbread caramels brownie icing.",
						urgency: "success",
					})
				}
			>
				Success
			</Button>
			<Button
				appearance="subtle"
				onClick={() =>
					showFlag({
						title: "1: Whoa a new flag!",
						content:
							"Marzipan croissant pie. Jelly beans gingerbread caramels brownie icing.",
						urgency: "information",
					})
				}
			>
				Information
			</Button>
			<Button
				appearance="danger"
				onClick={() =>
					showFlag({
						title: "danger flag",
						content: "This is a danger toast flag.",
						urgency: "danger",
					})
				}
			>
				Danger
			</Button>
			<Button
				appearance="primary"
				onClick={() =>
					showFlag({
						title: "discovery flag",
						content: (
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
						urgency: "discovery",
					})
				}
			>
				Discovery
			</Button>
			<ToastContainer />
		</div>
	)
}
//#endregion toastflag

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
					title: "Example",
					example: <Example />,
					sourceCodeExampleId: "toastflag",
				},
			]}
		/>
	)
}
