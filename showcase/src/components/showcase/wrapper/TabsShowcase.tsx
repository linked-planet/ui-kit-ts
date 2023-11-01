import React, { useState } from "react"
import ShowcaseWrapperItem, {
	ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
/*import AKTabs, {
	Tab as AKTab,
	TabList as AKTabList,
	TabPanel as AKTabPanel,
} from "@atlaskit/tabs"*/

import { Tabs, TabList, TabPanel, Tab } from "@linked-planet/ui-kit-ts"

function Example() {
	const akExample = (
		<div style={{ minWidth: 300, border: "2px solid orange" }}>
			{/*<AKTabs id="tab-example" defaultSelected={1}>
				<AKTabList>
					<AKTab>
						<div>Tab 1</div>
					</AKTab>
					<AKTab>Tab 2</AKTab>
				</AKTabList>
				<AKTabPanel>
					<span>First Content</span>
				</AKTabPanel>
				<AKTabPanel>
					<span>Second Content</span>
				</AKTabPanel>
	</AKTabs>*/}
		</div>
	)

	//#region tabs
	const lpExample = (
		<div style={{ minWidth: 300, border: "2px solid orange" }}>
			<Tabs defaultSelected="tab2">
				<TabList>
					<Tab label="tab1" />
					<Tab label="tab2">Tab 2</Tab>
				</TabList>
				<TabPanel label="tab1">
					<span>First Content</span>
				</TabPanel>
				<TabPanel label="tab2">
					<span>Second Content</span>
				</TabPanel>
			</Tabs>
		</div>
	)
	//#endregion tabs

	return (
		<>
			{akExample}
			{lpExample}
		</>
	)
}

function ExampleControlled() {
	//#region tabscontrolled
	const [selected, setSelected] = useState(0)
	const lpExample = (
		<div style={{ minWidth: 300, border: "2px solid orange" }}>
			<Tabs
				selected={selected}
				onChange={(t: string) => setSelected(parseInt(t))}
			>
				<TabList>
					<Tab label={0}>
						<div>Tab 1</div>
					</Tab>
					<Tab label={1}>Tab 2</Tab>
				</TabList>
				<TabPanel label={0}>
					<span>First Content</span>
				</TabPanel>
				<TabPanel label={1}>
					<span>Second Content</span>
				</TabPanel>
			</Tabs>
		</div>
	)
	//#endregion tabscontrolled

	const akExample = (
		<div style={{ minWidth: 300, border: "2px solid orange" }}>
			{/*<AKTabs
				id="tab-example-controlled"
				selected={selected}
				onChange={setSelected}
			>
				<AKTabList>
					<AKTab>
						<div>Tab 1</div>
					</AKTab>
					<AKTab>Tab 2</AKTab>
				</AKTabList>
				<AKTabPanel>
					<span>First Content</span>
				</AKTabPanel>
				<AKTabPanel>
					<span>Second Content</span>
				</AKTabPanel>
	</AKTabs>*/}
		</div>
	)

	return (
		<>
			{akExample}
			{lpExample}
		</>
	)
}

function TabsShowcase(props: ShowcaseProps) {
	return (
		<ShowcaseWrapperItem
			name="Tabs"
			{...props}
			packages={[
				{
					name: "@atlaskit/tabs",
					url: "https://atlassian.design/components/tabs/examples",
				},
			]}
			examples={[
				{
					title: "Example",
					example: <Example />,
					sourceCodeExampleId: "tabs",
				},
				{
					title: "Example Controlled",
					example: <ExampleControlled />,
					sourceCodeExampleId: "tabscontrolled",
				},
			]}
		/>
	)
}

export default TabsShowcase
