import React, { useState } from "react"
import ShowcaseWrapperItem, {
	ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
import AKTabs, {
	Tab as AKTab,
	TabList as AKTabList,
	TabPanel as AKTabPanel,
} from "@atlaskit/tabs"

import { Tabs, TabList, TabPanel, Tab, Button } from "@linked-planet/ui-kit-ts"

function AutomaticTabsValue() {
	//#region tabs_automatic_value
	return (
		<Tabs>
			<TabList>
				<Tab>Tab 1</Tab>
				<Tab>Tab 2</Tab>
			</TabList>
			<TabPanel>
				<span>First Content</span>
			</TabPanel>
			<TabPanel>
				<span>Second Content</span>
			</TabPanel>
		</Tabs>
	)
	//#endregion tabs_automatic_value
}

function ExampleLabels() {
	const akExample = (
		<div style={{ minWidth: 300, border: "2px solid orange" }}>
			{
				<AKTabs id="tab-example" defaultSelected={1}>
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
				</AKTabs>
			}
		</div>
	)

	//#region tabs_labels
	const lpExample = (
		<div style={{ minWidth: 300, border: "2px solid orange" }}>
			<Tabs defaultSelected="tab2">
				<TabList>
					<Tab label="Tab 1" />
					<Tab label="tab2">Tab 2</Tab>
				</TabList>
				<TabPanel label="Tab 1">
					<span>First Content</span>
				</TabPanel>
				<TabPanel label="tab2">
					<span>Second Content</span>
				</TabPanel>
			</Tabs>
		</div>
	)
	//#endregion tabs_labels

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
			<Button
				onClick={() => {
					setSelected(1)
				}}
			>
				Select second tab
			</Button>
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
					name: "@linked-planet/ui-kit-ts",
					url: "https://linked-planet.github.io/ui-kit-ts/single?component=Tabs",
				},
			]}
			description={
				<p>
					If labels are used, they must be consistent between the Tab
					component and the corresponding TabPanel component.
				</p>
			}
			examples={[
				{
					title: "Example",
					example: <AutomaticTabsValue />,
					sourceCodeExampleId: "tabs_automatic_value",
				},
				{
					title: "Example Labels",
					example: <ExampleLabels />,
					sourceCodeExampleId: "tabs_labels",
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
