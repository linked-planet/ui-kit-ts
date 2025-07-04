import { AppLayout, Checkbox, PageLayout } from "@linked-planet/ui-kit-ts"
import { useState } from "react"

import Fillers from "./Fillers"

//#region applayoutexample
export default function AppLayoutExample() {
	const [bannerSticky, setBannerSticky] = useState(true)
	const [topNavSticky, setTopNavSticky] = useState(true)
	const [leftPanelSticky, setLeftPanelSticky] = useState(true)
	const [rightPanelSticky, setRightPanelSticky] = useState(true)

	const [leftSidebarSticky, setLeftSidebarSticky] = useState(true)
	const [rightSidebarSticky, setRightSidebarSticky] = useState(true)
	const [mainFixedHeight, setMainFixedHeight] = useState(true)

	return (
		<AppLayout.Container useBanner>
			<AppLayout.Banner
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
			</AppLayout.TopNavigation>
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

				<AppLayout.Main
					className="overflow-hidden border-2 border-dotted"
					fixedHeight={mainFixedHeight}
				>
					<div className="bg-warning border-warning-bold absolute right-4 top-4 z-10 border-2 border-solid p-4">
						<Checkbox
							checked={mainFixedHeight}
							onCheckedChange={setMainFixedHeight}
							label="Fixed Height"
						/>
					</div>
					<PageLayout.Page>
						<PageLayout.PageHeader shadow={false}>
							<PageLayout.PageHeaderTitle>
								Page Layout
							</PageLayout.PageHeaderTitle>
							<PageLayout.PageHeaderSubTitle>
								Subtitle
							</PageLayout.PageHeaderSubTitle>
						</PageLayout.PageHeader>
						<PageLayout.PageBody>
							<PageLayout.PageBodyHeader>
								Page Body Header
							</PageLayout.PageBodyHeader>
							<PageLayout.PageBodyContent>
								<Fillers />
							</PageLayout.PageBodyContent>
							<PageLayout.PageBodyFooter>
								Page Body Footer
							</PageLayout.PageBodyFooter>
						</PageLayout.PageBody>
					</PageLayout.Page>
				</AppLayout.Main>
			</AppLayout.Content>
		</AppLayout.Container>
	)
}
//#endregion applayoutexample
