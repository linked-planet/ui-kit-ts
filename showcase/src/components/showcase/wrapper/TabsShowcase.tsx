import React, { useState } from "react"
import ShowcaseWrapperItem, {
	type ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
/*import AKTabs, {
	Tab as AKTab,
	TabList as AKTabList,
	TabPanel as AKTabPanel,
} from "@atlaskit/tabs"*/

import { Tabs, Button } from "@linked-planet/ui-kit-ts"

function AutomaticTabsValue() {
	//#region tabs_automatic_value
	return (
		<Tabs.Container>
			<Tabs.TabList>
				<Tabs.Tab>Tab 1</Tabs.Tab>
				<Tabs.Tab>Tab 2</Tabs.Tab>
				<Tabs.Tab disabled>Tab 3</Tabs.Tab>
			</Tabs.TabList>
			<Tabs.TabPanel>
				<span>First Content</span>
			</Tabs.TabPanel>
			<Tabs.TabPanel>
				<span>Second Content</span>
			</Tabs.TabPanel>
			<Tabs.TabPanel>
				<span>Third Content</span>
			</Tabs.TabPanel>
		</Tabs.Container>
	)
	//#endregion tabs_automatic_value
}

function TabsSides() {
	//#region tabs_side
	return (
		<div className="flex flex-wrap gap-6">
			<Tabs.Container>
				<Tabs.TabList side="top">
					<Tabs.Tab>Tab 1</Tabs.Tab>
					<Tabs.Tab>Tab 2</Tabs.Tab>
				</Tabs.TabList>
				<Tabs.TabPanel>
					<span>First Content</span>
				</Tabs.TabPanel>
				<Tabs.TabPanel>
					<span>Second Content</span>
				</Tabs.TabPanel>
			</Tabs.Container>

			<Tabs.Container>
				<Tabs.TabList side="left">
					<Tabs.Tab>Tab 1</Tabs.Tab>
					<Tabs.Tab>Tab 2</Tabs.Tab>
				</Tabs.TabList>
				<Tabs.TabPanel>
					<span>First Content</span>
				</Tabs.TabPanel>
				<Tabs.TabPanel>
					<span>Second Content</span>
				</Tabs.TabPanel>
			</Tabs.Container>

			<Tabs.Container>
				<Tabs.TabList side="right">
					<Tabs.Tab>Tab 1</Tabs.Tab>
					<Tabs.Tab>Tab 2</Tabs.Tab>
				</Tabs.TabList>
				<Tabs.TabPanel>
					<span>First Content</span>
				</Tabs.TabPanel>
				<Tabs.TabPanel>
					<span>Second Content</span>
				</Tabs.TabPanel>
			</Tabs.Container>

			<Tabs.Container>
				<Tabs.TabList side="bottom">
					<Tabs.Tab>Tab 1</Tabs.Tab>
					<Tabs.Tab>Tab 2</Tabs.Tab>
				</Tabs.TabList>
				<Tabs.TabPanel>
					<span>First Content</span>
				</Tabs.TabPanel>
				<Tabs.TabPanel>
					<span>Second Content</span>
				</Tabs.TabPanel>
			</Tabs.Container>
		</div>
	)
	//#endregion tabs_side
}

function ExampleLabels() {
	/*const akExample = (
		<div>
			{
				<AKTabs id="tab-example" defaultSelected={1}>
					<AKTabList>
						<AKTab>
							<div>AK Tab 1</div>
						</AKTab>
						<AKTab>AK Tab 2</AKTab>
					</AKTabList>
					<AKTabPanel>
						<span>First AK Content</span>
					</AKTabPanel>
					<AKTabPanel>
						<span>Second AK Content</span>
					</AKTabPanel>
				</AKTabs>
			}
		</div>
	)*/

	//#region tabs_labels
	const lpExample = (
		<div>
			<Tabs.Container defaultSelected="tab2">
				<Tabs.TabList>
					<Tabs.Tab label="Tab 1" />
					<Tabs.Tab label="tab2">Tab 2</Tabs.Tab>
				</Tabs.TabList>
				<Tabs.TabPanel label="Tab 1">
					<span>First Content</span>
				</Tabs.TabPanel>
				<Tabs.TabPanel label="tab2">
					<span>Second Content</span>
				</Tabs.TabPanel>
			</Tabs.Container>
		</div>
	)
	//#endregion tabs_labels

	return (
		<div className="bg-surface flex w-full flex-col gap-4">
			{akExample}
			<hr />
			{lpExample}
		</div>
	)
}

function ExampleControlled() {
	//#region tabscontrolled
	const [selected, setSelected] = useState(0)
	const lpExample = (
		<div style={{ minWidth: 300, border: "2px solid orange" }}>
			<Tabs.Container
				selected={selected}
				onChange={(t: string) => setSelected(Number.parseInt(t))}
			>
				<Tabs.TabList>
					<Tabs.Tab label={0}>
						<div>Tab 1</div>
					</Tabs.Tab>
					<Tabs.Tab label={1}>Tab 2</Tabs.Tab>
				</Tabs.TabList>
				<Tabs.TabPanel label={0}>
					<span>First Content</span>
				</Tabs.TabPanel>
				<Tabs.TabPanel label={1}>
					<span>Second Content</span>
				</Tabs.TabPanel>
			</Tabs.Container>
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
				{
					title: "Vertical",
					example: <TabsSides />,
					sourceCodeExampleId: "tabs_side",
				},
			]}
		/>
	)
}

export default TabsShowcase
