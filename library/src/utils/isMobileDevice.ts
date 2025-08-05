import { useEffect, useState } from "react"

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

	// Device detection logic - prioritize user agent over screen size
	if (isMobileUA) {
		return "mobile"
	}

	if (isTabletUA) {
		return "tablet"
	}

	// Fallback to screen size + touch detection when user agent is inconclusive
	if (hasTouch) {
		if (screenWidth <= MOBILE_MAX_WIDTH) {
			return "mobile"
		}
		if (screenWidth <= TABLET_MAX_WIDTH) {
			return "tablet"
		}
		return "desktop"
	}

	// No touch capability = desktop/laptop
	return "desktop"
}

/**
 * Hook to get the device type, uses a resize handler to update the state
 * @returns mobile, tablet or desktop
 */
export function useDeviceType(): DeviceType {
	const [deviceType, setDeviceType] = useState(getDeviceType())

	useEffect(() => {
		const handleResize = () => {
			setDeviceType(getDeviceType())
		}
		window.addEventListener("resize", handleResize)
		return () => window.removeEventListener("resize", handleResize)
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
		const handleResize = () => {
			setDeviceIsMobileDevice(isMobileDevice())
		}
		window.addEventListener("resize", handleResize)
		return () => window.removeEventListener("resize", handleResize)
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
		const handleResize = () => {
			setDeviceIsMobilePhone(isMobilePhone())
		}
		window.addEventListener("resize", handleResize)
		return () => window.removeEventListener("resize", handleResize)
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
		const handleResize = () => {
			setDeviceIsTablet(isTablet())
		}
		window.addEventListener("resize", handleResize)
		return () => window.removeEventListener("resize", handleResize)
	}, [])

	return deviceIsTablet
}
