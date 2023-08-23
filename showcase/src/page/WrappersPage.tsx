import React, { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import useShowCases from "../useShowcases"

function WrappersPage() {
	const dispatch = useDispatch()
	const [overallSourceCode, setOverallSourceCode] = useState("")
	// retrieve source code

	const scs = useShowCases({ overallSourceCode })

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

	return (
		<div>
			<h1>Wrappers</h1>
			{Object.entries(scs).map(([id, component]) =>
				React.cloneElement(component, { id }),
			)}
		</div>
	)
}

export default WrappersPage
