import { Calendar, Popover, Select } from "@linked-planet/ui-kit-ts"
import { XIcon } from "lucide-react"
import { useEffect, useRef } from "react"
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
				appearance="primary"
				side="top"
				trigger="open popover"
				closer={<XIcon aria-label="Close Popover" size="12" />}
				className="w-96"
				contentClassName="w-96"
				usePortal
			>
				<Calendar mode="single" />
				<Select
					menuPlacement="top"
					menuIsOpen
					usePortal
					options={[
						{ label: "Option 1", value: "1" },
						{ label: "Option 2", value: "2" },
						{ label: "Option 3", value: "3" },
					]}
				/>
			</Popover.Root>
			<Popover.Root
				trigger={<div className="text-warning-bold">Other Trigger</div>}
				contentClassName="p-4"
				closer="Close"
				side="bottom"
				align="end"
			>
				Content
			</Popover.Root>
			<Popover.Root
				trigger="disabled"
				contentClassName="p-4"
				side="bottom"
				align="end"
				disabled
			>
				Content
			</Popover.Root>
		</>
	)
}
//#endregion popover-example

//#region popover-shadow-root-example
function PopoverShadowRootExample() {
	const example = (
		<Popover.Root trigger="Open Popover" side="top" usePortal>
			Content
		</Popover.Root>
	)

	const divRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (divRef.current && !divRef.current.shadowRoot) {
			const shadowRoot = createShowcaseShadowRoot(divRef.current)

			// render the component
			React.createRoot(shadowRoot).render(example)
		}
	}, [])

	return <div className="w-96" ref={divRef} />
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
