import AwesomeSlider from "react-awesome-slider"
import ShowcaseWrapperItem, {
	type ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"

import "react-awesome-slider/dist/styles.css"

function AwesomeSliderShowcase(props: ShowcaseProps) {
	//#region awesome-slider
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
						alt="logo"
					/>
				</div>
				<div>
					<img
						style={{ objectFit: "scale-down" }}
						src="images/github-logo.png"
						width={100}
						height={100}
						alt="github logo"
					/>
				</div>
			</AwesomeSlider>
		</div>
	)
	//#endregion awesome-slider

	return (
		<ShowcaseWrapperItem
			name="Awesome Slider"
			{...props}
			packages={[
				{
					name: "react-awesome-slider",
					url: "https://github.com/rcaferati/react-awesome-slider",
				},
			]}
			examples={[
				{
					title: "Example",
					example,
					sourceCodeExampleId: "awesome-slider",
				},
			]}
		/>
	)
}

export default AwesomeSliderShowcase
