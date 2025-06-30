import { Button, HighlightedText, Input } from "@linked-planet/ui-kit-ts"
import { useState } from "react"
import ShowcaseWrapperItem, {
	type ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"

function Example() {
	const [caseSensitive, setCaseSensitive] = useState(false)
	const [match, setMatch] = useState<string[]>(["Iusto", "porro"])
	return (
		<div>
			<Button onClick={() => setCaseSensitive(!caseSensitive)}>
				{caseSensitive ? "Case Sensitive" : "Case Insensitive"}
			</Button>
			<Input
				value={match.join(",")}
				onChange={(e) => setMatch(e.target.value.split(","))}
			/>
			<HighlightedText
				text={
					"Lorem ipsum dolor sit, amet consectetur adipisicing elit. Iusto iusto quod libero hic accusantium porro Porro. Temporibus quaerat molestiae recusandae tenetur maiores ab sit ullam deleniti eligendi, officia nobis! Id, natus qui?"
				}
				highlightedText={match}
				caseSensitive={caseSensitive}
			/>
		</div>
	)
}

function ContainerExample() {
	const [caseSensitive, setCaseSensitive] = useState(false)
	const [match, setMatch] = useState<string[]>(["Iusto", "porro"])
	return (
		<div>
			<Button onClick={() => setCaseSensitive(!caseSensitive)}>
				{caseSensitive ? "Case Sensitive" : "Case Insensitive"}
			</Button>
			<Input
				value={match.join(",")}
				onChange={(e) => setMatch(e.target.value.split(","))}
			/>
			<HighlightedText
				text="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Iusto iusto quod libero hic accusantium porro Porro. Temporibus quaerat molestiae recusandae tenetur maiores ab sit ullam deleniti eligendi, officia nobis! Id, natus qui?"
				containerElement="h3"
				highlightedText={match}
				caseSensitive={caseSensitive}
				highlightClassName="text-red"
			/>
		</div>
	)
}

function HighlightedTextShowcase(props: ShowcaseProps) {
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
					example: <Example />,
					sourceCodeExampleId: "highlightedtext",
				},
				{
					title: "Container Element",
					example: <ContainerExample />,
					sourceCodeExampleId: "highlightedtext-containerElement",
				},
			]}
		/>
	)
}

export default HighlightedTextShowcase
