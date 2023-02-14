import React from "react";
import ShowcaseWrapperItem, {ShowcaseProps} from "../../ShowcaseWrapperItem";
import Flag from "@atlaskit/flag";
import ArrowDownIcon from "@atlaskit/icon/glyph/arrow-down";
import BulletListIcon from "@atlaskit/icon/glyph/bullet-list";
import CheckCircleIcon from "@atlaskit/icon/glyph/check-circle";
import LogIcon from "@atlaskit/icon/glyph/backlog";
import RefreshIcon from "@atlaskit/icon/glyph/refresh";
import SendIcon from "@atlaskit/icon/glyph/send";
import TrashIcon from "@atlaskit/icon/glyph/trash";

function IconShowcase(props: ShowcaseProps) {

    // region: icon
    const example = (
        <div>
            <ArrowDownIcon label="" />
            <BulletListIcon label="" />
            <CheckCircleIcon label="" />
            <LogIcon label="" />
            <RefreshIcon label="" />
            <SendIcon label="" />
            <TrashIcon label="" primaryColor="red" />
        </div>
    )
    // endregion: icon

    return (
        <ShowcaseWrapperItem
            name="Icon"
            sourceCodeExampleId="icon"
            overallSourceCode={props.overallSourceCode}
            packages={[
                {
                    name: "@atlaskit/icon",
                    url: "https://atlassian.design/components/icon/icon-explorer"
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

export default IconShowcase;