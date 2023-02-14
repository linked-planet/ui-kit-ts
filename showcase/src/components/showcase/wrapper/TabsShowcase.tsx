import React from "react";
import ShowcaseWrapperItem, {ShowcaseProps} from "../../ShowcaseWrapperItem";
import Tabs, {Tab, TabList, TabPanel} from "@atlaskit/tabs";

function TabsShowcase(props: ShowcaseProps) {

    // region: tabs
    const example = (
        <div style={{minWidth: 300}}>
            <Tabs id="tab-example">
                <TabList>
                    <Tab>First tab</Tab>
                    <Tab>Second tab</Tab>
                </TabList>
                <TabPanel>
                    <span>First</span>
                </TabPanel>
                <TabPanel>
                    <span>Second</span>
                </TabPanel>
            </Tabs>
        </div>
    )
    // endregion: tabs

    return (
        <ShowcaseWrapperItem
            name="Tabs"
            sourceCodeExampleId="tabs"
            overallSourceCode={props.overallSourceCode}
            packages={[
                {
                    name: "@atlaskit/tabs",
                    url: "https://atlassian.design/components/tabs/examples"
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

export default TabsShowcase;