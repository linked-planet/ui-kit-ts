import { useCallback } from "react"
import { proxy, useSnapshot } from "valtio"

type SideNavigationStore = {
	path: string[]
	transitioning: null | string | true // true in case of a forward transition, the popped element in case of a backward transition where the element gets removed from the path
}

const store = proxy<Record<string, SideNavigationStore>>({})

export function useSideNavigationStore(sideNavStoreIdent: string) {
	if (!store[sideNavStoreIdent]) {
		store[sideNavStoreIdent] = proxy<SideNavigationStore>({
			path: [],
			transitioning: null,
		})
	}

	const path = useSnapshot(store[sideNavStoreIdent])
	const setPath = useCallback(
		(path: string[]) =>
			store[sideNavStoreIdent].path.splice(
				0,
				Number.POSITIVE_INFINITY,
				...path,
			),
		[sideNavStoreIdent],
	)

	const getPathElement = useCallback(
		(level: number) => store[sideNavStoreIdent].path[level],
		[sideNavStoreIdent],
	)

	const pushPathElement = useCallback(
		(pathEle: string) => store[sideNavStoreIdent].path.push(pathEle),
		[sideNavStoreIdent],
	)
	const popPathElement = useCallback(
		() => store[sideNavStoreIdent].path.pop(),
		[sideNavStoreIdent],
	)

	const setTransitioning = useCallback(
		(transitioning: string | null | true) => {
			store[sideNavStoreIdent].transitioning = transitioning
		},
		[sideNavStoreIdent],
	)

	const getCurrentPathElement = useCallback(
		() =>
			store[sideNavStoreIdent].path[
				store[sideNavStoreIdent].path.length - 1
			],
		[sideNavStoreIdent],
	)

	const transitioning = useSnapshot(store[sideNavStoreIdent]).transitioning

	return {
		path,
		setPath,
		getPathElement,
		pushPathElement,
		popPathElement,
		getCurrentPathElement,
		setTransitioning,
		transitioning,
	}
}
