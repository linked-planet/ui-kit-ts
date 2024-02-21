import { Accordion } from "@linked-planet/ui-kit-ts"
import React from "react"
import ShowcaseWrapperItem, {
	ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"

//#region accordion-single
function AccordionExample() {
	return (
		<div className="bg-surface">
			<Accordion.Container type="single" defaultValue="item-1">
				<Accordion.Item value="item-1">
					<Accordion.Trigger>Is it accessible?</Accordion.Trigger>
					<Accordion.Content>
						Yes. It adheres to the WAI-ARIA design pattern.
					</Accordion.Content>
				</Accordion.Item>

				<Accordion.Item value="item-2">
					<Accordion.Trigger>Is it unstyled?</Accordion.Trigger>
					<Accordion.Content>
						Yes. It is unstyled by default, giving you freedom over
						the look and feel.
					</Accordion.Content>
				</Accordion.Item>

				<Accordion.Item value="item-3">
					<Accordion.Trigger>Can it be animated?</Accordion.Trigger>
					<Accordion.Content>
						Yes! You can animate the Accordion with CSS or
						JavaScript.
					</Accordion.Content>
				</Accordion.Item>
			</Accordion.Container>
		</div>
	)
}
//#endregion accordion-single

//#region accordion-multi
function AccordionMultiExample() {
	return (
		<div className="bg-surface">
			<Accordion.Container type="multiple">
				<Accordion.Item value="item-1">
					<Accordion.Trigger>Is it accessible?</Accordion.Trigger>
					<Accordion.Content>
						Yes. It adheres to the WAI-ARIA design pattern.
					</Accordion.Content>
				</Accordion.Item>

				<Accordion.Item value="item-2">
					<Accordion.Trigger>Is it unstyled?</Accordion.Trigger>
					<Accordion.Content>
						Yes. It is unstyled by default, giving you freedom over
						the look and feel.
					</Accordion.Content>
				</Accordion.Item>

				<Accordion.Item value="item-3">
					<Accordion.Trigger>Can it be animated?</Accordion.Trigger>
					<Accordion.Content>
						Yes! You can animate the Accordion with CSS or
						JavaScript.
					</Accordion.Content>
				</Accordion.Item>
			</Accordion.Container>
		</div>
	)
}
//#endregion accordion-multi

export default function AnimatedListShowcase(props: ShowcaseProps) {
	return (
		<ShowcaseWrapperItem
			name="Accordion"
			{...props}
			packages={[
				{
					name: "@linked-planet/ui-kit-ts",
					url: "https://linked-planet.github.io/ui-kit-ts/single#Accordion",
				},
			]}
			examples={[
				{
					title: "Accordion Single",
					example: <AccordionExample />,
					sourceCodeExampleId: "accordion-single",
				},
				{
					title: "Accordion Multi",
					example: <AccordionMultiExample />,
					sourceCodeExampleId: "accordion-multi",
				},
			]}
		/>
	)
}
