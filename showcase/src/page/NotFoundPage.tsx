import React from "react"
import EmptyState from "@atlaskit/empty-state"
import Button from "@atlaskit/button"
import { useNavigate } from "react-router"

function NotFoundPage() {
	const navigation = useNavigate()

	return (
		<EmptyState
			header="404 - Not found"
			description={
				<span>The page you were looking for doesn&apos;t exist...</span>
			}
			primaryAction={
				<Button onClick={() => navigation("/")} appearance="primary">
					Back to start
				</Button>
			}
		/>
	)
}

export default NotFoundPage
