import React from "react"
import ShowcaseWrapperItem, {
	ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
import SearchIcon from "@atlaskit/icon/glyph/search"
import { Tooltip } from "react-tooltip"

import "react-tooltip/dist/react-tooltip.css"

function TooltipShowcase(props: ShowcaseProps) {
	//#region tooltip
	// import 'react-tooltip/dist/react-tooltip.css'
	const example = (
		<div className="flex h-48 w-full items-center justify-center">
			<div data-tooltip-id="tooltip-1">
				<SearchIcon label="" />
			</div>
			<Tooltip id="tooltip-1" place="right">
				<span>I&apos;m a tooltip...</span>
			</Tooltip>
		</div>
	)
	//#endregion tooltip

	return (
		<ShowcaseWrapperItem
			name="Tooltip"
			{...props}
			packages={[
				{
					name: "react-tooltip",
					url: "https://github.com/wwayne/react-tooltip",
				},
			]}
			examples={[
				{ title: "Example", example, sourceCodeExampleId: "tooltip" },
			]}
		/>
	)
}

export default TooltipShowcase
