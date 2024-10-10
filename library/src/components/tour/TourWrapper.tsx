import ReactJoyride, {
	type Locale,
	type Styles,
	type Step,
	type FloaterProps,
	type CallBackProps,
} from "react-joyride"
import { useCallback, useMemo, useRef, useState } from "react"
import { showErrorFlag, showInformationFlag } from "../ToastFlag"
import { flushSync } from "react-dom"

export type TourStepProps = Step

export class TourStep {
	private _step: Step
	private contentClassname = "text-start text-base" as const

	constructor({
		step,
		onPrepare,
		onInit,
		onExit,
	}: {
		step: TourStepProps
		onPrepare?: () => void
		onInit?: () => void
		onExit?: () => void
	}) {
		const content = (
			<div className={this.contentClassname}>{step.content}</div>
		)
		this._step = { ...step, content }
		this.onInit = onInit
		this.onPrepare = onPrepare
		this.onExit = onExit
	}

	set step(step: Step) {
		const content = (
			<div className={this.contentClassname}>{step.content}</div>
		)
		this._step = { ...step, content }
	}
	get step(): Step {
		return this._step
	}

	onInit?(): void

	onPrepare?(): void

	onExit?(): void
}

export interface TourProps {
	isActive: boolean
	setActive: (active: boolean) => void
	steps: Array<TourStep>
	skipOnError: boolean
	showInfoAndError: boolean
	beforeAll: () => void
	afterAll: () => void

	/**
	 * the scroll offset from the top for the tour (to remove the fixed header)
	 * @default 220
	 * */
	scrollOffset?: number

	/**
	 * Scrolls to the first step element when the tour starts
	 * @default true
	 */
	scrollToFirstStep?: boolean

	/**
	 * Disables the closing of the overlay when clicking outside of the tour
	 * @default true
	 * */
	disabledOverlayClose?: boolean
}

const floaterProps: Partial<FloaterProps> = {
	styles: {
		floater: {
			zIndex: 2000,
			pointerEvents: "auto" as const,
		},
	},
}

const styles: Partial<Styles> = {
	overlay: {
		zIndex: 1000,
		//opacity: 0.0,
	},
}

const locale: Locale = {
	back: "Zurück",
	close: "Schließen",
	last: "Fertig",
	next: "Weiter",
	open: "Öffnen",
	skip: "Überspringen",
}

export function Tour({
	isActive,
	setActive,
	steps,
	skipOnError = true,
	showInfoAndError = true,
	beforeAll,
	afterAll,
	scrollOffset = 220,
	scrollToFirstStep = true,
	disabledOverlayClose = true,
}: TourProps) {
	const [stepIndex, setStepIndex] = useState(0)
	const isInit = useRef(false)

	// run the set stepIndex update in a timeout that is runs after the rendering is done, and use flushSync to make sure the DOM is updated
	const next = useCallback((i: number) => {
		window.setTimeout(() =>
			flushSync(() => setStepIndex((prev) => prev + i)),
		)
	}, [])

	const reset = useCallback(() => {
		setActive(false)
		setStepIndex(0)
		isInit.current = false
		afterAll()
	}, [afterAll, setActive])

	const _steps = useMemo(() => steps.map((it) => it.step), [steps])

	const callback = useCallback(
		(joyrideState: CallBackProps) => {
			const { action, index, lifecycle, type, step } = joyrideState

			switch (type) {
				case "tour:start":
					beforeAll()
					isInit.current = true
					setStepIndex(0)
					break
				case "tour:end":
					reset()
					break
				case "step:before":
					steps[index]?.onPrepare?.()
					break
				case "step:after":
					steps[index]?.onExit?.()
					switch (action) {
						case "next":
							steps[index + 1]?.onInit?.()
							next(1)
							break
						case "prev":
							steps[index - 1]?.onInit?.()
							next(-1)
							break
						case "skip":
							steps[index + 2]?.onInit?.()
							next(2)
							break
						case "close":
							reset()
							break
						case "reset":
							reset()
							break
						case "stop":
							reset()
							break
						default:
							break
					}
					break
				case "error:target_not_found":
					if (skipOnError) {
						if (showInfoAndError) {
							showInformationFlag({
								title: "Tour-Info",
								description: `Ein Step [${steps[index].step?.title ?? "Unbekannt"}] wurde übersprungen, das Element wurde nicht gefunden.`,
							})
						}
						next(1)
					} else {
						if (showInfoAndError) {
							showErrorFlag({
								title: "Tour-Fehler",
								description: `Fehler bei Step [${steps[index].step?.title ?? "Unbekannt"}]. Das Element ${step.target} wurde nicht gefunden.`,
							})
						}
						reset()
					}
					break
				case "error":
					if (skipOnError) {
						if (showInfoAndError) {
							showInformationFlag({
								title: "Tour-Info",
								description: `Ein Step [${steps[index].step?.title ?? "Unbekannt"}] wurde übersprungen.`,
							})
						}
						next(1)
					} else {
						if (showInfoAndError) {
							showErrorFlag({
								title: "Tour-Fehler",
								description: `Fehler bei Step [${steps[index].step?.title ?? "Unbekannt"}].`,
							})
						}
						reset()
					}
					break

				default:
					break
			}
		},
		[beforeAll, reset, next, showInfoAndError, skipOnError, steps],
	)

	return (
		<ReactJoyride
			run={isActive}
			continuous={true}
			showProgress={true}
			disableScrollParentFix={true} //this is to avoid that joyride kills the scrolling in the app layout
			//disableScrolling={true}
			scrollToFirstStep={scrollToFirstStep}
			styles={styles}
			floaterProps={floaterProps}
			disableOverlayClose={disabledOverlayClose}
			scrollOffset={scrollOffset}
			stepIndex={stepIndex}
			locale={locale}
			disableOverlay={false}
			callback={callback}
			steps={_steps}
			debug={false}
		/>
	)
}
