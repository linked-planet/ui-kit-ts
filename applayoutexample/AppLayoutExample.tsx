import React, { useState } from "react"
import { AppLayout, Checkbox } from "@linked-planet/ui-kit-ts"

import "@atlaskit/css-reset" // sets base styles of AK
import Fillers from "./Fillers"

export default function AppLayoutExample() {
	const [bannerSticky, setBannerSticky] = useState(true)
	const [topNavSticky, setTopNavSticky] = useState(true)
	const [leftPanelSticky, setLeftPanelSticky] = useState(true)
	const [rightPanelSticky, setRightPanelSticky] = useState(true)

	const [leftSidebarSticky, setLeftSidebarSticky] = useState(true)
	const [rightSidebarSticky, setRightSidebarSticky] = useState(true)

	return (
		<AppLayout.Container>
			{/*<AppLayout.Banner
				sticky={bannerSticky}
				className="flex justify-between gap-4 border-2 border-solid px-4 py-2"
			>
				Sticky Banner
				<Checkbox
					checked={bannerSticky}
					onCheckedChange={setBannerSticky}
					label="Banner Sticky"
				/>
			</AppLayout.Banner>
			<AppLayout.TopNavigation
				sticky={topNavSticky}
				className="flex justify-between gap-4 border-2 border-solid p-4"
			>
				Top Navigation
				<Checkbox
					checked={topNavSticky}
					onCheckedChange={setTopNavSticky}
					label="Top Navigation Sticky"
				/>
			</AppLayout.TopNavigation>*/}
			<AppLayout.LeftPanel
				sticky={leftPanelSticky}
				className="border-2 border-dashed p-4"
			>
				<h3 className="mb-4">Left Panel</h3>
				<Checkbox
					checked={leftPanelSticky}
					onCheckedChange={setLeftPanelSticky}
					label="Sticky"
				/>
				<hr />
				<Fillers />
			</AppLayout.LeftPanel>
			<AppLayout.RightPanel
				sticky={rightPanelSticky}
				className="border-2 border-dashed p-4"
			>
				<h3 className="mb-4">Right Panel</h3>
				<Checkbox
					checked={rightPanelSticky}
					onCheckedChange={setRightPanelSticky}
					label="Sticky"
				/>
				<hr />
				<Fillers />
			</AppLayout.RightPanel>
			<AppLayout.Content>
				<AppLayout.LeftSidebar sticky={leftSidebarSticky}>
					<h3 className="mb-4">Left Sidebar</h3>
					<Checkbox
						checked={leftSidebarSticky}
						onCheckedChange={setLeftSidebarSticky}
						label="Left Sidebar Sticky"
					/>
					<Fillers />
				</AppLayout.LeftSidebar>

				<AppLayout.RightSidebar sticky={rightSidebarSticky}>
					<h3 className="mb-4">Right Sidebar</h3>
					<Checkbox
						checked={rightSidebarSticky}
						onCheckedChange={setRightSidebarSticky}
						label="Right Sidebar Sticky"
					/>
					<Fillers />
				</AppLayout.RightSidebar>

				<AppLayout.Main>
					<h1>Main</h1>
					<Fillers />
				</AppLayout.Main>
			</AppLayout.Content>
		</AppLayout.Container>
	)
}
