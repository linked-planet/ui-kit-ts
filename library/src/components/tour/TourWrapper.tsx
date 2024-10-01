import ReactJoyride, { type Step } from "react-joyride"
import React, { useRef, useState } from "react"
import {showErrorFlag, showInformationFlag} from "../ToastFlag";

export class TourStep {
	step: Step

	constructor() {
		this.step = {
			content: <>Step should be overwritten.</>,
			target: "body",
		}
	}

	async onInit(next: () => void) {
		next()
	}

	async onPrepare(next: () => void) {
		next()
	}

	async onExit() {}
}

export interface TourProps {
	isActive: boolean
	setActive: (active: boolean) => void
	steps: Array<TourStep>
	skipOnError: boolean
	showInfoAndError: boolean
	beforeAll: () => void
	afterAll: () => void
}

export function Tour({
	isActive,
	setActive,
	steps,
	skipOnError,
	showInfoAndError,
	beforeAll,
	afterAll,
}: TourProps) {
	const [stepIndex, setStepIndex] = useState(0)
	const isInit = useRef(false)

	function next() {
		setStepIndex(stepIndex + 1)
	}

	function before() {
		setStepIndex(stepIndex - 1)
	}

	const _steps = steps.map((it) => it.step)

	return (
		<ReactJoyride
			run={isActive}
			continuous={true}
			showProgress={true}
			disableScrolling={true}
			scrollToFirstStep={false}
			styles={{
				overlay: {
					zIndex: 1000,
				},
			}}
			floaterProps={{
				styles: {
					floater: {
						zIndex: 2000,
						pointerEvents: "auto",
					},
				},
			}}
			scrollOffset={220}
			stepIndex={stepIndex}
			locale={{
				back: "Zurück",
				close: "Schließen",
				last: "Fertig",
				next: "Weiter",
				open: "Öffnen",
				skip: "Überspringen",
			}}
			callback={(joyrideState) => {
				const { action, index, lifecycle, type } = joyrideState

				const lpBeforeStep =
					stepIndex <= 0 ? undefined : steps[stepIndex - 1]
				const lpNextStep =
					stepIndex >= 0 && stepIndex < steps.length
						? steps[stepIndex + 1]
						: undefined
				const lpStep = steps[stepIndex]

				if (type === "error" || type === "error:target_not_found") {
					if (skipOnError) {
						if (showInfoAndError) {
							showInformationFlag({
								title: "Tour-Info",
								description: `Ein Step [${lpStep.step?.title ?? "Unbekannt"}] wurde übersprungen.`,
							})
						}
						next()
					} else {
						if (showInfoAndError) {
							showErrorFlag({
								title: "Tour-Fehler",
								description: `Fehler bei Step [${lpStep.step?.title ?? "Unbekannt"}]. Das Element wurde nicht gefunden.`,
							})
						}
						setStepIndex(0)
						isInit.current = false
					}
					afterAll()
				}

				if (action === "start" && lifecycle === "init") {
					beforeAll()
					isInit.current = false
					lpStep?.onInit(() => {
						isInit.current = true
					})
				}

				if (type === "step:after") {
					if (action === "prev") {
						lpStep?.onExit()
						if (lpBeforeStep) {
							lpBeforeStep.onPrepare(before)
						} else {
							before()
						}
					} else if (action === "next") {
						lpStep?.onExit()
						if (lpNextStep) {
							lpNextStep.onPrepare(next)
						} else {
							next()
						}
					}
				}

				if (action === "skip" || action === "close") {
					setActive(false)
					isInit.current = false
					afterAll()
				}

				if (
					action === "reset" ||
					(type === "tour:end" && action === "next")
				) {
					setActive(false)
					setStepIndex(0)
					isInit.current = false
					afterAll()
				}
			}}
			steps={_steps}
			debug={true}
		/>
	)
}
