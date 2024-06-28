import type React from "react"
import ShowcaseWrapperItem, {
	type ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
import { AppLayout } from "@linked-planet/ui-kit-ts"
export function SidebarShowcase(props: ShowcaseProps) {
	//#region sidebar
	const example = (
		<div className="h-[300px]">
			<AppLayout.LeftSidebar
				widthVar={"--showcaseSidebarWidth"}
				flyoutVar={"--showcaseSidebarFlyoutWidth"}
				localStorageWidthKey={"showcaseLeftSidebarWidth"}
				localStorageCollapsedKey={"showcaseLeftSidebarCollapsed"}
			>
				<div>Sidebar Entry</div>
			</AppLayout.LeftSidebar>
		</div>
	)
	//#endregion sidebar

	return (
		<ShowcaseWrapperItem
			name="Sidebar"
			description="A sidebar component as replacement for the sidebar of the page layout. WIP"
			{...props}
			packages={[
				{
					name: "@linked-planet/ui-kit-ts",
					url: "https://linked-planet.github.io/ui-kit-ts/single?component=Sidebar",
				},
			]}
			examples={[
				{ title: "Example", example, sourceCodeExampleId: "sidbear" },
			]}
		/>
	)
}
