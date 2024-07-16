import React, { useState } from "react"
import ShowcaseWrapperItem, {
	type ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
import { Blanket, Button } from "@linked-planet/ui-kit-ts"

function BannerShowcase(props: ShowcaseProps) {
	//#region blanket-example
	const [showBlanket, setShowBlanket] = useState(false)

	const blanketExample = (
		<div className="flex w-full flex-col gap-4">
			<Button onClick={() => setShowBlanket(true)}>Show Blanket</Button>
			{showBlanket && (
				<Blanket onClick={() => setShowBlanket(false)}>
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
			]}
		/>
	)
}

export default BannerShowcase
