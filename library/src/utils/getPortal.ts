export const portalContainerID = "uikts-portal" as const

export function getPortal(insidePortalContainerID: string) {
	let portalNode = document.getElementById(portalContainerID)
	if (!portalNode) {
		console.log("creating portal node with id:", portalContainerID)
		portalNode = document.createElement("div")
		portalNode.setAttribute("id", portalContainerID)
		portalNode.style.setProperty("z-index", "511") // the atlaskit portal has 510
		portalNode.style.setProperty("position", "absolute")
		portalNode.style.setProperty("inset", "0")
		portalNode.style.setProperty("pointer-events", "none")
		const body = document.getElementsByTagName("body")[0]
		body.appendChild(portalNode)
	}
	let insidePortalNode = portalNode.querySelector(
		"#" + insidePortalContainerID,
	) as HTMLElement | null
	if (!insidePortalNode) {
		insidePortalNode = document.createElement("div")
		insidePortalNode.setAttribute("id", insidePortalContainerID)
		insidePortalNode.style.setProperty("pointer-events", "auto")
		portalNode.appendChild(insidePortalNode)
	}
	return insidePortalNode
}
