import React from "react";
import ShowcaseWrapperItem, {ShowcaseProps} from "../../ShowcaseWrapperItem";
import Select from "@atlaskit/select"

function SelectShowcase(props: ShowcaseProps) {

    // region: select
    const example1 = (
        <div style={{minWidth: 300}}>
            <Select
                inputId="select-1"
                options={[
                    {label: "First option", value: "first"},
                    {label: "Second option", value: "second"}
                ]}
            />
        </div>
    )
    const example2 = (
        <div style={{minWidth: 300}}>
            <Select
                inputId="select-s"
                options={[
                    {
                        label: "First group", options: [
                            {label: "First option", value: "first"}
                        ]
                    },
                    {
                        label: "Second group", options: [
                            {label: "Second option", value: "second"}
                        ]
                    },
                ]}
            />
        </div>
    )
    // endregion: select

    return (
        <ShowcaseWrapperItem
            name="Select"
            sourceCodeExampleId="select"
            overallSourceCode={props.overallSourceCode}
            packages={[
                {
                    name: "@atlaskit/select",
                    url: "https://atlassian.design/components/select/examples"
                }
            ]}

            examples={
                [
                    (example1),
                    (example2),
                ]
            }
        />
    )

}

export default SelectShowcase;