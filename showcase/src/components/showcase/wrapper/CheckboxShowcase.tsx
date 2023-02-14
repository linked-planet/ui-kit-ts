import React, {useState} from "react";
import ShowcaseWrapperItem, {ShowcaseProps} from "../../ShowcaseWrapperItem";
import Checkbox from "@atlaskit/checkbox"

function CheckboxShowcase(props: ShowcaseProps) {

    // region: checkbox
    const [isCheckboxActive, setIsCheckboxActive] = useState(false)
    const example = (
        <Checkbox
            label="This is my checkbox"
            isChecked={isCheckboxActive}
            onChange={() =>
                setIsCheckboxActive(!isCheckboxActive)
            }
        />
    )
    // endregion: checkbox

    return (
        <ShowcaseWrapperItem
            name="Checkbox"
            sourceCodeExampleId="checkbox"
            overallSourceCode={props.overallSourceCode}
            packages={[
                {
                    name: "@atlaskit/checkbox",
                    url: "https://atlassian.design/components/checkbox/example"
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

export default CheckboxShowcase;