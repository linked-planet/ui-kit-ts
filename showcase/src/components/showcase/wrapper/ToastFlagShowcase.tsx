import ShowcaseWrapperItem, {
	type ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"

import {
	Button,
	ToastFlagContainer,
	Toast,
	ToastR,
	ToastFlagProvider,
} from "@linked-planet/ui-kit-ts"

//#region toastflagShowExtendedFlag
// add the ToastFlagContainer to the root of your app
function ExampleShowExtendedFlag() {
	return (
		<>
			<div className="flex gap-4 mb-4 border-b border-b-solid border-b-border-bold pb-2">
				<Button onClick={() => ToastR.removeAllToasts()} type="button">
					Remove All
				</Button>
			</div>
			<div className="flex flex-col gap-3">
				<ToastFlagProvider>
					<Button
						onClick={() => {
							Toast.showFlag({
								title: "standard flag",
								description: "test",
								autoClose: false,
								flagType: "bold",
							})
						}}
					>
						Standard
					</Button>
					<Button
						onClick={() => {
							ToastR.showFlag({
								title: "standard flag",
								description: "test",
								autoClose: false,
								type: "bold",
							})
						}}
					>
						Standard R
					</Button>
					<Button
						onClick={() =>
							Toast.showFlag({
								title: "1: Whoa a new flag!",
								description: "This is a standard toast flag.",
								flagType: "inverted",
							})
						}
					>
						Standard Inverted
					</Button>
					<Button
						onClick={() =>
							ToastR.showFlag({
								title: "1: Whoa a new flag!",
								description: "This is a standard toast flag.",
								type: "inverted",
							})
						}
					>
						Standard Inverted R
					</Button>
					<Button
						onClick={() =>
							ToastR.showFlag({
								title: "1: This flag does not disappear!",
								description:
									"This is a standard not disappearing toast flag.",
								autoClose: false,
							})
						}
					>
						Standard Not Dissapearing
					</Button>

					<Button
						onClick={() =>
							Toast.showFlag({
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
							ToastR.showFlag({
								title: "1: Whoa a new flag!",
								description:
									"Marzipan croissant pie. Jelly beans gingerbread caramels brownie icing.",
								appearance: "success",
								autoClose: 6000,
							})
						}
					>
						Success R
					</Button>
					<Button
						onClick={() =>
							Toast.showFlag({
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
							ToastR.showFlag({
								title: "1: Whoa a new flag!",
								description:
									"Marzipan croissant pie. Jelly beans gingerbread caramels brownie icing.",
								appearance: "information",
							})
						}
					>
						Information R
					</Button>
					<Button
						onClick={() =>
							Toast.showFlag({
								title: "1: Whoa a new flag!",
								description:
									"Marzipan croissant pie. Jelly beans gingerbread caramels brownie icing.",
								appearance: "information",
								flagType: "bold",
							})
						}
					>
						Information Bold
					</Button>
					<Button
						onClick={() =>
							ToastR.showFlag({
								title: "1: Whoa a new flag!",
								description:
									"Marzipan croissant pie. Jelly beans gingerbread caramels brownie icing.",
								appearance: "information",
								type: "bold",
							})
						}
					>
						Information Bold R
					</Button>

					<Button
						onClick={() =>
							Toast.showFlag({
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
							ToastR.showFlag({
								title: "error flag",
								description: "This is a error toast flag.",
								appearance: "error",
							})
						}
					>
						Error R
					</Button>
					<Button
						onClick={() =>
							Toast.showFlag({
								title: "discovery flag",
								description: "This is a discovery toast flag.",
								appearance: "discovery",
							})
						}
					>
						Discovery
					</Button>
					<Button
						onClick={() =>
							Toast.showFlag({
								title: "warning flag",
								description: (
									<div>
										<h2>This is a discovery!</h2>
										<p>
											Lorem ipsum, dolor sit amet
											consectetur adipisicing elit. Maxime
											doloribus unde laboriosam, beatae
											accusantium quasi itaque, illum
											necessitatibus amet aspernatur,
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
					<Button
						onClick={() =>
							ToastR.showFlag({
								title: "warning flag",
								description: (
									<div>
										<h2>This is a discovery!</h2>
										<p>
											Lorem ipsum, dolor sit amet
											consectetur adipisicing elit. Maxime
											doloribus unde laboriosam, beatae
											accusantium quasi itaque, illum
											necessitatibus amet aspernatur,
											nostrum velit quo earum error nihil.
											Obcaecati totam harum quibusdam!
										</p>
									</div>
								),
								appearance: "warning",
							})
						}
					>
						Warning R
					</Button>
				</ToastFlagProvider>
				<ToastFlagContainer />
			</div>
		</>
	)
}
//#endregion toastflagShowExtendedFlag

//#region toastflagShowFlag
function ExampleShowFlags() {
	return (
		<div className="flex flex-col gap-3">
			<ToastFlagProvider>
				<Button
					onClick={() =>
						Toast.showFlag({
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
						ToastR.showFlag({
							title: "1: Whoa a new flag!",
							description: "This is a standard toast flag.",
							autoClose: 2000,
						})
					}
				>
					Standard R
				</Button>
				<Button
					onClick={() =>
						Toast.showFlag({
							title: "1: This flag does not disappear!",
							description: "...and is at the bottom left",
							autoClose: false,
							position: "bottom-left",
						})
					}
				>
					Standard Not Disappearing Bottom Left
				</Button>

				<Button
					onClick={() =>
						Toast.showFlag({
							title: "Default Style",
							description: "The default style is rather dark.",
							flagType: "bold",
							autoClose: false,
						})
					}
				>
					Standard Bold
				</Button>

				<Button
					onClick={() =>
						Toast.showFlag({
							title: "Pale Style",
							description: "Pale colored background.",
							flagType: "pale",
						})
					}
				>
					Standard Pale
				</Button>
				<Button
					onClick={() =>
						Toast.showFlag({
							title: "1: Whoa a new flag! Inverted Style",
							flagType: "inverted",
							description:
								"The inverted style is the default one for the simple flags.",
						})
					}
				>
					Success Style
				</Button>
				<Button
					onClick={() =>
						Toast.showFlag({
							title: "Default Style",
							flagType: "bold",
							description:
								"Using the default flag style (see flags).",
						})
					}
				>
					Success Bold Flag Style
				</Button>

				<Button
					onClick={() =>
						Toast.showFlag({
							title: "Pale Style",
							flagType: "pale",
							description:
								"Using the pale flag style (see flags).",
						})
					}
				>
					Success Pale Flag Style
				</Button>
				<Button
					onClick={() =>
						Toast.showFlag({
							title: "Information",
							flagType: "pale",
							description: "Pale flag style (see flags).",
						})
					}
				>
					Information Pale
				</Button>
				<Button
					onClick={() =>
						Toast.showFlag({
							title: "Discovery",
							description: "This is a bold discovery toast.",
						})
					}
				>
					Discovery
				</Button>
				<Button
					onClick={() =>
						Toast.showFlag({
							title: "Discovery",
							description: "This is a bold discovery toast.",
							flagType: "bold",
						})
					}
				>
					Discovery Bold
				</Button>
				<Button
					onClick={() =>
						Toast.showFlag({
							title: "Discovery",
							description: "This is a pale discovery toast.",
							flagType: "pale",
						})
					}
				>
					Discovery Pale
				</Button>
				<Button
					onClick={() =>
						Toast.showFlag({
							title: "error flag",
							description: "This is a error toast flag.",
						})
					}
				>
					Error
				</Button>
				<Button
					onClick={() =>
						Toast.showFlag({
							title: "error flag",
							description: "This is a error toast flag.",
							flagType: "bold",
						})
					}
				>
					Error Bold
				</Button>
				<Button
					onClick={() =>
						Toast.showFlag({
							title: "error flag",
							description: "This is a pale error toast flag.",
							flagType: "pale",
						})
					}
				>
					Error Pale
				</Button>
				<Button
					onClick={() =>
						Toast.showFlag({
							title: "Warning Flag",
							description: "This is a warning toast flag.",
						})
					}
				>
					Warning
				</Button>
				<Button
					onClick={() =>
						Toast.showFlag({
							title: "Warning Flag",
							description: "This is a bold warning toast flag.",
							flagType: "bold",
						})
					}
				>
					Warning Bold
				</Button>
				<Button
					onClick={() =>
						Toast.showFlag({
							title: "Warning Flag",
							description: "This is a pale warning toast flag.",
							flagType: "pale",
						})
					}
				>
					Warning Pale
				</Button>
				<Button
					onClick={() =>
						Toast.showFlag({
							title: "warning flag",
							description: (
								<div>
									<h2>This is a warning flag!</h2>
									<p>
										Lorem ipsum, dolor sit amet consectetur
										adipisicing elit. Maxime doloribus unde
										laboriosam, beatae accusantium quasi
										itaque, illum necessitatibus amet
										aspernatur, nostrum velit quo earum
										error nihil. Obcaecati totam harum
										quibusdam!
									</p>
								</div>
							),
						})
					}
				>
					Warning
				</Button>
			</ToastFlagProvider>
			<ToastFlagContainer toastWidth={"400px"} />
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
