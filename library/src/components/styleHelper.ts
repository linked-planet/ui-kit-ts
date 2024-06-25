import { twJoin } from "tailwind-merge"

export const overlayBaseStyle =
	"bg-surface-overlay relative shadow-overlay border-border border-solid border z-50 rounded overflow-auto max-h-full" /* only-x-auto to allow for horizontal scrolling but do not cut off the outline */

export const inputBaseStyle = twJoin(
	"min-h-9 rounded box-border w-full relative border-[0.88px] border-input-border bg-input focus-within:bg-input-active border-solid focus-within:border-transparent data-[active=true]:border-transparent data-[invalid=true]:border-transparent ease-in-out transition duration-200 p-0  ",
	"before:pointer-events-none before:z-10 before:content-[''] before:absolute before:-inset-[0.5px] before:box-border before:rounded before:border-2 before:border-solid before:border-transparent",
	"focus-within:before:border-input-border-focused",
	"data-[active=true]:before:border-input-border-focused",
	"data-[invalid=true]:before:border-danger-border",
)
