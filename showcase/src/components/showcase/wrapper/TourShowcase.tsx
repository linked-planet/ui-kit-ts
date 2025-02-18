import {
	Button,
	ButtonGroup,
	Modal,
	Select,
	ToastFlagProvider,
} from "@linked-planet/ui-kit-ts"
import { Tour, TourStep } from "@linked-planet/ui-kit-ts"
import { useMemo, useState } from "react"
import ShowcaseWrapperItem, {
	type ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
import { CrossIcon } from "lucide-react"

//#region tour
const defaultLocale = {
	back: "Back",
	close: "Close",
	last: "Done",
	next: "Next",
	open: "Open",
	skip: "Skip",
} as const

function TourExample() {
	const [isActive, setActive] = useState(false)
	const [popup, setPopup] = useState(false)

	const steps = useMemo(() => {
		const InitStep = new TourStep({
			step: {
				title: "Tour starten",
				target: "#tour-start",
				disableBeacon: true,
				showSkipButton: false,
				placement: "bottom",
				locale: { ...defaultLocale, next: "Start Tour" },
				content: (
					<span>
						The first step selects the tour start to start the tour.
					</span>
				),
			},
		})

		const SecondStep = new TourStep({
			step: {
				title: "Button",
				target: "#joyride-first",
				disableBeacon: true,
				showSkipButton: false,
				placement: "right",
				locale: defaultLocale,
				content: (
					<span>
						This step selects the popup which would open the popup.
					</span>
				),
			},
		})

		const ThirdPopupStep = new TourStep({
			step: {
				title: "Popup",
				target: "#test-select",
				disableBeacon: true,
				showSkipButton: false,
				placement: "right",
				locale: defaultLocale,
				content: (
					<span>
						This step opens the popup and selects the dropdown in
						it.
					</span>
				),
			},
			onInit: () => {
				setPopup(true)
			},
			onPrepare: () => {
				console.log("prepare message")
			},
			onExit: () => {
				setPopup(false)
			},
		})

		const FourthStep = new TourStep({
			step: {
				title: "Weiterer Button",
				target: "#joyride-second",
				disableBeacon: true,
				showSkipButton: false,
				placement: "right",
				locale: defaultLocale,
				content: (
					<span>
						This step closes the popup and continues with this
						button.
					</span>
				),
			},
		})
		return [InitStep, SecondStep, ThirdPopupStep, FourthStep]
	}, [])

	return (
		<ToastFlagProvider>
			<div className="bg-surface">
				<ButtonGroup>
					<div id="tour-start" className="flex justify-center flex-1">
						<Button
							type="button"
							className="px-2"
							onClick={() => setActive(true)}
							appearance="primary"
						>
							Tour starten
						</Button>
						<Tour
							isActive={isActive}
							setActive={setActive}
							steps={steps}
							skipOnError={false}
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
					<Button
						data-id="Test-1"
						//onClick={() => setPopup(true)}
						id="joyride-first"
					>
						First step
					</Button>
					<Button data-id="Test-2" id="joyride-second">
						Second step
					</Button>
				</ButtonGroup>
				<Modal.Container
					open={popup}
					//defaultOpen={true}
					onOpenChange={(opened) => {
						if (!opened) setPopup(false)
					}}
					//shouldCloseOnEscapePress={false}
					shouldCloseOnOverlayClick={false} // this is required, the show "clicks" outside of the dialog closing the modal, which results in the failing of the next step because the element is not mounted anymore
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
							<CrossIcon aria-label="Close popup" size="12" />
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
		</ToastFlagProvider>
	)
}

//#endregion tour

//#region tour-skip
function TourSkipExample() {
	const [isActive, setActive] = useState(false)

	const steps = useMemo(() => {
		const InitStep = new TourStep({
			step: {
				title: "Tour starten",
				target: "#tour-start",
				disableBeacon: true,
				showSkipButton: false,
				placement: "bottom",
				locale: { ...defaultLocale, next: "Start Tour" },
				content: (
					<span>
						The first step selects the tour start to start the tour.
					</span>
				),
			},
		})

		const SecondStep = new TourStep({
			step: {
				title: "Button",
				target: "#joyride-second",
				disableBeacon: true,
				showSkipButton: false,
				placement: "right",
				locale: defaultLocale,
				content: (
					<span>
						This step selects the popup which would open the popup.
					</span>
				),
			},
		})

		const ThirdStep = new TourStep({
			step: {
				title: "Button",
				target: "#joyride-third",
				disableBeacon: true,
				showSkipButton: false,
				placement: "right",
				locale: defaultLocale,
				content: (
					<span>
						This step opens the popup and selects the dropdown in
						it.
					</span>
				),
			},
		})
		return [InitStep, SecondStep, ThirdStep]
	}, [])

	return (
		<ToastFlagProvider>
			<div className="bg-surface">
				<ButtonGroup>
					<div id="tour-start" className="flex justify-center flex-1">
						<Button
							type="button"
							className="px-2"
							onClick={() => setActive(true)}
							appearance="primary"
						>
							Tour starten
						</Button>
						<Tour
							isActive={isActive}
							setActive={setActive}
							steps={steps}
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
					<Button data-id="Test-1" id="joyride-first">
						First step
					</Button>
					<Button data-id="Test-2" id="joyride-third">
						Third step
					</Button>
				</ButtonGroup>
			</div>
		</ToastFlagProvider>
	)
}

//#endregion tour-skip

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
					example: <TourExample />,
					sourceCodeExampleId: "tour",
				},
				{
					title: "Tour-Skip",
					example: <TourSkipExample />,
					sourceCodeExampleId: "tour-skip",
				},
			]}
		/>
	)
}
