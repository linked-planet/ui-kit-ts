import React, {useState} from "react";
import ShowcaseWrapperItem, {ShowcaseProps} from "../../ShowcaseWrapperItem";
import {PanelStateless} from "@atlaskit/panel"

function PanelShowcase(props: ShowcaseProps) {

    // region: panel
    const [isPanelActive, setIsPanelActive] = useState(false)
    const example = (
        <div style={{minWidth: 300, paddingLeft: 24}}>
            <PanelStateless
                isExpanded={isPanelActive}
                onChange={() => setIsPanelActive(!isPanelActive)}
                header={<span>Panel</span>}>
                <span>Panel content...</span>
            </PanelStateless>
        </div>
    )
    // endregion: panel

    return (
        <ShowcaseWrapperItem
            name="Panel"
            sourceCodeExampleId="panel"
            overallSourceCode={props.overallSourceCode}
            packages={[
                {
                    name: "@atlaskit/panel",
                    url: "https://atlaskit.atlassian.com/packages/bitbucket/panel"
                }
            ]}

            examples={
                [
                    (example)
                ]
            }
        />
    )

}

export default PanelShowcase;