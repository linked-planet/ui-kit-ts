import { useCallback } from "react"
import { proxy, useSnapshot } from "valtio"

type SideNavigationStore = {
	path: (string | undefined)[]
}

const store = proxy<Record<string, SideNavigationStore>>({})

export function useSideNavigationStore(sideNavStoreIdent: string) {
	if (!store[sideNavStoreIdent]) {
		store[sideNavStoreIdent] = {
			path: [],
		}
	}

	const path = useSnapshot(store[sideNavStoreIdent])
	console.info(
		"SideNavigationStore -",
		sideNavStoreIdent,
		path.path.map((e) => e),
	)

	const setPathElement = useCallback(
		(element: string | undefined, level: number) => {
			if (
				element === undefined &&
				level === store[sideNavStoreIdent].path.length - 1
			) {
				store[sideNavStoreIdent].path.pop()
				return
			}
			store[sideNavStoreIdent].path.splice(level, 1, element)
		},
		[sideNavStoreIdent],
	)

	const setPath = useCallback(
		(path: (string | undefined)[]) =>
			store[sideNavStoreIdent].path.splice(0, path.length, ...path),
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

	const getCurrentPathElement = useCallback(
		() =>
			store[sideNavStoreIdent].path[
				store[sideNavStoreIdent].path.length - 1
			],
		[sideNavStoreIdent],
	)

	return {
		path,
		setPath,
		setPathElement,
		getPathElement,
		pushPathElement,
		popPathElement,
		getCurrentPathElement,
	}
}
