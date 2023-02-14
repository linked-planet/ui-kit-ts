import React from "react";
import ShowcaseWrapperItem, {ShowcaseProps} from "../../ShowcaseWrapperItem";
import {CodeBlock} from "@atlaskit/code"

function CodeBlockShowcase(props: ShowcaseProps) {

    // region: code-block
    const code = `class Hello {
    public static void main(String args...) {
        System.out.println('Hello world')
    }
}`
    const example = (
        <CodeBlock
            language="java"
            text={code}
        />
    )
    // endregion: code-block

    return (
        <ShowcaseWrapperItem
            name="Code block"
            sourceCodeExampleId="code-block"
            overallSourceCode={props.overallSourceCode}
            packages={[
                {
                    name: "@atlaskit/code",
                    url: "https://atlassian.design/components/code/code-block/examples"
                }
            ]}

            examples={
                [
                    (example),
                ]
            }
        />
    )

}

export default CodeBlockShowcase;