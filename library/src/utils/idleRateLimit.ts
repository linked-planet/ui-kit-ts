import { useRef } from "react"

/**
 * The idleRateLimitHelper returns a function, which you can call to execute a callback function.
 * However, the callback function will only be executed if the time elapsed since the last call is greater than the specified minimum distance and by using the requestIdleCallback function of the browser.
 * @param minDistanceMS the minimal elapsed time between two calls.
 * @param executeAfter if true, the callback will be executed using a timeout after the minimum distance has passed, to make sure it is executed.
 * @returns a function that takes a callback function as a parameter.
 */
export function idleRateLimitHelper(
	timeoutMS: number | undefined,
	executeAfter = true,
) {
	let lastTime = 0
	let timeoutRunning = 0
	if (timeoutMS !== undefined && timeoutMS < 0) {
		throw new Error("timeoutMS must be a positive number")
	}

	return (cb: (...args: unknown[]) => unknown, ...args: unknown[]) => {
		const now = Date.now()

		if (timeoutMS !== undefined && now - lastTime > timeoutMS) {
			cb(...args)
			lastTime = now
		} else {
			if (timeoutRunning) {
				cancelIdleCallback(timeoutRunning)
			}
			if (executeAfter) {
				timeoutRunning = window.requestIdleCallback(
					() => {
						cb(...args)
						lastTime = Date.now()
					},
					{
						timeout: timeoutMS,
					},
				)
			}
		}
	}
}

/**
 * The idleRateLimitHelper just in a hook:
 * The idleRateLimitHelper returns a function, which you can call to execute a callback function.
 * However, the callback function will only be executed if the time elapsed since the last call is greater than the specified minimum distance.
 * @param minDistanceMS the minimal elapsed time between two calls.
 * @param executeAfter if true, the callback will be executed using a timeout after the minimum distance has passed, to make sure (default: true).
 * @returns a function that takes a callback function as a parameter.
 */
export function useIdleRateLimitHelper(
	minDistanceMS: number,
	executeAfter = true,
) {
	const rateLimitHelperRef = useRef(
		idleRateLimitHelper(minDistanceMS, executeAfter),
	)
	return rateLimitHelperRef.current
}
