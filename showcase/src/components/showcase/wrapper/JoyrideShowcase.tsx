import React, { useState } from "react"
import ShowcaseWrapperItem, {
	ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
import ReactJoyride from "react-joyride"
import Button, { ButtonGroup } from "@atlaskit/button"
import { InlineMessage } from "@linked-planet/ui-kit-ts"

function JoyrideShowcase(props: ShowcaseProps) {
	// fix missing global
	// @ts-expect-error global is not defined
	if (!window.global) window.global = window

	// region: joyride
	const [isJoyrideActive, setIsJoyrideActive] = useState(false)
	const example = (
		<>
			<InlineMessage
				removable={true}
				message={{
					text: (
						<div>
							If you get the error &apos;global is not
							defined&apos; you have to add the following:
							<br></br>
							<div>
								<pre>
									if (!window.global) window.global = window
								</pre>
							</div>
						</div>
					),
					urgency: "warning",
				}}
			/>
			<div>
				<ButtonGroup>
					<Button
						isSelected={isJoyrideActive}
						onClick={() => setIsJoyrideActive(true)}
					>
						Start Tour
					</Button>
					<Button className="joyride-first">First step</Button>
					<Button className="joyride-second">Second step</Button>
					<Button className="joyride-third">Third step</Button>
				</ButtonGroup>

				<ReactJoyride
					run={isJoyrideActive}
					continuous={true}
					showProgress={true}
					disableScrolling={false}
					scrollToFirstStep={true}
					scrollOffset={220}
					locale={{
						back: "Zurück",
						close: "Schließen",
						last: "Fertig",
						next: "Weiter",
						open: "Öffnen",
						skip: "Überspringen",
					}}
					callback={(joyrideState) => {
						switch (joyrideState.action) {
							case "close":
								setIsJoyrideActive(false)
								break
							case "reset":
								setIsJoyrideActive(false)
								break
						}
					}}
					steps={[
						{
							title: "First step title",
							target: ".joyride-first",
							disableBeacon: true,
							showSkipButton: true,
							content: <span>First step content...</span>,
						},
						{
							title: "Second step title",
							target: ".joyride-second",
							disableBeacon: true,
							showSkipButton: true,
							content: <span>Second step content...</span>,
						},
						{
							title: "Third step title",
							target: ".joyride-third",
							disableBeacon: true,
							showSkipButton: true,
							content: <span>Third step content...</span>,
						},
					]}
				/>
			</div>
		</>
	)
	// endregion: joyride

	return (
		<ShowcaseWrapperItem
			name="Joyride"
			sourceCodeExampleId="joyride"
			{...props}
			packages={[
				{
					name: "react-joyride",
					url: "https://docs.react-joyride.com/",
				},
			]}
			examples={[example]}
		/>
	)
}

export default JoyrideShowcase
