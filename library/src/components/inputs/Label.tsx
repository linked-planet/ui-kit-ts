import type { ComponentPropsWithoutRef } from "react"
import { twJoin, twMerge } from "tailwind-merge"

const labelNormalStyles =
	"text-text-subtlest block text-sm pb-1 pt-3 font-semibold"
const requiredStyles =
	"data-[required=true]:after:content-['*'] data-[required=true]:after:text-danger-bold data-[required=true]:after:ml-0.5"

const labelStyles = twJoin(labelNormalStyles, requiredStyles)
export function Label({
	required = false,
	className,
	htmlFor,
	children,
	...props
}: ComponentPropsWithoutRef<"label"> & { required?: boolean }) {
	return (
		<label
			htmlFor={htmlFor}
			data-required={required}
			className={twMerge(labelStyles, className)}
			{...props}
		>
			{children}
		</label>
	)
}
