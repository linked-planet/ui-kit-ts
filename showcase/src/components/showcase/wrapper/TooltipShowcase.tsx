import React from "react"
import ShowcaseWrapperItem, {
	ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
import SearchIcon from "@atlaskit/icon/glyph/search"
import { Tooltip, TooltipProvider } from "@linked-planet/ui-kit-ts"

//import "react-tooltip/dist/react-tooltip.css" -> imported into the libraries css

function TooltipShowcase(props: ShowcaseProps) {
	//#region tooltip
	const example = (
		<TooltipProvider>
			<div className="flex w-full flex-col items-center">
				<div className="flex gap-4">
					<Tooltip
						side="left"
						tooltipContent={<span>I&apos;m a tooltip</span>}
						usePortal
						align="start"
					>
						<SearchIcon label="" />
					</Tooltip>
					<Tooltip
						tooltipHTMLContent={`<span>I&apos;m a <b>top</b> tooltip with stringified HTML</span>`}
						usePortal={false}
						side="bottom"
						align="end"
					>
						<SearchIcon label="" />
					</Tooltip>
					<Tooltip
						side="top"
						defaultOpen
						tooltipContent={"I'm a top tooltip"}
					>
						<SearchIcon label="" />
					</Tooltip>
					<Tooltip
						side="bottom"
						open
						tooltipContent={
							<p>
								I&apos;m a bottom-end tooltip <br />
								with a unique id.
							</p>
						}
					>
						<SearchIcon label="" />
					</Tooltip>
				</div>
			</div>
		</TooltipProvider>
	)
	//#endregion tooltip

	return (
		<ShowcaseWrapperItem
			name="Tooltip"
			description={
				<p>
					A tooltip component that wraps the children in a div and
					adds a tooltip to it. <br />
					Use tooltipContent for the tooltip content and
					tooltipHTMLContent in case you have stringified HTML as
					tooltip content. <br />
					<br />
					Based on react-tooltip.
					<br />
					The variant defines the color of the tooltip - if it is not
					defined, it is unstyled.
				</p>
			}
			{...props}
			packages={[
				{
					name: "tooltip",
					url: "http://localhost:3000/ui-kit-ts/single#Tooltip",
				},
			]}
			examples={[
				{ title: "Example", example, sourceCodeExampleId: "tooltip" },
			]}
		/>
	)
}

export default TooltipShowcase
