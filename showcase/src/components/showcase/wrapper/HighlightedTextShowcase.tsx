import ShowcaseWrapperItem, {
	type ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
import { HighlightedText } from "@linked-planet/ui-kit-ts"

function HighlightedTextShowcase(props: ShowcaseProps) {
	//#region highlightedtext
	const example = (
		<div className="flex gap-4">
			<HighlightedText
				text={
					"Lorem ipsum dolor sit, amet consectetur adipisicing elit. Iusto quod libero hic accusantium porro. Temporibus quaerat molestiae recusandae tenetur maiores ab sit ullam deleniti eligendi, officia nobis! Id, natus qui?"
				}
				highlightedText={["Iusto", "porro"]}
			/>
		</div>
	)
	//#endregion highlightedtext

	//#region highlightedtext-containerElement
	const containerExample = (
		<div className="flex gap-4">
			<HighlightedText
				text={
					"Lorem ipsum dolor sit, amet consectetur adipisicing elit. Iusto quod libero hic accusantium porro. Temporibus quaerat molestiae recusandae tenetur maiores ab sit ullam deleniti eligendi, officia nobis! Id, natus qui?"
				}
				highlightedText={["Iusto", "porro"]}
				containerElement="h3"
				highlightClassName="text-red"
			/>
		</div>
	)
	//#endregion highlightedtext-containerElement

	return (
		<ShowcaseWrapperItem
			name="HighlightedText"
			description={
				<p>
					A container for a text, which highlights a chosen secion of
					the text.
				</p>
			}
			{...props}
			packages={[
				{
					name: "highlightedtext",
					url: "http://localhost:3000/ui-kit-ts/single#HighlightedText",
				},
			]}
			examples={[
				{
					title: "Example",
					example,
					sourceCodeExampleId: "highlightedtext",
				},
				{
					title: "Container Element",
					example: containerExample,
					sourceCodeExampleId: "highlightedtext-containerElement",
				},
			]}
		/>
	)
}

export default HighlightedTextShowcase
