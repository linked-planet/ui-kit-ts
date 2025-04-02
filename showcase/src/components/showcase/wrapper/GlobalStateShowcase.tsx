import ShowcaseWrapperItem, {
	type ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
import { useGlobalState } from "@linked-planet/ui-kit-ts"
import { Input, Label } from "@linked-planet/ui-kit-ts"

//#region global-state
function GlobalStateExample() {
	// define global state type
	interface MyData {
		key: string
		name: string
	}

	// create global state hook
	const useMyData = useGlobalState<MyData>("myData", {
		key: "1",
		name: "Foo Bar",
	})

	// use hook in local components
	const [myData, setMyData] = useMyData

	return (
		<>
			<>
				<Label htmlFor="myDataKey">Key</Label>
				<Input
					type="text"
					id="myDataKey"
					value={myData.key}
					onChange={(e) => {
						setMyData((prev) => ({
							key: e.target.value,
							name: prev.name,
						}))
					}}
				/>
				<Label htmlFor="myDataName">Name</Label>
				<Input
					type="text"
					id="myDataName"
					value={myData.name}
					onChange={(e) => {
						setMyData((prev) => ({
							key: prev.key,
							name: e.target.value,
						}))
					}}
				/>
			</>
			<div className="bg-surface mt-8">{myData.key}</div>
			<div className="bg-surface">{myData.name}</div>
		</>
	)
}
//#endregion global-state

//#region global-state-array

function ArrayString() {
	const [arrayData] = useGlobalState<string[]>("myArrayData", [])
	return (
		<>
			<div className="bg-surface mt-8">{arrayData.join(", ")}</div>
		</>
	)
}

function GlobalArrayStateExample() {
	// create global state hook
	const [arrayData, setArrayData] = useGlobalState<string[]>("myArrayData", [
		"Apple",
		"Banana",
	])

	return (
		<>
			<>
				<Label htmlFor="myDataKey">Array Data Input</Label>
				<Input
					type="text"
					id="myDataKey"
					onKeyUp={(e) => {
						if (e.key !== "Enter") return
						setArrayData((prev) => [
							...prev,
							(e.target as HTMLInputElement).value,
						])
					}}
				/>
			</>
			<ArrayString />
		</>
	)
}
//#endregion global-state-array

export default function GlobalStateShowcase(props: ShowcaseProps) {
	return (
		<ShowcaseWrapperItem
			name="GlobalState"
			description="Global state is a way to store data in a global store. It is useful for storing data that is needed in multiple components. But it does not have fine-grained reactivity - use it only for simple values and shallow objects where things are subscribed to changes only on the top 'value' level."
			{...props}
			packages={[
				{
					name: "@linked-planet/ui-kit-ts",
					url: "/ui-kit-ts/single?component=GlobalState",
				},
			]}
			examples={[
				{
					title: "Global State",
					example: <GlobalStateExample />,
					sourceCodeExampleId: "global-state",
				},
				{
					title: "Global Array State",
					example: <GlobalArrayStateExample />,
					sourceCodeExampleId: "global-state-array",
				},
			]}
		/>
	)
}
