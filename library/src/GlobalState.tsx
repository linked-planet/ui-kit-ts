import {useCallback} from "react";
import {proxy, useSnapshot} from "valtio";

const proxies: Record<string, any> = {}

export function useGlobalState<T>(
	typeName: string,
	initialValue: T,
): readonly [T, (value: T) => void] {
	if (!proxies.hasOwnProperty(typeName)) {
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
	const getter = snapshot.value

	return [getter, setter] as const
}
