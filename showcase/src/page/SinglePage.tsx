import React, { useEffect, useMemo, useState } from "react"
import { useDispatch } from "react-redux"
import Select from "@atlaskit/select"
import useShowCases from "../useShowcases"

export default function SinglePage() {
	const dispatch = useDispatch()
	const [overallSourceCode, setOverallSourceCode] = useState("")
	// retrieve source code

	useEffect(() => {
		fetch("./showcase-sources.txt")
			.then((response) => response.text())
			.then((sourceCode) => {
				//console.info( "Loaded SourceCode:", sourceCode );
				setOverallSourceCode(sourceCode)
			})
		dispatch({
			type: "SET_MENU",
		})
	}, [dispatch])

	const scs = useShowCases({ overallSourceCode })

	const idFromUrl = window.location.hash.substring(1)

	const { options, defaultOption } = useMemo(() => {
		const options = Object.entries(scs).map(([id, component]) => ({
			label: id,
			value: component,
		}))
		const defaultOption = options.find((it) => it.label === idFromUrl)

		return { options, defaultOption }
	}, [scs, idFromUrl])

	const [sc, setSC] = useState(defaultOption ?? options?.[0])

	console.log("URL", idFromUrl, sc, options, defaultOption)

	return (
		<>
			<Select
				options={options}
				onChange={(e) => {
					if (e?.value) {
						setSC(e)
					}
				}}
				defaultValue={defaultOption ?? options[0]}
				autoFocus
			/>
			{sc && React.cloneElement(sc.value, { id: sc.label })}
		</>
	)
}
