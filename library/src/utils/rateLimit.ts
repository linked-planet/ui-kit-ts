import { useRef } from "react"

/**
 * The rateLimitHelper returns a function, which you can call to execute a callback function.
 * However, the callback function will only be executed if the time elapsed since the last call is greater than the specified minimum distance.
 * @param minDistanceMS the minimal elapsed time between two calls.
 * @param executeAfter if true, the callback will be executed using a timeout after the minimum distance has passed, to make sure it is executed.
 * @returns a function that takes a callback function as a parameter.
 */
export function rateLimitHelper(minDistanceMS: number, executeAfter = true) {
	let lastTime = 0
	let timeoutRunning = 0
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
		} else {
			if (timeoutRunning) {
				clearTimeout(timeoutRunning)
			}
			if (executeAfter) {
				timeoutRunning = window.setTimeout(() => {
					cb(...args)
					lastTime = Date.now()
				}, minDistanceMS)
			}
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
export function useRateLimitHelper(minDistanceMS: number, executeAfter = true) {
	const rateLimitHelperRef = useRef(
		rateLimitHelper(minDistanceMS, executeAfter),
	)
	return rateLimitHelperRef.current
}
