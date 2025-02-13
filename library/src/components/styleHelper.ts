import { twJoin } from "tailwind-merge"

export const overlayBaseStyle =
	"bg-surface-overlay relative shadow-overlay border-border border-solid border z-50 rounded-xs overflow-auto max-h-full" /* only-x-auto to allow for horizontal scrolling but do not cut off the outline */

const shadowStyles = twJoin(
	"disabled:shadow-none outline-hidden",
	"aria-invalid:shadow-danger-border aria-invalid:border-danger-border aria-invalid:focus-within:shadow-danger-border-focused",
	"focus:shadow-borderstyle focus-within:shadow-input-border-focused",
)
export const inputBaseStyles = twJoin(
	"min-h-9 rounded-sm box-border w-full relative bg-input focus-within:bg-input-active ease-in-out transition duration-200 p-0",
	"border border-input-border border-solid focus-within:border-input-border-focused",
	"placeholder:text-text-subtlest placeholder:opacity-100",
	"aria-invalid:border-danger-border",
	"hover:bg-input-hovered hover:focus-within:bg-input-active focus-within:bg-input-active",
	"disabled:bg-disabled disabled:cursor-not-allowed disabled:border-transparent",
	shadowStyles,
)
