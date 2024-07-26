import { twJoin } from "tailwind-merge"

export const overlayBaseStyle =
	"bg-surface-overlay relative shadow-overlay border-border border-solid border z-50 rounded overflow-auto max-h-full" /* only-x-auto to allow for horizontal scrolling but do not cut off the outline */

const shadowStyles = twJoin(
	"shadow-borderstyle outline-none",
	"aria-invalid:shadow-danger-border",
	"focus-within:shadow-input-border-focused focus:shadow-input-border-focused",
)
export const inputBaseStyles = twJoin(
	"min-h-9 rounded box-border w-full relative border border-input-border placeholder:text-text-subtlest placeholder:opacity-100 bg-input focus-within:bg-input-active border-solid focus-within:border-input-border-focused ease-in-out transition duration-200 p-0  ",
	"aria-invalid:border-danger-border",
	"hover:bg-input-hovered hover:focus-within:bg-input-active focus-within:bg-input-active",
	"disabled:bg-disabled disabled:cursor-not-allowed disabled:border-transparent",
	shadowStyles,
)
