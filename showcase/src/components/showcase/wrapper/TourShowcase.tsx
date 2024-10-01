import CrossIcon from "@atlaskit/icon/glyph/cross";
import {Button, ButtonGroup, Modal, Select} from "@linked-planet/ui-kit-ts";
import {Tour, TourStep} from "@linked-planet/ui-kit-ts/components/tour/TourWrapper";
import React, {useState} from "react"
import ShowcaseWrapperItem, {type ShowcaseProps,} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
import {Step} from "react-joyride"

//#region tour
function TourExample() {
	const [isActive, setActive] = useState(false)
	const [popup, setPopup] = useState(false)

	const defaultLocale = {
		back: "Back",
		close: "Close",
		last: "Done",
		next: "Next",
		open: "Open",
		skip: "Skip",
	} as const

	const InitStep = new (class extends TourStep {
		step: Step = {
			title: "Tour starten",
			target: "#tour-start",
			disableBeacon: true,
			showSkipButton: false,
			placement: "bottom",
			locale: {...defaultLocale, next: "Start Tour"},
			content: (
				<span>
					The first step selects the tour start to start the tour.
				</span>
			),
		}
	})()

	const SecondStep = new (class extends TourStep {
		step: Step = {
			title: "Button",
			target: "*[data-id='Test-1']",
			disableBeacon: true,
			showSkipButton: false,
			placement: "right",
			locale: defaultLocale,
			content: (
				<span>
					This step selects the popup which would open the popup.
				</span>
			),
		}
	})()

	const PopupStep = new (class extends TourStep {
		step: Step = {
			title: "Popup",
			target: "#test-select",
			disableBeacon: true,
			showSkipButton: false,
			placement: "right",
			locale: defaultLocale,
			content: (
				<span>
					This step opens the popup and selects the dropdown in it.
				</span>
			),
		}

		async onInit(next: () => void): Promise<void> {
			setPopup(true)
			next()
			setTimeout(() => next(), 50)
		}

		async onPrepare(next: () => void): Promise<void> {
			setPopup(true)
			setTimeout(() => next(), 50)
		}

		async onExit(): Promise<void> {
			setPopup(false)
		}
	})()

	const ThirdStep = new (class extends TourStep {
		step: Step = {
			title: "Weiterer Button",
			target: "*[data-id='Test-2']",
			disableBeacon: true,
			showSkipButton: false,
			placement: "right",
			locale: defaultLocale,
			content: (
				<span>
					This step closes the popup and continues with this button.
				</span>
			),
		}

		async onPrepare(next: () => void): Promise<void> {
			setPopup(false)
			setTimeout(() => next(), 500)
		}
	})()

	return (
		<div className="bg-surface">
			<ButtonGroup>
				<div id="tour-start" className="flex justify-center flex-1">
					<button
						type="button"
						className="px-2"
						onClick={() => setActive(true)}
					>
						Tour starten
					</button>
					<Tour
						isActive={isActive}
						setActive={setActive}
						steps={[InitStep, SecondStep, PopupStep, ThirdStep]}
						skipOnError={true}
						showInfoAndError={true}
						beforeAll={() => {
							// initialize dummy data or other inits before tour starts
							console.info("Starting Tour")
						}}
						afterAll={() => {
							// cleanup dummy data or other inits after tour finished
							console.info("Ending Tour")
						}}
					/>
				</div>
				<Button data-id="Test-1" onClick={() => setPopup(true)} className="joyride-first">First step</Button>
				<Button data-id="Test-2" className="joyride-second">Second step</Button>
			</ButtonGroup>
			<Modal.Container
				open={popup}
				//defaultOpen={true}
				onOpenChange={(opened) => {
					if (!opened) setPopup(false)
				}}
				shouldCloseOnEscapePress={true}
				accessibleDialogDescription="This is a modal dialog example"
			>
				<Modal.Header>
					<Modal.Title accessibleDialogTitle="Sample Modal">
						Sample Modal
					</Modal.Title>
					<Button
						appearance="link"
						onClick={() => setPopup(false)}
						className="text-text p-0"
					>
						<CrossIcon label="Close popup" />
					</Button>
				</Modal.Header>
				<Modal.Body>
					<div>
						<p>This is the body of the modal.</p>
					</div>
					<Select
						id="test-select"
						data-id="test-select"
						placeholder="Choose..."
						options={[]}
					/>
				</Modal.Body>
				<Modal.Footer>
					<Modal.CloseTrigger>
						<Button appearance="primary" className="z-0">
							Close
						</Button>
					</Modal.CloseTrigger>
				</Modal.Footer>
			</Modal.Container>
		</div>
	)
}

//#endregion tour

export default function TourShowcase(props: ShowcaseProps) {
	return (
		<ShowcaseWrapperItem
			name="Tour"
			{...props}
			packages={[
				{
					name: "@linked-planet/ui-kit-ts",
					url: "https://linked-planet.github.io/ui-kit-ts/single?component=Tour",
				},
			]}
			description="This is a simple wrapper for joyride guided tour including beforeAll, afterAll, onInit, onPrepare, onExit events."
			examples={[
				{
					title: "Tour",
					example: <TourExample/>,
					sourceCodeExampleId: "tour",
				},
			]}
		/>
	)
}
