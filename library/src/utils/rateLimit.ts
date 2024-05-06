import { useRef } from "react"

/**
 * The rateLimitHelper returns a function, which you can call to execute a callback function.
 * However, the callback function will only be executed if the time elapsed since the last call is greater than the specified minimum distance.
 * @param minDistanceMS the minimal elapsed time between two calls.
 * @returns a function that takes a callback function as a parameter.
 */
export function rateLimitHelper(minDistanceMS: number) {
	let lastTime = 0
	if (minDistanceMS <= 0) {
		throw new Error("minDistanceMS must be positive and above 0")
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	return (cb: (...args: any[]) => any, ...args: any[]) => {
		const now = Date.now()

		if (now - lastTime > minDistanceMS) {
			cb(...args)
			lastTime = now
		}
	}
}

/**
 * The rateLimitHelper just in a hook:
 * The rateLimitHelper returns a function, which you can call to execute a callback function.
 * However, the callback function will only be executed if the time elapsed since the last call is greater than the specified minimum distance.
 * @param minDistanceMS the minimal elapsed time between two calls.
 * @returns a function that takes a callback function as a parameter.
 */
export function useRateLimitHelper(minDistanceMS: number) {
	const rateLimitHelperRef = useRef(rateLimitHelper(minDistanceMS))
	return rateLimitHelperRef.current
}
