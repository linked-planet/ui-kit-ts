import { useEffect, useState } from "react"

/**
 * Sets up device detection event listeners and returns cleanup function
 * @param callback Function to call when device properties might have changed
 * @returns Cleanup function to remove all event listeners
 */
function setupDeviceDetectionListeners(callback: () => void): () => void {
	// Media queries for breakpoint detection
	const mobileQuery = window.matchMedia("(max-width: 768px)")
	const tabletQuery = window.matchMedia("(max-width: 1024px)")

	// Listen to resize and orientation changes
	window.addEventListener("resize", callback)
	window.addEventListener("orientationchange", callback)

	// Listen to media query changes for more responsive breakpoint detection
	mobileQuery.addEventListener("change", callback)
	tabletQuery.addEventListener("change", callback)

	// Return cleanup function
	return () => {
		window.removeEventListener("resize", callback)
		window.removeEventListener("orientationchange", callback)
		mobileQuery.removeEventListener("change", callback)
		tabletQuery.removeEventListener("change", callback)
	}
}

/**
 * Device type detection with proper categorization
 */
export type DeviceType = "mobile" | "tablet" | "desktop"

/**
 * Detects the type of device being used
 * @returns DeviceType indicating mobile phone, tablet, or desktop
 */
export function getDeviceType(): DeviceType {
	if (typeof window === "undefined") return "desktop"

	const userAgent = navigator.userAgent.toLowerCase()
	const screenWidth = window.innerWidth
	const screenHeight = window.innerHeight

	// Check for touch capability
	const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0

	// Check for mobile user agent patterns
	const isMobileUA = /mobile|android|iphone|blackberry|windows phone/.test(
		userAgent,
	)
	const isTabletUA = /ipad|tablet/.test(userAgent)

	// Screen size thresholds (in pixels)
	const MOBILE_MAX_WIDTH = 768
	const TABLET_MAX_WIDTH = 1024

	// Enhanced detection for dev tools simulation:
	// If screen dimensions suggest mobile/tablet but user agent doesn't match,
	// prioritize screen size (common in browser dev tools)
	const isNarrowScreen = screenWidth <= MOBILE_MAX_WIDTH
	const isMediumScreen =
		screenWidth > MOBILE_MAX_WIDTH && screenWidth <= TABLET_MAX_WIDTH

	// Device detection logic - balance user agent with screen size
	if (isMobileUA) {
		return "mobile"
	}

	if (isTabletUA) {
		return "tablet"
	}

	// For browser environments (likely dev tools simulation),
	// give more weight to screen size when user agent is generic
	const isGenericUA =
		/chrome|firefox|safari|edge/.test(userAgent) &&
		!isMobileUA &&
		!isTabletUA

	if (isGenericUA || hasTouch) {
		if (isNarrowScreen) {
			return "mobile"
		}
		if (isMediumScreen) {
			return "tablet"
		}
		// Wide screen with touch could still be tablet (Surface Pro, etc.)
		if (hasTouch && screenWidth <= 1366) {
			return "tablet"
		}
		return "desktop"
	}

	// Legacy fallback for non-touch devices
	if (isNarrowScreen) {
		return "mobile"
	}
	if (isMediumScreen) {
		return "tablet"
	}

	return "desktop"
}

/**
 * Hook to get the device type, uses a resize handler to update the state
 * @returns mobile, tablet or desktop
 */
export function useDeviceType(): DeviceType {
	const [deviceType, setDeviceType] = useState(getDeviceType())

	useEffect(() => {
		const updateDeviceType = () => {
			setDeviceType(getDeviceType())
		}

		const cleanup = setupDeviceDetectionListeners(updateDeviceType)

		return cleanup
	}, [])

	return deviceType
}

/**
 * Simplified mobile detection (phones + tablets)
 * @returns true if mobile device (phone or tablet), false otherwise
 */
export function isMobileDevice(): boolean {
	const deviceType = getDeviceType()
	return deviceType === "mobile" || deviceType === "tablet"
}

/**
 * Hook to get if the device is a mobile device, uses a resize handler to update the state
 * @returns true if mobile device (phone or tablet), false otherwise
 */
export function useIsMobileDevice(): boolean {
	const [deviceIsMobileDevice, setDeviceIsMobileDevice] = useState(
		isMobileDevice(),
	)

	useEffect(() => {
		const updateMobileDevice = () => {
			setDeviceIsMobileDevice(isMobileDevice())
		}

		const cleanup = setupDeviceDetectionListeners(updateMobileDevice)

		return cleanup
	}, [])

	return deviceIsMobileDevice
}

/**
 * Detects only mobile phones (excludes tablets)
 * @returns true if mobile phone, false otherwise
 */
export function isMobilePhone(): boolean {
	return getDeviceType() === "mobile"
}

/**
 * Hook to get if the device is a mobile phone, uses a resize handler to update the state
 * @returns true if mobile phone, false otherwise
 */
export function useIsMobilePhone(): boolean {
	const [deviceIsMobilePhone, setDeviceIsMobilePhone] = useState(
		isMobilePhone(),
	)

	useEffect(() => {
		const updateMobilePhone = () => {
			setDeviceIsMobilePhone(isMobilePhone())
		}

		const cleanup = setupDeviceDetectionListeners(updateMobilePhone)

		return cleanup
	}, [])

	return deviceIsMobilePhone
}

/**
 * Detects tablets specifically
 * @returns true if tablet, false otherwise
 */
export function isTablet(): boolean {
	return getDeviceType() === "tablet"
}

/**
 * Hook to get if the device is a tablet, uses a resize handler to update the state
 * @returns true if tablet, false otherwise
 */
export function useIsTablet(): boolean {
	const [deviceIsTablet, setDeviceIsTablet] = useState(isTablet())

	useEffect(() => {
		const updateTablet = () => {
			setDeviceIsTablet(isTablet())
		}

		const cleanup = setupDeviceDetectionListeners(updateTablet)

		return cleanup
	}, [])

	return deviceIsTablet
}
