import React, { useEffect, useMemo, useState } from "react"
import Select from "@atlaskit/select"
import useShowCases from "../useShowcases"
import { useSearchParams } from "react-router-dom"

export default function SinglePage() {
	const [overallSourceCode, setOverallSourceCode] = useState("")

	// retrieve source code
	useEffect(() => {
		fetch("./showcase-sources.txt")
			.then((response) => response.text())
			.then((sourceCode) => {
				console.info("Loaded Source Code")
				setOverallSourceCode(sourceCode)
			})
	}, [])

	const scs = useShowCases({ overallSourceCode })

	const [params, setParams] = useSearchParams()
	const idFromParam = params.get("component") ?? ""

	const { options, defaultOption } = useMemo(() => {
		const options = Object.entries(scs).map(([id, component]) => ({
			label: id,
			value: component,
		}))
		const defaultOption = options.find(
			(it) =>
				it.label.toLocaleLowerCase() ===
				idFromParam.toLocaleLowerCase(),
		)
		return { options, defaultOption }
	}, [scs, idFromParam])

	const [sc, setSC] = useState(defaultOption ?? options?.[0])
	useEffect(() => {
		setSC(defaultOption ?? options?.[0])
	}, [options, defaultOption])

	return (
		<div className="mt-12">
			<Select
				options={options}
				onChange={(e) => {
					if (e?.value) {
						setSC(e)
						params.set("component", e.label)
						params.delete("example")
						setParams(params)
					}
				}}
				value={sc}
				autoFocus
			/>
			{sc && React.cloneElement(sc.value, { id: sc.label })}
		</div>
	)
}
