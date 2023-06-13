import axios from "axios"
import { useQuery } from "react-query"

export enum QUERY {
	GET_USER = "GET_USER",
}

interface TestResponse {
	title: string
	content: string
}

export function useTestQuery() {
	return useQuery<TestResponse>(QUERY.GET_USER, requestTestData)
}

function requestTestData(): Promise<TestResponse> {
	return axios
		.get<TestResponse>(
			"http://echo.jsontest.com/title/MyTitle/content/MyContent"
		)
		.then((response) => response.data)
}
