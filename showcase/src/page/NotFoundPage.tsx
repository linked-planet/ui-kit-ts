import EmptyState from "@atlaskit/empty-state"
import { useNavigate } from "react-router"
import { Button } from "@linked-planet/ui-kit-ts"

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
