export const portalContainerID = "uikts-portal" as const

let portalRootNode: HTMLElement | ShadowRoot | null = null
/**
 * Set the root node to use for the portal. In it the different portal nodes will be created when getPortal is called without an overwritten portal root node.
 * @param rootNode - The root node to use for the portal
 */
export function setPortalRootNode(rootNode: HTMLElement | ShadowRoot) {
	console.log("[UIKTS] - setting portal root node", rootNode)
	portalRootNode = rootNode
}

/**
 * Creates a portal root node. If it already exists, it will be returned.
 * @param id - The id of the portal root node
 * @param zIndex - The z-index of the portal root node
 * @param portalParentNode - The node to contain the portal, defaults to document.body
 * @param setAsPortalRootNode - If true, the portal root node will be set as the portal root node, defaults to true
 * @returns The portal root node
 */
export function createPortalRootNode(props?: {
	id?: string
	zIndex?: number
	portalParentNode?: HTMLElement | ShadowRoot
	setAsPortalRootNode?: boolean
}) {
	const {
		id = portalContainerID,
		zIndex = 511, // the atlaskit portal has 510, the hamburger menu has 512
		portalParentNode = document.body,
		setAsPortalRootNode = true,
	} = props ?? {}
	const exists = portalParentNode.querySelector(`#${id}`)
	if (exists) {
		console.log("[UIKTS] - portal root node already exists", exists)
		return exists as HTMLElement
	}
	const portalRootNode = document.createElement("div")
	portalRootNode.setAttribute("id", id)
	portalRootNode.style.setProperty("z-index", zIndex.toString())
	portalRootNode.style.setProperty("position", "absolute")
	portalRootNode.style.setProperty("inset", "0")
	portalRootNode.style.setProperty("pointer-events", "none")
	portalParentNode.appendChild(portalRootNode)
	if (setAsPortalRootNode) {
		setPortalRootNode(portalRootNode)
	}
	return portalRootNode as HTMLElement
}

/**
 * Get the root node to use for the portal
 * @returns The root node to use for the portal
 */
export function getPortalRootNode() {
	return portalRootNode
}

/**
 * Get a portal node for the given insidePortalContainerID, portal rootnode is established on first call if it was not created/set before.
 * @param insidePortalContainerID - The id of the container to get the portal node for
 * @param shadowRoot - The root node to use for the portal, defaults to document.body
 * @returns The portal node
 */
export function getPortal(
	insidePortalContainerID: string,
	overwrittenPortalRootNode?: ShadowRoot | HTMLElement | null,
) {
	if (!insidePortalContainerID) {
		console.error("[UIKTS] - No portal container id provided")
		throw new Error("No portal container id provided")
	}

	let searchRoot = overwrittenPortalRootNode ?? portalRootNode
	if (!searchRoot) {
		portalRootNode = createPortalRootNode()
		searchRoot = portalRootNode
	}

	let insidePortalNode = searchRoot.querySelector(
		`#${insidePortalContainerID}`,
	) as HTMLElement | null

	if (!insidePortalNode) {
		console.log(
			"[UIKTS] - creating element inside portal node with id:",
			insidePortalContainerID,
		)
		insidePortalNode = document.createElement("div")
		insidePortalNode.setAttribute("id", insidePortalContainerID)
		insidePortalNode.style.setProperty("pointer-events", "auto")
		searchRoot.appendChild(insidePortalNode)
	}

	return insidePortalNode
}
