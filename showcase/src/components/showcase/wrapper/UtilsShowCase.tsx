import React, { useState } from "react"
import {
	debounceHelper,
	rateLimitHelper,
	useDebounceHelper,
	useRateLimitHelper,
} from "@linked-planet/ui-kit-ts"
import ShowcaseWrapperItem, {
	ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"

// export this outside of a component, or this will be recreated on every render
const debounced = debounceHelper()
function DebounceHelperExample() {
	const [value, setValue] = useState("test")
	const [debouncedValue, setDebouncedValue] = useState("test")

	return (
		<div>
			<h4>debounceHelper</h4>
			<input
				value={value}
				onChange={(e) => {
					const newVal = e.target.value
					setValue(newVal)
					debounced(() => {
						setDebouncedValue(newVal)
					}, 1000)
				}}
			/>
			<p>Debounced value: {debouncedValue}</p>
		</div>
	)
}

function UseDebounceHelperExample() {
	const [value, setValue] = useState("test")
	const [debouncedValue, setDebouncedValue] = useState("test")
	const debHelper = useDebounceHelper()

	return (
		<div>
			<h4>useDebounceHelper</h4>
			<input
				value={value}
				onChange={(e) => {
					const newVal = e.target.value
					setValue(newVal)
					debHelper(() => setDebouncedValue(newVal), 1000)
				}}
			/>
			<p>Debounced value: {debouncedValue}</p>
		</div>
	)
}

const rateLimited = rateLimitHelper(500)
function RateLimitHelperExample() {
	const [value, setValue] = useState("test")
	const [rateLimitedValue, setRateLimitedValue] = useState("test")

	return (
		<div>
			<h4>rateLimitHelper</h4>
			<input
				value={value}
				onChange={(e) => {
					const newVal = e.target.value
					setValue(newVal)
					rateLimited(() => {
						setRateLimitedValue(newVal)
					})
				}}
			/>
			<p>Rate limited value: {rateLimitedValue}</p>
		</div>
	)
}

function UseRateLimitHelperExample() {
	const [value, setValue] = useState("test")
	const [rateLimitedValue, setRateLimitedValue] = useState("test")
	const rlHelper = useRateLimitHelper(500)

	return (
		<div>
			<h4>useRateLimitHelper</h4>
			<input
				value={value}
				onChange={(e) => {
					const newVal = e.target.value
					setValue(newVal)
					rlHelper(() => {
						setRateLimitedValue(newVal)
					})
				}}
			/>
			<p>Rate limited value: {rateLimitedValue}</p>
		</div>
	)
}

export default function UtilsShowCase(props: ShowcaseProps) {
	const examples = [
		<DebounceHelperExample key={"debounceHelperExample"} />,
		<UseDebounceHelperExample key={"useDebounceHelperExample"} />,
		<RateLimitHelperExample key={"rateLimitHelperExample"} />,
		<UseRateLimitHelperExample key={"useRateLimitHelperExample"} />,
	]

	return (
		<ShowcaseWrapperItem
			name="Utilities"
			sourceCodeExampleId="utils"
			{...props}
			packages={[
				{
					name: "@linked-planet/ui-kit-ts",
					url: "https://github.com/linked-planet/ui-kit-ts",
				},
			]}
			examples={examples}
		/>
	)
}
