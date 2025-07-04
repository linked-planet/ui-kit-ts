/*import AKButton, {
	ButtonGroup as AKButtonGroup,
	LoadingButton as AKLoadingButton,
} from "@atlaskit/button"*/
import { Button, ButtonGroup, LoadingButton } from "@linked-planet/ui-kit-ts"
import { SearchIcon } from "lucide-react"
import { useState } from "react"
import ShowcaseWrapperItem, {
	type ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"

function ButtonShowcase(props: ShowcaseProps) {
	const [isLoading, setIsLoading] = useState(false)

	const akExample = (
		<>
			{/*<AKButtonGroup>
				<AKButton
					appearance="default"
					onClick={() => console.log("Button pressed")}
				>
					Default Button
				</AKButton>

				<AKButton
					appearance="default"
					onClick={() => console.log("Button pressed")}
					isSelected={true}
				>
					Selected Button
				</AKButton>

				<AKButton
					appearance="default"
					onClick={() => console.log("Button pressed")}
					isDisabled={true}
				>
					Disabled Default button
				</AKButton>

				<AKButton
					appearance="primary"
					onClick={() => console.log("Button pressed")}
				>
					Primary button
				</AKButton>

				<AKButton
					appearance="primary"
					onClick={() => console.log("Button pressed")}
					isDisabled={true}
				>
					Primary button
				</AKButton>

				<AKButton
					appearance="subtle"
					onClick={() => console.log("Button pressed")}
				>
					Subtle button
				</AKButton>

				<AKButton
					appearance="subtle"
					onClick={() => console.log("Button pressed")}
					isDisabled
				>
					Subtle Disabled button
				</AKButton>

				<AKButton
					appearance="link"
					onClick={() => console.log("Button pressed")}
				>
					Link button
				</AKButton>

				<AKButton
					appearance="warning"
					onClick={() => console.log("Button pressed")}
				>
					Warning button
				</AKButton>

				<AKButton
					appearance="danger"
					onClick={() => console.log("Button pressed")}
					iconAfter={<SearchIcon label="" />}
					iconBefore={<SearchIcon label="" />}
				>
					Danger button
				</AKButton>
				<AKLoadingButton
					isLoading={isLoading}
					onClick={() => {
						setIsLoading(true)
						window.setTimeout(() => setIsLoading(false), 3000)
					}}
					iconBefore={<SearchIcon label="" />}
					iconAfter={<SearchIcon label="" />}
				>
					Icon Loading Button
				</AKLoadingButton>

				<AKButton
					appearance="subtle-link"
					onClick={() => console.log("Button pressed")}
				>
					Subtle Link Button
				</AKButton>

				<AKButton
					appearance="primary"
					href={"https://www.google.com/"}
					target="_blank"
					onClick={() => console.log("Href Button pressed")}
				>
					Href Button
				</AKButton>

				<AKButton
					appearance="primary"
					href={
						"https://pbs.twimg.com/profile_images/1311008414156423170/Kxu_7mQS_400x400.jpg"
					}
					target="_blank"
					download
					onClick={() => console.log("Href Button pressed")}
				>
					Download Button
				</AKButton>
			</AKButtonGroup>*/}
		</>
	)

	//#region button
	const lpExample = (
		<div>
			<ButtonGroup data-id="test-data-id">
				<Button
					appearance="default"
					onClick={() => console.log("Button pressed")}
					autoFocus={true}
				>
					Default Button
				</Button>
				<Button
					appearance="default"
					onClick={() => console.log("Button pressed")}
					autoFocus={true}
					inverted
				>
					Default Inverted Button
				</Button>

				<Button
					appearance="default"
					onClick={() => console.log("Button pressed")}
					selected={true}
				>
					Selected Button
				</Button>

				<Button
					appearance="default"
					onClick={() => console.log("Button pressed")}
					disabled={true}
				>
					Disabled Button
				</Button>

				<Button
					appearance="default"
					onClick={() => console.log("Button pressed")}
					disabled
					inverted
				>
					Disabled Inverted Button
				</Button>

				<Button
					appearance="primary"
					onClick={() => console.log("Button pressed")}
				>
					Primary Button
				</Button>

				<Button
					appearance="primary"
					onClick={() => console.log("Button pressed")}
					inverted
				>
					Primary Inverted Button
				</Button>

				<Button
					appearance="primary"
					onClick={() => console.log("Button pressed")}
					inverted
					disabled
				>
					Primary Inverted Disabled Button
				</Button>

				<Button
					onClick={() => console.log("Button pressed")}
					disabled={true}
				>
					Disabled Button
				</Button>

				<Button
					appearance="subtle"
					onClick={() => console.log("Button pressed")}
				>
					Subtle Button
				</Button>

				<Button
					appearance="subtle-link"
					onClick={() => console.log("Button pressed")}
				>
					Subtle Link Button
				</Button>

				<Button
					appearance="subtle"
					onClick={() => console.log("Button pressed")}
					disabled
				>
					Subtle Disabled Button
				</Button>

				<Button
					appearance="link"
					onClick={() => console.log("Button pressed")}
				>
					Link Button
				</Button>

				<Button appearance="link" disabled>
					Disabled Link Button
				</Button>

				<Button
					appearance="warning"
					onClick={() => console.log("Button pressed")}
				>
					Warning Button
				</Button>

				<Button
					appearance="warning"
					onClick={() => console.log("Button pressed")}
					inverted
				>
					Warning Inverted Button
				</Button>

				<Button
					appearance="danger"
					onClick={() => console.log("Button pressed")}
				>
					Danger Button
				</Button>

				<Button
					appearance="danger"
					onClick={() => console.log("Button pressed")}
					inverted
				>
					Danger Inverted Button
				</Button>

				<Button
					appearance="success"
					onClick={() => console.log("Button pressed")}
				>
					Success Button
				</Button>

				<Button
					appearance="success"
					onClick={() => console.log("Button pressed")}
					inverted
				>
					Success Inverted Button
				</Button>

				<Button
					appearance="information"
					onClick={() => console.log("Button pressed")}
					iconAfter={<SearchIcon aria-label="Search" size="12" />}
					iconBefore={<SearchIcon aria-label="Search" size="12" />}
				>
					Information Button
				</Button>

				<Button
					appearance="information"
					onClick={() => console.log("Button pressed")}
					iconAfter={<SearchIcon aria-label="Search" size="12" />}
					iconBefore={<SearchIcon aria-label="Search" size="12" />}
					inverted
				>
					Information Inverted Button
				</Button>

				<Button
					appearance="discovery"
					onClick={() => console.log("Button pressed")}
					iconAfter={<SearchIcon aria-label="Search" size="12" />}
					iconBefore={<SearchIcon aria-label="Search" size="12" />}
				>
					Discovery Button
				</Button>

				<Button
					appearance="discovery"
					onClick={() => console.log("Button pressed")}
					iconAfter={<SearchIcon aria-label="Search" size="12" />}
					iconBefore={<SearchIcon aria-label="Search" size="12" />}
					inverted
				>
					Discovery Inverted Button
				</Button>

				<LoadingButton
					onClick={() => {
						setIsLoading(true)
						window.setTimeout(() => setIsLoading(false), 3000)
					}}
					loading={isLoading}
					iconBefore={<SearchIcon aria-label="Search" size="12" />}
					iconAfter={<SearchIcon aria-label="Search" size="12" />}
					className="h-6"
				>
					Icon Loading Button
				</LoadingButton>

				<LoadingButton
					onClick={() => {
						setIsLoading(true)
						window.setTimeout(() => setIsLoading(false), 3000)
					}}
					loading={isLoading}
					iconBefore={<SearchIcon aria-label="Search" size="12" />}
					iconAfter={<SearchIcon aria-label="Search" size="12" />}
					appearance="subtle-link"
				>
					Primary Icon Loading Button
				</LoadingButton>

				<Button
					appearance="primary"
					href={"https://www.google.com/"}
					target="_blank"
				>
					Href Button
				</Button>

				<Button
					appearance="primary"
					href={
						"https://pbs.twimg.com/profile_images/1311008414156423170/Kxu_7mQS_400x400.jpg"
					}
					target="_blank"
					download
				>
					Download Button
				</Button>
			</ButtonGroup>
		</div>
	)
	//#endregion button

	const example = (
		<div className="flex w-full flex-col items-center justify-start gap-4 overflow-auto">
			{akExample}
			{lpExample}
		</div>
	)

	return (
		<ShowcaseWrapperItem
			name="Button & Button-Group"
			{...props}
			packages={[
				{
					name: "@linked-planet/ui-kit-ts",
					url: "http://linked-planet.github.io/ui-kit-ts/single?component=Button",
				},
			]}
			examples={[
				{ title: "Example", example, sourceCodeExampleId: "button" },
			]}
		/>
	)
}

export default ButtonShowcase
