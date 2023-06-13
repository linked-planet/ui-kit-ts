import React from "react"
import ShowcaseWrapperItem, { ShowcaseProps } from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
import SearchIcon from "@atlaskit/icon/glyph/search"
import { Tooltip } from "react-tooltip"

import 'react-tooltip/dist/react-tooltip.css'

function TooltipShowcase ( props: ShowcaseProps ) {

	// region: tooltip
	// import 'react-tooltip/dist/react-tooltip.css'
	const example = (
		<div>
			<div id="tooltip-1">
				<SearchIcon label="" />
			</div>
			<Tooltip data-tooltip-id="tooltip-1" place="right"
			>
				<span>I&apos;m a tooltip...</span>
			</Tooltip>
		</div>
	)
	// endregion: tooltip

	return (
		<ShowcaseWrapperItem
			name="Tooltip"
			sourceCodeExampleId="tooltip"
			overallSourceCode={ props.overallSourceCode }
			packages={ [
				{
					name: "react-tooltip",
					url: "https://github.com/wwayne/react-tooltip"
				}
			] }

			examples={
				[
					( example ),
				]
			}
		/>
	)

}

export default TooltipShowcase;