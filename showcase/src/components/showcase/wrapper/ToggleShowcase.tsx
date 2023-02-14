import React, {useState} from "react";
import ShowcaseWrapperItem, {ShowcaseProps} from "../../ShowcaseWrapperItem";
import Toggle from "@atlaskit/toggle"

function ToggleShowcase(props: ShowcaseProps) {

    // region: toggle
    const [isToggleActive, setIsToggleActive] = useState(false)
    const example = (
        <Toggle
            isChecked={isToggleActive}
            onChange={() => setIsToggleActive(!isToggleActive)}
        />
    )
    // endregion: toggle

    return (
        <ShowcaseWrapperItem
            name="Toggle"
            sourceCodeExampleId="toggle"
            overallSourceCode={props.overallSourceCode}
            packages={[
                {
                    name: "@atlaskit/toggle",
                    url: "https://atlassian.design/components/toggle/examples"
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

export default ToggleShowcase;