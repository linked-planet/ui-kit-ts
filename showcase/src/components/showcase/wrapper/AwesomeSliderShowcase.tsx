import React from "react"
import ShowcaseWrapperItem, {
	ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
import AwesomeSlider from "react-awesome-slider"

import "react-awesome-slider/dist/styles.css"

function AwesomeSliderShowcase(props: ShowcaseProps) {
	// region: awesome-slider
	const example = (
		<div
			style={{
				minWidth: 600,
				display: "flex",
				height: 200,
				position: "relative",
				zIndex: 0,
			}}
		>
			<AwesomeSlider bullets={false}>
				<div>
					<img
						style={{ objectFit: "scale-down" }}
						src="images/logo.png"
						width={100}
						height={100}
					/>
				</div>
				<div>
					<img
						style={{ objectFit: "scale-down" }}
						src="images/github-logo.png"
						width={100}
						height={100}
					/>
				</div>
			</AwesomeSlider>
		</div>
	)
	// endregion: awesome-slider

	return (
		<ShowcaseWrapperItem
			name="Awesome Slider"
			sourceCodeExampleId="awesome-slider"
			{...props}
			packages={[
				{
					name: "react-awesome-slider",
					url: "https://github.com/rcaferati/react-awesome-slider",
				},
			]}
			examples={[example]}
		/>
	)
}

export default AwesomeSliderShowcase
