import { useEffect, useRef, useState } from "react"

/**
 * The debounceHelper function returns a debounced version of a callback function that will only be
 * executed after a specified delay. If the debounced function is called again before the delay
 * expires, the timer is reset and the callback function will only be executed after the delay.
 * @returns The debounceHelper function returns a new function that takes two parameters: cb (a
 * callback function) and delay (a number).
 */
export function debounceHelper() {
	let timer: number | null = null

	return (cb: () => void, delay: number) => {
		if (timer) {
			clearTimeout(timer)
		}

		if (delay <= 0) {
			throw new Error("delay must be positive and above 0")
		}

		timer = setTimeout(() => {
			cb()
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
