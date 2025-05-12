import { useLayoutEffect, useState } from "react"
import { getPortal } from "./getPortal"

export default function usePortalContainer(
	usePortal: boolean | ShadowRoot,
	containerID: string,
	parentElement?: HTMLElement | HTMLDivElement | HTMLButtonElement | null,
) {
	const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(
		null,
	)

	useLayoutEffect(() => {
		if (!usePortal) {
			console.log("usePortal is false", usePortal)
			return
		}
		if (usePortal instanceof ShadowRoot) {
			console.log("usePortal is a ShadowRoot", usePortal)
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
