const tabbableSelector = [
	"button:not([disabled])",
	"[href]",
	"input:not([disabled])",
	"select:not([disabled])",
	"textarea:not([disabled])",
	'[tabindex]:not([tabindex="-1"]):not([disabled])',
	'[contenteditable="true"]',
].join(", ")

export function getTabbableElements(): HTMLElement[] {
	return Array.from(
		document.querySelectorAll(tabbableSelector),
	) as HTMLElement[]
}

export function getPreviousTabbableElement(
	currentElement: HTMLElement,
): HTMLElement | null {
	const tabbableElements = getTabbableElements()
	const currentIndex = tabbableElements.indexOf(currentElement)

	return currentIndex > 0 ? tabbableElements[currentIndex - 1] : null
}

export function getNextTabbableElement(
	currentElement: HTMLElement,
): HTMLElement | null {
	const tabbableElements = getTabbableElements()
	const currentIndex = tabbableElements.indexOf(currentElement)

	return currentIndex >= 0 && currentIndex < tabbableElements.length - 1
		? tabbableElements[currentIndex + 1]
		: null
}
