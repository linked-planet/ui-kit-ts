import React from "react";
import ShowcaseWrapperItem, {ShowcaseProps} from "../../ShowcaseWrapperItem";
import {DateTimePicker} from "@atlaskit/datetime-picker";

function DateTimePickerShowcase(props: ShowcaseProps) {

    // region: datetime-picker
    const example = (
        <div style={{minWidth: 300}}>
            <DateTimePicker/>
        </div>
    )
    // endregion: datetime-picker

    return (
        <ShowcaseWrapperItem
            name="Date time picker"
            sourceCodeExampleId="datetime-picker"
            overallSourceCode={props.overallSourceCode}
            packages={[
                {
                    name: "@atlaskit/datetime-picker",
                    url: "https://atlassian.design/components/datetime-picker/examples"
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

export default DateTimePickerShowcase;