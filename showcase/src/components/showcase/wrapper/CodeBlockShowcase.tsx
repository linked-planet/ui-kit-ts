import React from "react"
import ShowcaseWrapperItem, {
	ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
import { CodeBlock } from "@atlaskit/code"

function CodeBlockShowcase(props: ShowcaseProps) {
	//#region code-block
	const code = `class Hello {
    public static void main(String args...) {
        System.out.println('Hello world')
    }
}`
	const example = <CodeBlock language="java" text={code} />
	//#endregion code-block

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
					title: "Example",
					example,
					sourceCodeExampleId: "code-block",
				},
			]}
		/>
	)
}

export default CodeBlockShowcase
