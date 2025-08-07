import { useLayoutEffect, useState } from "react"
import { getPortal, getPortalRootNode } from "./getPortal"

/**
 * Hook to get a portal container
 * @param usePortal - Whether to use the portal, if false, the portal will not be used, if true, the portal will be used, if a ShadowRoot, the portal will be used in the shadow root
 * @param containerID - The id of the container to get the portal node for
 * @param parentElement - The parent element to get the portal node for
 * @returns The portal container
 */
export default function usePortalContainer(
	usePortal: boolean | ShadowRoot | HTMLElement,
	containerID: string,
	parentElement?: HTMLElement | HTMLDivElement | HTMLButtonElement | null,
) {
	const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(
		null,
	)

	useLayoutEffect(() => {
		if (!usePortal) {
			console.log("[UIKTS] - usePortal is false", usePortal)
			return
		}
		if (
			usePortal instanceof ShadowRoot ||
			usePortal instanceof HTMLElement
		) {
			console.log("[UIKTS] - usePortal is a ShadowRoot", usePortal)
			setPortalContainer(getPortal(containerID, usePortal))
			return
		}

		if (getPortal(containerID).getRootNode() instanceof ShadowRoot) {
			// if the normal portal is a shadow root, we use this one
			setPortalContainer(getPortal(containerID))
			return
		}

		// else we plug the portal into the nearest shadow root, if there is one
		const nearestShadowRoot = parentElement?.getRootNode() as
			| Document
			| ShadowRoot

		if (nearestShadowRoot instanceof ShadowRoot) {
			console.log(
				"usePortal nearestShadowRoot is a ShadowRoot",
				nearestShadowRoot,
			)
			setPortalContainer(getPortal(containerID, nearestShadowRoot))
			return
		}

		// else we use the normal portal
		setPortalContainer(getPortal(containerID))
	}, [usePortal, containerID, parentElement])

	return portalContainer
}
