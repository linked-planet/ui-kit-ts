import type { HamburgerMenuProps } from "../layouting/HamburgerMenu"

export const hamburgerMenuPortalContainerID = "uikts-menu-portal-container"

export function getHamburgerMenuPortal(props?: HamburgerMenuProps["portal"]) {
	const root = props?.portalRoot ?? document.body

	let portalNode: HTMLElement | null = root.querySelector(
		`#${props?.portalId ?? hamburgerMenuPortalContainerID}`,
	) as HTMLElement | null

	if (!portalNode) {
		// Create element in the correct context
		portalNode = props?.portalRoot
			? props.portalRoot.ownerDocument.createElement("div")
			: document.createElement("div")

		portalNode.setAttribute("id", hamburgerMenuPortalContainerID)
		portalNode.style.setProperty(
			"z-index",
			props?.zIndex?.toString() ?? "512",
		)
		portalNode.style.setProperty("position", "absolute")
		portalNode.style.setProperty("inset", "0")
		portalNode.style.setProperty("pointer-events", "none")
		props?.portalClassName &&
			portalNode.classList.add(props.portalClassName)

		// Append to the correct root
		root.appendChild(portalNode)

		console.log("[UIKTS] - created hamburger menu portal", portalNode)
	}

	return portalNode
}
