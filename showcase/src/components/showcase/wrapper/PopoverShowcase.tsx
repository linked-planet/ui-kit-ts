import { Button, Calendar, Popover, Select } from "@linked-planet/ui-kit-ts"
import { XIcon } from "lucide-react"
import { useEffect, useMemo, useRef } from "react"
import React from "react-dom/client"
import { createShowcaseShadowRoot } from "../../ShowCaseWrapperItem/createShadowRoot"
import ShowcaseWrapperItem, {
	type ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"

//#region popover-example
function PopoverExample() {
	return (
		<>
			<Popover.Root
				triggerProps={{
					render: (props) => <Button {...props}>trigger</Button>,
					appearance: "primary",
					className: "w-96",
				}}
				closerProps={{
					render: (props) => (
						<XIcon
							aria-label="Close Popover"
							size="12"
							{...props}
						/>
					),
				}}
				positionerProps={{
					side: "top",
					align: "start",
				}}
				popupProps={{
					className: "bg-amber p-5",
				}}
			>
				<Calendar mode="single" />
				<Select
					menuPlacement="bottom"
					usePortal
					options={[
						{ label: "Option 1", value: "1" },
						{ label: "Option 2", value: "2" },
						{ label: "Option 3", value: "3" },
					]}
				/>
			</Popover.Root>

			<Popover.Root
				triggerProps={{
					render: (props) => (
						<Button {...props}>Other Trigger</Button>
					),
					appearance: "subtle",
				}}
			>
				<div className="bg-blue-800 p-5">Content</div>
			</Popover.Root>

			<Popover.Root
				triggerProps={{
					render: (props) => (
						<Button className="text-warning-bold" {...props}>
							disabled
						</Button>
					),
					disabled: true,
				}}
				positionerProps={{
					side: "bottom",
					align: "end",
				}}
			>
				Content
			</Popover.Root>
		</>
	)
}
//#endregion popover-example

//#region popover-shadow-root-example
function PopoverShadowRootExample() {
	const example = useMemo(
		() => (
			<Popover.Root
				triggerProps={{
					render: (props) => <p {...props}>Open Popover</p>,
				}}
				positionerProps={{
					side: "top",
				}}
			>
				Content
			</Popover.Root>
		),
		[],
	)

	const divRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (divRef.current && !divRef.current.shadowRoot) {
			const shadowRoot = createShowcaseShadowRoot(divRef.current)

			// render the component
			React.createRoot(shadowRoot).render(example)
		}
	}, [example])

	return (
		<div className="w-96 bg-blue-600" ref={divRef}>
			Shadow Root
		</div>
	)
}
//#endregion popover-shadow-root-example
export default function PopoverShowcase(props: ShowcaseProps) {
	return (
		<ShowcaseWrapperItem
			name="Popover"
			description="Popup is a component that displays a floating window that appears on top of the app’s content, similar to a dropdown."
			{...props}
			packages={[
				{
					name: "@linked-planet/ui-kit-ts",
					url: "https://linked-planet.github.io/ui-kit-ts/single?component=Popover",
				},
				{
					name: "@base-ui-components/react/popover",
					url: "https://base-ui.com/react/components/popover#popup",
				},
			]}
			examples={[
				{
					title: "Example",
					example: <PopoverExample />,
					sourceCodeExampleId: "popover-example",
				},
				{
					title: "Popover with Shadow Root",
					example: <PopoverShadowRootExample />,
					sourceCodeExampleId: "popover-shadow-root-example",
				},
			]}
		/>
	)
}
