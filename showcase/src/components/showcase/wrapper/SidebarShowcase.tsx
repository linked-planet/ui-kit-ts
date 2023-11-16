import React from "react"
import ShowcaseWrapperItem, {
	ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
import { LeftSidebar } from "@linked-planet/ui-kit-ts"
export function SidebarShowcase(props: ShowcaseProps) {
	//#region sidebar
	const example = (
		<div className="h-[300px]">
			<LeftSidebar widthVariable="--leftSidebarWidth2">
				<div>Sidebar Entry</div>
			</LeftSidebar>
		</div>
	)
	//#endregion sidebar

	return (
		<ShowcaseWrapperItem
			name="Sidebar"
			description="A sidebar component as replacement for the left sidebar of the page layout. WIP"
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
