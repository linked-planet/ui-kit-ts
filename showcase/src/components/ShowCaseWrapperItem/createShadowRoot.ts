export function createShowcaseShadowRoot(element: HTMLElement) {
	const shadowRoot = element.attachShadow({ mode: "open" })
	// copy the CSS from the head to the shadow root
	const css = document.head.querySelectorAll("link[rel='stylesheet']")
	css.forEach((style) => {
		const cpy = style.cloneNode(true) as HTMLLinkElement
		shadowRoot.appendChild(cpy)
	})

	// copy the vite dev styles to the shadow root
	const viteDevStyles = document.head.querySelectorAll(
		"style[data-vite-dev-id]",
	)
	viteDevStyles.forEach((style) => {
		const cpy = style.cloneNode(true) as HTMLStyleElement
		shadowRoot.appendChild(cpy)
	})

	return shadowRoot
}
