import React from "react";
import ShowcaseWrapperItem, {ShowcaseProps} from "../../ShowcaseWrapperItem";
import Flag from "@atlaskit/flag";
import WarningIcon from "@atlaskit/icon/glyph/warning";

function FlagShowcase(props: ShowcaseProps) {

    // region: flag
    const example = (
        <Flag
            id="flag-id"
            title="Flag"
            icon={<WarningIcon label=""/>}
            description="Description of flag"
        />
    )
    // endregion: flag

    return (
        <ShowcaseWrapperItem
            name="Flag"
            sourceCodeExampleId="flag"
            overallSourceCode={props.overallSourceCode}
            packages={[
                {
                    name: "@atlaskit/flag",
                    url: "https://atlassian.design/components/flag/examples"
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

export default FlagShowcase;