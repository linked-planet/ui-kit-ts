import React, { useEffect } from "react";
import { CodeBlock } from "@atlaskit/code";
import { useDispatch } from "react-redux";

function ReactQueryPage () {

	const dispatch = useDispatch()

	const reactQueryInstall = `npm install -s react-query axios`

	const initQueryClient = `// index.tsx
// init axios client
export const axiosClient = axios.create({...})
// init query client
export const queryClient = new QueryClient()`

	const reactQueryRegister = `// index.tsx
<QueryClientProvider client={queryClient}>
    <App/>
</QueryClientProvider>`

	const reactQueryQuery = `// TestQuery.ts
import { useQuery } from "react-query"

export function useTestQuery() {
    return useQuery<TestResponse>(QUERY.GET_USER, requestTestData)
}

function requestTestData(): Promise<TestResponse> {
   return axiosClient.get("http://echo.jsontest.com/title/MyTitle/content/MyContent").then((response) => response.data)
}`

	const reactQueryUsage = `// use query data inside component
const testQuery = useQuery<TestResponse>(QUERY.GET_USER, requestTestData)
...
return (
...
{ testQuery.isLoading && <span>Loading</span> }
{ testQuery.isSuccess && <span>Loading: {testQuery.data.title}, {testQuery.data.content}</span> }
...
)`

	useEffect( () => {
		dispatch( {
			type: "SET_MENU"
		} )
	}, [ dispatch ] )

	return (
		<div>
			<h1>React-Query</h1>
			<p>React-Query is for fetching data from REST and use it as states inside the application</p>

			<div id="dependencies" menu-name="Dependencies" className="menu pd">
				<h5>Dependencies</h5>
				<p>This library uses the following dependencies:</p>
				<br />
				<CodeBlock
					language="bash"
					text={ reactQueryInstall }
				/>
			</div>

			<div id="create-client" menu-name="Create Client" className="menu pd">
				<h5>Create queryClient</h5>
				<br />
				<CodeBlock
					language="typescript"
					text={ initQueryClient }
				/>
			</div>

			<div id="integrate-client" menu-name="Integrate Client" className="menu pd">
				<h5>Integrate queryClient</h5>
				<br />
				<CodeBlock
					language="tsx"
					text={ reactQueryRegister }
				/>
			</div>

			<div id="create-query" menu-name="Create Query" className="menu pd">
				<h5 >Create Query</h5>
				<br />
				<CodeBlock
					language="typescript"
					text={ reactQueryQuery }
				/>
			</div>

			<div id="use-query" menu-name="Use Query" className="menu pd">
				<h5>Use react query data</h5>
				<br />
				<CodeBlock
					language="typescript"
					text={ reactQueryUsage }
				/>
			</div>
		</div>
	)
}

export default ReactQueryPage;