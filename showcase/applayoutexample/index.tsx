import { createRoot } from "react-dom/client"

import AppLayoutExample from "./AppLayoutExample"

const container = document.getElementById("applayout-root")
if (!container) {
	throw new Error("Could not find root element")
}

const root = createRoot(container)
root.render(
	<React.StrictMode>
		<AppLayoutExample />
	</React.StrictMode>,
)
