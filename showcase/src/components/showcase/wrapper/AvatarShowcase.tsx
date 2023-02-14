import React from "react";
import ShowcaseWrapperItem, {ShowcaseProps} from "../../ShowcaseWrapperItem";
import Avatar, {AvatarItem} from "@atlaskit/avatar"

function AvatarShowcase(props: ShowcaseProps) {

    // region: avatar
    const example1 = (
        <AvatarItem
            avatar={<Avatar size="large" presence="online"/>}
        />
    )

    const example2 = (
        <AvatarItem
            primaryText="Carl Coder"
            secondaryText="Software Engineer"
            avatar={<Avatar size="large" presence="online"/>}
        />
    )
    // endregion: avatar

    return (
        <ShowcaseWrapperItem
            name="Avatar"
            sourceCodeExampleId="avatar"
            overallSourceCode={props.overallSourceCode}
            packages={[
                {
                    name: "@atlaskit/avatar",
                    url: "https://atlassian.design/components/avatar/examples"
                }
            ]}

            examples={
                [
                    (example1),
                    (example2)
                ]
            }
        />
    )

}

export default AvatarShowcase;