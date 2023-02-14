import {ReactNode, useState} from "react";
import Tabs, {Tab, TabList, TabPanel} from "@atlaskit/tabs"
import {CodeBlock} from "@atlaskit/code";

export interface Package {
    name: string,
    url: string
}

export interface ShowcaseProps {
    overallSourceCode: string
}

export interface ShowcaseWrapperItemProps {
    name: string
    packages: Array<Package>
    sourceCodeExampleId?: string
    overallSourceCode?: string
    examples: Array<ReactNode>
}

function extractSourceCodeExample(overallSourceCode: string, sourceCodeExampleId: string) {
    const exampleCodeStartMarker = "// region: " + sourceCodeExampleId;
    const exampleCodeEndMarker = "// endregion: " + sourceCodeExampleId;
    if (overallSourceCode.indexOf(exampleCodeStartMarker) && overallSourceCode.indexOf(exampleCodeEndMarker)) {
        const result = overallSourceCode.substring(
            overallSourceCode.indexOf(exampleCodeStartMarker)+exampleCodeStartMarker.length,
            overallSourceCode.indexOf(exampleCodeEndMarker)
        )
        return result
    }
    return "";
}

function ShowcaseWrapperItem(props: ShowcaseWrapperItemProps) {

    const [selectedTab, setSelectedTab] = useState(0)

    let code = ""
    console.info("OverallSourceCode, SourceCodeExampleId", props.overallSourceCode, props.sourceCodeExampleId)
    if (props.overallSourceCode != null && props.overallSourceCode != "" && props.sourceCodeExampleId != null && props.sourceCodeExampleId != "") {
        code = extractSourceCodeExample(props.overallSourceCode, props.sourceCodeExampleId)
    }

    console.info("ShowCaseWrapperItem overallSourceCode", props.overallSourceCode)
    console.info("ShowCaseWrapperItem sourceCodeExampleId", props.sourceCodeExampleId)
    console.info("ShowCaseWrapperItem Code", code)

    return (
        <div style={{padding: "20px 20px"}}>
            <h3>{props.name}</h3>
            <div style={{fontWeight: "lighter", fontSize: "0.8rem"}}>
                <span>Packages: </span>
                {props.packages.map((pack, index, array) => {
                    return (<a href={pack.url} target="_blank">{pack.name}</a>)
                })}
            </div>

            <div style={{marginLeft: "-8px"}}>
                <Tabs id={props.name+"-tabs"}>
                    <TabList>
                        <Tab>Example</Tab>
                        <Tab>Example Source</Tab>
                    </TabList>
                    <TabPanel>
                        <div style={{display: "flex"}}>
                            {props.examples.map((example) => {
                                return (
                                    <div className="example" children={example}/>
                                );
                            })}
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <div style={{width: "100%"}}>
                            { code == "" &&
                                <span>No sources found...</span>
                            }
                            { code != "" &&
                                <div style={{width: "100%"}}>
                                    <CodeBlock
                                        text={code}
                                        language="typescript"
                                    />
                                </div>
                            }
                        </div>
                    </TabPanel>
                </Tabs>
            </div>
        </div>
    )

}

export default ShowcaseWrapperItem;