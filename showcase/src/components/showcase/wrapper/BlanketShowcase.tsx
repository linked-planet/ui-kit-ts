import { Blanket, Button, usePortalContainer } from "@linked-planet/ui-kit-ts"
import { useEffect, useRef, useState } from "react"
import ReactDOM from "react-dom"
import { createShowcaseShadowRoot } from "../../ShowCaseWrapperItem/createShadowRoot"
import ShowcaseWrapperItem, {
	type ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"

//#region blanket-shadow-root-example
function BlanketShowcaseShadowRootExample() {
	const [showBlanket, setShowBlanket] = useState(false)

	const divRef = useRef<HTMLDivElement>(null)

	const portalContainer = usePortalContainer(
		true,
		"uikts-blanket",
		divRef.current,
	)?.getRootNode() as ShadowRoot

	return (
		<div className="flex w-full flex-col gap-4" ref={divRef}>
			<Button onClick={() => setShowBlanket(true)}>Show Blanket</Button>
			{showBlanket && (
				<Blanket
					onClick={() => setShowBlanket(false)}
					usePortal={portalContainer}
				>
					<div className="flex size-full items-center justify-center">
						<div className="bg-surface rounded-md p-8">
							<h1 className="text-base font-bold">
								This is a blanket.
							</h1>
							<Button onClick={() => setShowBlanket(false)}>
								Close
							</Button>
						</div>
					</div>
				</Blanket>
			)}
		</div>
	)
}
//#endregion blanket-example

//#region blanket-shadow-root-example
function BlanketShadowRootExample() {
	const divRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (divRef.current && !divRef.current.shadowRoot) {
			const shadowRoot = createShowcaseShadowRoot(divRef.current)
			ReactDOM.createPortal(
				<BlanketShowcaseShadowRootExample />,
				shadowRoot,
			)
		}
	}, [])
	return <div ref={divRef} />
}
//#endregion blanket-shadow-root-example

function BlanketShowcase(props: ShowcaseProps) {
	//#region blanket-example
	const [showBlanket, setShowBlanket] = useState(false)

	const blanketExample = (
		<div className="flex w-full flex-col gap-4">
			<Button onClick={() => setShowBlanket(true)}>Show Blanket</Button>
			{showBlanket && (
				<Blanket onClick={() => setShowBlanket(false)} usePortal>
					<div className="flex size-full items-center justify-center">
						<div className="bg-surface rounded-md p-8">
							<h1 className="text-base font-bold">
								This is a blanket.
							</h1>
							<Button onClick={() => setShowBlanket(false)}>
								Close
							</Button>
						</div>
					</div>
				</Blanket>
			)}
		</div>
	)
	//#endregion blanket-example

	return (
		<ShowcaseWrapperItem
			name="Blanket"
			{...props}
			packages={[
				{
					name: "@linked-planet/ui-kit-ts",
					url: "single?component=Blanket",
				},
			]}
			examples={[
				{
					title: "Example",
					example: blanketExample,
					sourceCodeExampleId: "blanket-example",
				},
				{
					title: "Shadow Root Example",
					example: <BlanketShadowRootExample />,
					sourceCodeExampleId: "blanket-shadow-root-example",
				},
			]}
		/>
	)
}

export default BlanketShowcase
