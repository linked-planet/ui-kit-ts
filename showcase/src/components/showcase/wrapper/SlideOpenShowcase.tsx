import { Button, SlideOpen } from "@linked-planet/ui-kit-ts"
import ShowcaseWrapperItem, {
	type ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
import { useState } from "react"

//#region slideopen
function SlideOpenExample() {
	const [opened, setOpened] = useState(false)
	return (
		<>
			<Button onClick={() => setOpened(!opened)} type="button">
				{opened ? "Close" : "Open"}
			</Button>
			<div>before</div>
			<hr className="border-border" />
			<SlideOpen
				open={opened}
				contentClassName="p-2 border-border border-solid rounded border bg-surface max-w-[50%]"
			>
				Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nobis
				debitis ullam ab voluptatibus, fuga, voluptas voluptates sed
				voluptate adipisci necessitatibus illo ipsa cupiditate amet eos
				eveniet ducimus dicta corporis et.
				<br />
				Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veniam
				eius consequuntur modi nisi corporis sit, odio expedita quisquam
				assumenda libero debitis, rerum tempore nobis excepturi facilis,
				mollitia recusandae dicta in.
				<br />
				Lorem ipsum dolor sit amet consectetur adipisicing elit.
				Provident, corporis aperiam quaerat odit quos dolore
				voluptatibus distinctio voluptate, deleniti esse repudiandae
				dolorum sit nam! Ex voluptate provident repellendus rem id.
			</SlideOpen>
			<hr className="border-border" />
			<div>after</div>
		</>
	)
}
//#endregion slideopen

//#region slideopen-bottomup
function SlideOpenBottomUpExample() {
	const [opened, setOpened] = useState(false)
	return (
		<>
			<Button onClick={() => setOpened(!opened)} type="button">
				{opened ? "Close" : "Open"}
			</Button>
			<div>before</div>
			<hr className="border-border" />
			<div className="h-96 bg-surface-overlay relative">
				<SlideOpen
					open={opened}
					contentClassName="max-w-[50%]"
					containerClassName="absolute duration-1000 bottom-0 inset-x-0 data-[open=true]:top-0 data-[open=false]:top-full"
				>
					Lorem ipsum dolor sit, amet consectetur adipisicing elit.
					Nobis debitis ullam ab voluptatibus, fuga, voluptas
					voluptates sed voluptate adipisci necessitatibus illo ipsa
					cupiditate amet eos eveniet ducimus dicta corporis et.
					<br />
					Lorem ipsum dolor sit amet, consectetur adipisicing elit.
					Veniam eius consequuntur modi nisi corporis sit, odio
					expedita quisquam assumenda libero debitis, rerum tempore
					nobis excepturi facilis, mollitia recusandae dicta in.
					<br />
					Lorem ipsum dolor sit amet consectetur adipisicing elit.
					Provident, corporis aperiam quaerat odit quos dolore
					voluptatibus distinctio voluptate, deleniti esse repudiandae
					dolorum sit nam! Ex voluptate provident repellendus rem id.
				</SlideOpen>
			</div>
			<hr className="border-border" />
			<div>after</div>
		</>
	)
}
//#endregion slideopen-bottomup

export default function SLideOpenShowcase(props: ShowcaseProps) {
	return (
		<ShowcaseWrapperItem
			name="SlideOpen"
			description="A minimal and simple component using dynamic height to hide or show the children. It only slides from top to bottom when opening."
			{...props}
			packages={[
				{
					name: "@linked-planet/ui-kit-ts",
					url: "https://linked-planet.github.io/ui-kit-ts/single?component=SlideOpen",
				},
			]}
			examples={[
				{
					title: "Top Down",
					example: <SlideOpenExample />,
					sourceCodeExampleId: "slideopen",
				},
				{
					title: "Bottom Up",
					example: <SlideOpenBottomUpExample />,
					sourceCodeExampleId: "slideopen-bottomup",
				},
			]}
		/>
	)
}
