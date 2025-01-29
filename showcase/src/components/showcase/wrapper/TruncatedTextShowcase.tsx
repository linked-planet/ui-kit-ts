import ShowcaseWrapperItem, {
	type ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
import { TruncatedText } from "@linked-planet/ui-kit-ts"

//import "react-tooltip/dist/react-tooltip.css" -> imported into the libraries css

function TruncatedTextShowcase(props: ShowcaseProps) {
	//#region truncatedtext
	const example = (
		<div className="flex gap-4">
			<TruncatedText lines={2}>
				Lorem ipsum dolor sit, amet consectetur adipisicing elit. Iusto
				quod libero hic accusantium porro. Temporibus quaerat molestiae
				recusandae tenetur maiores ab sit ullam deleniti eligendi,
				officia nobis! Id, natus qui?
			</TruncatedText>
			<TruncatedText>
				Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aut
				ipsum iure minus, molestiae rem debitis culpa. Molestiae maxime
				cumque exercitationem commodi dolores, modi dolorem aut. Quis
				reprehenderit temporibus pariatur corrupti?
			</TruncatedText>
			<TruncatedText>only short text, no truncation needed</TruncatedText>
		</div>
	)
	//#endregion truncatedtext

	return (
		<ShowcaseWrapperItem
			name="TruncatedText"
			description={
				<p>
					A container for a text, which truncates the text after a
					given number of lines using an ellipsis, and showing a
					&quot;more&quot; link to expand the text.
				</p>
			}
			{...props}
			packages={[
				{
					name: "truncatedtext",
					url: "http://localhost:3000/ui-kit-ts/single#TruncatedText",
				},
			]}
			examples={[
				{
					title: "Example",
					example,
					sourceCodeExampleId: "truncatedtext",
				},
			]}
		/>
	)
}

export default TruncatedTextShowcase
