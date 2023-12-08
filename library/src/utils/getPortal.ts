export const portalContainerID = "#uikts-portal" as const

export function getPortal() {
	let portalNode = document.getElementById(portalContainerID)
	if (!portalNode) {
		portalNode = document.createElement("div")
		portalNode.setAttribute("id", portalContainerID)
		portalNode.style.setProperty("z-index", "511") // the atlaskit portal has 510
		portalNode.style.setProperty("position", "relative")
		const body = document.getElementsByTagName("body")[0]
		body.appendChild(portalNode)
	}
	return portalNode
}
