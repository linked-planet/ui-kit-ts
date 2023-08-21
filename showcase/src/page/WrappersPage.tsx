import React, { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useShowCases } from "./SinglePage"

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
			{...scs}
		</div>
	)
}

export default WrappersPage
