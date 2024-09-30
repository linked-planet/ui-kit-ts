import { useCallback } from "react"
import { proxy, useSnapshot } from "valtio"

// biome-ignore lint/suspicious/noExplicitAny: we don't know which type of value is stored in the proxy
const proxies: Record<string, { value: any }> = {}

export function useGlobalState<T>(
	typeName: string,
	initialValue: T,
): readonly [T, (value: T) => void] {
	if (!proxies[typeName]) {
		proxies[typeName] = proxy<{ value: T }>({ value: initialValue })
	}
	const store = proxies[typeName]

	const snapshot = useSnapshot(store)

	const setter = useCallback(
		(value: T) => {
			store.value = value
		},
		[store],
	)

	const getter = snapshot.value as T

	return [getter, setter] as const
}
