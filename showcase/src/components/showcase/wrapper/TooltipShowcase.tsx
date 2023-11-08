import React from "react"
import ShowcaseWrapperItem, {
	ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
import SearchIcon from "@atlaskit/icon/glyph/search"
import { Tooltip } from "@linked-planet/ui-kit-ts"

//import "react-tooltip/dist/react-tooltip.css" -> imported into the libraries css

function TooltipShowcase(props: ShowcaseProps) {
	//#region tooltip
	const example = (
		<div className="flex w-full flex-col items-center">
			<div className="flex gap-4">
				<Tooltip
					place="left"
					tooltipContent={<span>I&apos;m a tooltip</span>}
				>
					<SearchIcon label="" />
				</Tooltip>
				<Tooltip
					place="top"
					tooltipHTMLContent={`<span>I&apos;m a <b>top</b> tooltip with stringified HTML</span>`}
				>
					<SearchIcon label="" />
				</Tooltip>
				<Tooltip place="bottom" tooltipContent={"I'm a bottom tooltip"}>
					<SearchIcon label="" />
				</Tooltip>
				<Tooltip
					id="unique-id"
					place="bottom-end"
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
			<div className="flex gap-4">
				Variants:
				<Tooltip
					tooltipContent={<p>I&apos;m a light tooltip.</p>}
					variant="light"
				>
					<SearchIcon label="" />
				</Tooltip>
				<Tooltip
					tooltipContent={<p>I&apos;m a error tooltip.</p>}
					variant="error"
				>
					<SearchIcon label="" />
				</Tooltip>
				<Tooltip
					tooltipContent={<p>I&apos;m a dark tooltip.</p>}
					variant="dark"
				>
					<SearchIcon label="" />
				</Tooltip>
			</div>
		</div>
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
