import { useNavigate } from "react-router"

function NotFoundPage() {
	const navigation = useNavigate()

	return (
		<section>
			<h1>404 - Not found</h1>
			<p>The page you were looking for doesn&apos;t exist...</p>
		</section>
	)
}

export default NotFoundPage
