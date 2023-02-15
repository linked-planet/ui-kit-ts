import React from "react";
import {CodeBlock} from "@atlaskit/code";

function ReactQueryPage() {

    const reactQueryInstall =`npm install -s react-query axios`

    const initQueryClient = `// index.tsx
// init axios client
export const axiosClient = axios.create({...})
// init query client
export const queryClient = new QueryClient()`

    const reactQueryRegister =`// index.tsx
<QueryClientProvider client={queryClient}>
    <App/>
</QueryClientProvider>`

    const reactQueryQuery = `// TestQuery.ts
export function getTestQuery() {
    return useQuery<TestResponse>(QUERY.GET_USER, requestTestData)
}

function requestTestData(): Promise<TestResponse> {
   return axiosClient.get("http://echo.jsontest.com/title/MyTitle/content/MyContent").then((response) => response.data)
}`

    const reactQueryUsage = `// use query data inside component
const testQuery = getTestQuery()
...
return (
...
{ testQuery.isLoading && <span>Loading</span> }
{ testQuery.isSuccess && <span>Loading: {testQuery.data.title}, {testQuery.data.content}</span> }
...
)`

    return (
        <div>
            <h1>React-Query</h1>
            <p>React-Query is for fetching data from REST and use it as states inside the application</p>

            <h5>Install React-Query</h5>
            <p>Not needed if you use this library. It is already included</p>
            <br/>
            <CodeBlock
                language="bash"
                text={reactQueryInstall}
            />

            <h5>Create queryClient</h5>
            <br/>
            <CodeBlock
                language="typescript"
                text={initQueryClient}
            />

            <h5>Integrate queryClient</h5>
            <br/>
            <CodeBlock
                language="tsx"
                text={reactQueryRegister}
            />

            <h5>Create Query</h5>
            <br/>
            <CodeBlock
                language="typescript"
                text={reactQueryQuery}
            />

            <h5>Use react query data</h5>
            <br/>
            <CodeBlock
                language="typescript"
                text={reactQueryUsage}
            />
        </div>
    )
}

export default ReactQueryPage;