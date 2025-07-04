import { AnimatedList, Button, ButtonGroup } from "@linked-planet/ui-kit-ts"
import { useState } from "react"
import ShowcaseWrapperItem, {
	type ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"

//#region animated-list
function AnimatedListExample() {
	const [showItem0, setShowItem0] = useState(true)
	const [showItem1, setShowItem1] = useState(true)
	const [showItem2, setShowItem2] = useState(true)

	const [enableEnterAnimation, setEnableEnterAnimation] = useState(true)
	const [enableExitAnimation, setEnableExitAnimation] = useState(true)

	const className = "border rounded border-border p-4 bg-brand"

	return (
		<>
			<ButtonGroup className="mb-4">
				<Button onClick={() => setShowItem0(!showItem0)}>
					{showItem0 ? "Hide Item 0" : "Show Item 0"}
				</Button>
				<Button onClick={() => setShowItem1(!showItem1)}>
					{showItem0 ? "Hide Item 1" : "Show Item 1"}
				</Button>
				<Button onClick={() => setShowItem2(!showItem2)}>
					{showItem0 ? "Hide Item 2" : "Show Item 2"}
				</Button>
			</ButtonGroup>
			<ButtonGroup className="mb-4 ml-8">
				<Button
					onClick={() =>
						setEnableEnterAnimation(!enableEnterAnimation)
					}
				>
					{enableEnterAnimation
						? "Disable Enter Animation"
						: "Enable Enter Animation"}
				</Button>
				<Button
					onClick={() => setEnableExitAnimation(!enableExitAnimation)}
				>
					{enableExitAnimation
						? "Disable Exit Animation"
						: "Enable Exit Animation"}
				</Button>
			</ButtonGroup>
			<AnimatedList
				className="flex flex-col gap-2"
				classNames={{
					enter: "duration-300 ease-in-out opacity-5 relative -translate-x-full",
					enterDone:
						"duration-300 ease-in-out opacity-100 relative translate-x-0",
					exit: "duration-300 ease-in-out opacity-5 relative -translate-x-full",
				}}
				timeout={300}
				enter={enableEnterAnimation}
				exit={enableExitAnimation}
				onEnter={() => console.log("Enter")}
				onEntering={() => console.log("Entering")}
				onEntered={() => console.log("Entered")}
				onExit={() => console.log("Exit")}
				onExiting={() => console.log("Exiting")}
				onExited={() => console.log("Exited")}
			>
				{showItem0 && <div className={className}>Item 0</div>}
				{showItem1 && <div className={className}>Item 1</div>}
				{showItem2 && <div className={className}>Item 2</div>}
			</AnimatedList>
		</>
	)
}
//#endregion animated-list

export default function AnimatedListShowcase(props: ShowcaseProps) {
	return (
		<ShowcaseWrapperItem
			name="Animated List"
			{...props}
			packages={[
				{
					name: "@linked-planet/ui-kit-ts",
					url: "https://linked-planet.github.io/ui-kit-ts/single#AnimatedList",
				},
			]}
			examples={[
				{
					title: "Animated List",
					example: <AnimatedListExample />,
					sourceCodeExampleId: "animated-list",
				},
			]}
		/>
	)
}
