import React from "react"
import ShowcaseWrapperItem, {type ShowcaseProps,} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
import {useGlobalState} from "@linked-planet/ui-kit-ts/GlobalState";

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

	return <div className="bg-surface"></div>
}
//#endregion global-state

export default function GlobalStateShowcase(props: ShowcaseProps) {
	return (
		<ShowcaseWrapperItem
			name="GlobalState"
			{...props}
			packages={[
				{
					name: "@linked-planet/ui-kit-ts",
					url: "https://linked-planet.github.io/ui-kit-ts/single?component=GlobalState",
				},
			]}
			examples={[
				{
					title: "Global State",
					example: <GlobalStateExample />,
					sourceCodeExampleId: "global-state",
				},
			]}
		/>
	)
}
