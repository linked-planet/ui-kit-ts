import React from "react"
import ShowcaseWrapperItem, {
	ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
import { Input } from "@linked-planet/ui-kit-ts"

//#region layeringexample
function Example() {
	return (
		<div className="bg-surface hover:bg-surface-hovered active:bg-surface-pressed border-border border p-4">
			bg-surface
			<div className="p-4">
				<Input placeholder="Test Input" />
				<Input disabled placeholder="Test Input Disabled" />
			</div>
			<div className="bg-surface-raised hover:bg-surface-raised-hovered active:bg-surface-raised-pressed border-border border p-4">
				bg-surface-raised
				<div className="p-4">
					<Input placeholder="Test Input" />
					<Input disabled placeholder="Test Input Disabled" />
				</div>
				<div className="bg-surface-overlay hover:bg-surface-overlay-hovered active:bg-surface-overlay-pressed border-border border p-4">
					bg-surface-overlay
					<div className="p-4">
						<Input placeholder="Test Input" />
						<Input disabled placeholder="Test Input Disabled" />
					</div>
				</div>
			</div>
			<div className="bg-surface-sunken border-border mt-4 border p-4">
				bg-surface-sunken
				<div className="p-4">
					<Input placeholder="Test Input" />
					<Input disabled placeholder="Test Input Disabled" />
				</div>
			</div>
			<div className="border-border shadow-raised mt-4 border p-4">
				shadow-raised
				<div className="p-4">
					<Input placeholder="Test Input" />
					<Input disabled placeholder="Test Input Disabled" />
				</div>
			</div>
			<div className="border-border shadow-overflow mt-4 border p-4">
				shadow-overflow
				<div className="p-4">
					<Input placeholder="Test Input" />
					<Input disabled placeholder="Test Input Disabled" />
				</div>
			</div>
			<div className="border-border shadow-overlay mt-4 border p-4">
				shadow-overlay
				<div className="p-4">
					<Input placeholder="Test Input" />
					<Input disabled placeholder="Test Input Disabled" />
				</div>
			</div>
		</div>
	)
}
//#endregion layeringexample

export default function LayeringShowcase(props: ShowcaseProps) {
	return (
		<ShowcaseWrapperItem
			name="Layering"
			{...props}
			packages={[
				{
					name: "@linked-planet/ui-kit-ts",
					url: "https://www.github.com/linked-planet/ui-kit-ts",
				},
			]}
			description="Not a component but only a showcase of the color layering system."
			examples={[
				{
					title: "Layering",
					example: <Example />,
					sourceCodeExampleId: "layeringexample",
				},
			]}
		/>
	)
}
