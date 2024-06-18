import { twJoin } from "tailwind-merge"

export const overlayBaseStyle =
	"bg-surface-overlay relative shadow-overlay border-border border-solid border z-50 rounded overflow-auto max-h-full" /* only-x-auto to allow for horizontal scrolling but do not cut off the outline */

export const inputBaseStyle = twJoin(
	"min-h-8 rounded box-border w-full relative border border-input-border ease-in-out transition duration-200 p-0  ",
	"before:pointer-events-none before:z-10 before:content-[''] before:absolute before:-inset-[0.5px] before:box-border before:rounded",
	"focus-within:before:border-input-border-focused focus-within:before:border-2",
	"data-[active=true]:before:border-2 data-[active=true]:before:border-input-border-focused",
)
