import React, { useState } from "react"
import ShowcaseWrapperItem, {
	ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
//import Button, { ButtonGroup, LoadingButton } from "@atlaskit/button"
import {
	Button as LPButton,
	LoadingButton as LPLoadingButton,
	ButtonGroup as LPButtonGroup,
} from "@linked-planet/ui-kit-ts"

function ButtonShowcase(props: ShowcaseProps) {
	//#region button
	const [isLoading, setIsLoading] = useState(false)

	const example = (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "space-evenly",
				height: "100%",
				gap: "1rem",
				overflow: "auto",
			}}
		>
			{/*<ButtonGroup>
				<Button
					appearance="default"
					onClick={() => console.log("Button pressed")}
				>
					Default Button
				</Button>

				<Button
					appearance="default"
					onClick={() => console.log("Button pressed")}
					isSelected={true}
				>
					Selected Button
				</Button>

				<Button
					appearance="default"
					onClick={() => console.log("Button pressed")}
					isDisabled={true}
				>
					Disabled Default button
				</Button>

				<Button
					appearance="primary"
					onClick={() => console.log("Button pressed")}
				>
					Primary button
				</Button>

				<Button
					appearance="primary"
					onClick={() => console.log("Button pressed")}
					isDisabled={true}
				>
					Primary button
				</Button>

				<Button
					appearance="subtle"
					onClick={() => console.log("Button pressed")}
				>
					Subtle button
				</Button>

				<Button
					appearance="link"
					onClick={() => console.log("Button pressed")}
				>
					Link button
				</Button>

				<Button
					appearance="warning"
					onClick={() => console.log("Button pressed")}
				>
					Warning button
				</Button>

				<Button
					appearance="danger"
					onClick={() => console.log("Button pressed")}
				>
					Danger button
				</Button>

				<LoadingButton
					isLoading={isLoading}
					onClick={() => {
						setIsLoading(true)
						window.setTimeout(() => setIsLoading(false), 3000)
					}}
				>
					Loading Button
				</LoadingButton>
				</ButtonGroup>*/}
			<LPButtonGroup>
				<LPButton
					appearance="default"
					onClick={() => console.log("Button pressed")}
				>
					Default Button
				</LPButton>

				<LPButton
					appearance="default"
					onClick={() => console.log("Button pressed")}
					isSelected={true}
				>
					Selected Button
				</LPButton>

				<LPButton
					appearance="default"
					onClick={() => console.log("Button pressed")}
					isDisabled={true}
				>
					Disabled Button
				</LPButton>

				<LPButton
					appearance="primary"
					onClick={() => console.log("Button pressed")}
				>
					Primary Button
				</LPButton>

				<LPButton
					appearance="primary"
					onClick={() => console.log("Button pressed")}
					isDisabled={true}
				>
					Primary Button
				</LPButton>

				<LPButton
					appearance="subtle"
					onClick={() => console.log("Button pressed")}
				>
					Subtle Button
				</LPButton>

				<LPButton
					appearance="link"
					onClick={() => console.log("Button pressed")}
				>
					Link Button
				</LPButton>

				<LPButton
					appearance="warning"
					onClick={() => console.log("Button pressed")}
				>
					Warning Button
				</LPButton>

				<LPButton
					appearance="danger"
					onClick={() => console.log("Button pressed")}
				>
					Danger Button
				</LPButton>

				<LPButton
					appearance="success"
					onClick={() => console.log("Button pressed")}
				>
					Success Button
				</LPButton>

				<LPButton
					appearance="information"
					onClick={() => console.log("Button pressed")}
				>
					Information Button
				</LPButton>

				<LPLoadingButton
					onClick={() => {
						setIsLoading(true)
						window.setTimeout(() => setIsLoading(false), 3000)
					}}
					isLoading={isLoading}
				>
					Loading Button
				</LPLoadingButton>
			</LPButtonGroup>
		</div>
	)
	//#endregion button

	return (
		<ShowcaseWrapperItem
			name="Button & Button-Group"
			{...props}
			packages={[
				{
					name: "@atlaskit/button",
					url: "https://atlassian.design/components/button/examples",
				},
			]}
			examples={[
				{ title: "Example", example, sourceCodeExampleId: "button" },
			]}
		/>
	)
}

export default ButtonShowcase
