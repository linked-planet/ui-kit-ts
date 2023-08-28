import React, { useEffect, useMemo, useState } from "react"
import Select from "@atlaskit/select"
import useShowCases from "../useShowcases"
import { useLocation } from "react-router-dom"

export default function SinglePage() {
	const [overallSourceCode, setOverallSourceCode] = useState("")
	const location = useLocation()

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

	const idFromUrl = decodeURIComponent(location.hash.substring(1))

	const { options, defaultOption } = useMemo(() => {
		const options = Object.entries(scs).map(([id, component]) => ({
			label: id,
			value: component,
		}))
		const defaultOption = options.find((it) => it.label === idFromUrl)
		return { options, defaultOption }
	}, [scs, idFromUrl])

	const [sc, setSC] = useState(defaultOption ?? options?.[0])
	useEffect(() => {
		setSC(defaultOption ?? options?.[0])
	}, [options, defaultOption])

	return (
		<div
			style={{
				marginTop: "3rem",
			}}
		>
			<Select
				options={options}
				onChange={(e) => {
					if (e?.value) {
						setSC(e)
					}
				}}
				value={sc}
				autoFocus
			/>
			{sc && React.cloneElement(sc.value, { id: sc.label })}
		</div>
	)
}
