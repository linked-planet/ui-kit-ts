import {useQuery} from "react-query";
import {axiosClient} from "../App";

export enum QUERY {
    GET_USER= "GET_USER"
}

interface TestResponse {
    title: string,
    content: string
}

export function getTestQuery() {
    return useQuery<TestResponse>(QUERY.GET_USER, requestTestData)
}

function requestTestData(): Promise<TestResponse> {
   return axiosClient.get("http://echo.jsontest.com/title/MyTitle/content/MyContent").then((response) => response.data)
}