import React from "react";
import ShowcaseWrapperItem, {ShowcaseProps} from "../../ShowcaseWrapperItem";
import TextArea from "@atlaskit/textarea";

function TextAreaShowcase(props: ShowcaseProps) {

    // region: textarea
    const example = (
        <div style={{minWidth: 300}}>
            <TextArea defaultValue="Content of text area..."/>
        </div>
    )
    // endregion: textarea

    return (
        <ShowcaseWrapperItem
            name="Text area"
            sourceCodeExampleId="textarea"
            overallSourceCode={props.overallSourceCode}
            packages={[
                {
                    name: "@atlaskit/textarea",
                    url: "https://atlassian.design/components/textarea/examples"
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

export default TextAreaShowcase;