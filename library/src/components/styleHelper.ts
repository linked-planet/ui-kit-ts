import { twJoin } from "tailwind-merge"

export const overlayBaseStyle =
	"bg-surface-overlay relative shadow-overlay border-border border-solid border z-50 rounded overflow-auto max-h-full" /* only-x-auto to allow for horizontal scrolling but do not cut off the outline */

/*const beforeStyles = twJoin(
	"before:pointer-events-none before:z-10 before:content-['BEFORE'] before:absolute before:-inset-[0.5px] before:box-border before:rounded before:border-2 before:border-solid before:border-transparent",
	"data-[invalid=true]:before:border-danger-border aria-invalid:before:border-danger-border",
	"data-[active=true]:before:border-input-border-focused",
	"focus-within:before:border-input-border-focused focus:before:border-input-border-focused",
)

export const inputBaseStyles = twJoin(
	"min-h-9 rounded box-border w-full relative border-[0.88px] border-input-border placeholder:text-text-subtlest placeholder:opacity-100 bg-input focus-within:bg-input-active border-solid focus-within:border-transparent ease-in-out transition duration-200 p-0  ",
	beforeStyles,
	"data-[active=true]:border-transparent",
	"data-[invalid=true]:border-transparent aria-invalid:border-transparent",
	"hover:bg-input-hovered hover:focus-within:bg-input-active focus-within:bg-input-active",
	"data-[disabled=true]:bg-disabled data-[disabled=true]:cursor-not-allowed data-[disabled=true]:border-transparent",
	"disabled:bg-disabled disabled:cursor-not-allowed disabled:border-transparent",
)*/

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
