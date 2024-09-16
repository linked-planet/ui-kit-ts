import { CodeBlock } from "@linked-planet/ui-kit-ts"
import ShowcaseWrapperItem, {
	type ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
import { CodeBlock as AKCodeBlock } from "@atlaskit/code"

function CodeBlockShowcase(props: ShowcaseProps) {
	//#region code-block
	const code = `class Hello {
    public static void main(String args...) {
        System.out.println('Hello world')
    }
}`
	const example = <AKCodeBlock language="java" text={code} />
	//#endregion code-block

	//#region code-block-own
	const exampleOwn = <CodeBlock language="java">{code}</CodeBlock>
	//#endregion code-block-own

	return (
		<ShowcaseWrapperItem
			name="Code block"
			{...props}
			packages={[
				{
					name: "@atlaskit/code",
					url: "https://atlassian.design/components/code/code-block/examples",
				},
			]}
			examples={[
				{
					title: "Example Own",
					example: exampleOwn,
					sourceCodeExampleId: "code-block-own",
				},
				{
					title: "Example",
					example,
					sourceCodeExampleId: "code-block",
				},
			]}
		/>
	)
}

export default CodeBlockShowcase
