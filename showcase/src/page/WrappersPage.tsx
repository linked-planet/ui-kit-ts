import { cloneElement, useEffect, useState } from "react"
import useShowCases from "../useShowcases"

function WrappersPage() {
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
	}, [])

	return (
		<>
			{Object.entries(scs).map(([id, component]) =>
				cloneElement(component, { id }),
			)}
		</>
	)
}

export default WrappersPage
