import axios from "axios"
import { QueryClient } from "react-query"

export const axiosClient = axios.create()
export const queryClient = new QueryClient()
