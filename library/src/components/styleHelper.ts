import { twJoin } from "tailwind-merge"

export const overlayBaseStyle =
	"bg-surface-overlay relative shadow-overlay border-border border-solid border z-50 rounded-xs overflow-auto max-h-full" /* only-x-auto to allow for horizontal scrolling but do not cut off the outline */

const shadowStyles = twJoin(
	"disabled:shadow-none outline-hidden disabled:ring-0",
	"aria-invalid:border-danger-border aria-invalid:focus-within:ring-danger-border-focused",
	"focus:ring focus-within:ring focus:ring-input-border-focused focus-within:ring-input-border-focused aria-invalid:focus:ring-danger-border aria-invalid:focus-within:ring-danger-border",
)
export const inputBaseStyles = twJoin(
	"min-h-9 rounded-sm box-border w-full relative bg-input focus-within:bg-input-active ease-in-out transition duration-200 p-0",
	"border border-input-border border-solid focus-within:border-input-border-focused",
	"placeholder:text-text-subtlest placeholder:opacity-100",
	"aria-invalid:border-danger-border invalid:border-danger-border",
	"hover:bg-input-hovered hover:focus-within:bg-input-active focus-within:bg-input-active",
	"disabled:bg-disabled disabled:cursor-not-allowed disabled:border-transparent",
	shadowStyles,
)
