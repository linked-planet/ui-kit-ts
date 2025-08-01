import { useRef } from "react"

/**
 * The debounceHelper function returns a debounced version of a callback function that will only be
 * executed after a specified delay. If the debounced function is called again before the delay
 * expires, the timer is reset and the callback function will only be executed after the delay.
 * @returns The debounceHelper function returns a new function that takes two parameters: cb (a
 * callback function) and delay (a number).
 */
export function debounceHelper(delayMS = 300) {
	let timer: number | null = null

	return (cb: (...args: unknown[]) => unknown, ...args: unknown[]) => {
		if (timer) {
			clearTimeout(timer)
		}

		if (delayMS < 0) {
			throw new Error("delay must be a positive number")
		}

		timer = window.setTimeout(() => {
			cb(...args)
			timer = null
		}, delayMS)
	}
}

/**
 * The debounce helper, but in a hook.
 * he debounceHelper function returns a debounced version of a callback function that will only be
 * executed after a specified delay. If the debounced function is called again before the delay
 * expires, the timer is reset and the callback function will only be executed after the delay.
 * @returns The debounceHelper function returns a new function that takes two parameters: cb (a
 * callback function) and delay (a number).
 */
export function useDebounceHelper(delayMS = 300) {
	const debounceHelperRef = useRef(debounceHelper(delayMS))
	return debounceHelperRef.current
}
