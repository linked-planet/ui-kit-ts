import { useRef } from "react"

/**
 * The debounceHelper function returns a debounced version of a callback function that will only be
 * executed after a specified delay. If the debounced function is called again before the delay
 * expires, the timer is reset and the callback function will only be executed after the delay.
 * @returns The debounceHelper function returns a new function that takes two parameters: cb (a
 * callback function) and delay (a number).
 */
export function debounceHelper() {
	let timer: number | null = null

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return (cb: (...args: any[]) => void, delay: number, ...args: any[]) => {
		if (timer) {
			clearTimeout(timer)
		}

		if (delay <= 0) {
			throw new Error("delay must be positive and above 0")
		}

		timer = window.setTimeout(() => {
			cb(...args)
			timer = null
		}, delay)
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
export function useDebounceHelper() {
	const debounceHelperRef = useRef(debounceHelper())
	return debounceHelperRef.current
}
