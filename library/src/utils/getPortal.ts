export const portalContainerID = "uikts-portal" as const

let portalRootNode: HTMLElement | ShadowRoot = document.body

export function setPortalRootNode(rootNode: HTMLElement | ShadowRoot) {
	portalRootNode = rootNode
}

/**
 * Get a portal node for the given insidePortalContainerID, portal rootnode is established on first call
 * @param insidePortalContainerID - The id of the container to get the portal node for
 * @param shadowRoot - The root node to use for the portal, defaults to document.body
 * @returns The portal node
 */
export function getPortal(
	insidePortalContainerID: string,
	shadowRoot?: ShadowRoot | null,
) {
	if (!insidePortalContainerID) {
		throw new Error("No portal container id provided")
	}

	let portalNode = shadowRoot
		? shadowRoot.getElementById(portalContainerID)
		: document.getElementById(portalContainerID)
	// probably this should go to the host document of the shadowRoot

	if (!portalNode) {
		console.log("creating portal node with id:", portalContainerID)
		portalNode = document.createElement("div")
		portalNode.setAttribute("id", portalContainerID)
		portalNode.style.setProperty("z-index", "511") // the atlaskit portal has 510
		portalNode.style.setProperty("position", "absolute") // cannot set this to fixed or things like dropdowns menus will be positioned wrongly on scroll
		portalNode.style.setProperty("inset", "0")
		portalNode.style.setProperty("pointer-events", "none")
		if (shadowRoot) {
			shadowRoot.appendChild(portalNode)
		} else {
			portalRootNode.appendChild(portalNode)
		}
	}

	const searchRoot = portalNode.shadowRoot ?? portalNode

	let insidePortalNode = searchRoot.querySelector(
		`#${insidePortalContainerID}`,
	) as HTMLElement | null

	if (!insidePortalNode) {
		insidePortalNode = document.createElement("div")
		insidePortalNode.setAttribute("id", insidePortalContainerID)
		insidePortalNode.style.setProperty("pointer-events", "auto")
		searchRoot.appendChild(insidePortalNode)
	}

	return insidePortalNode
}
