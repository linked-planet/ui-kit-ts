import { useState } from "react"
import { twJoin, twMerge } from "tailwind-merge"
import { focusVisibleOutlineStyles } from "./styleHelper"

/**
 * Invisible jump link menu that becomes visible when focused via keyboard navigation.
 * Provides quick navigation to main page sections for accessibility.
 */
export function InvisibleJumpLinkMenu({
	jumpLinks,
	className,
	ulClassName,
	liClassName,
	aClassName,
	navStyle,
	aStyle,
	ulStyle,
	liStyle,
	visible = false,
	id = "jump-link-menu",
}: {
	jumpLinks: {
		href: string
		label: string
		ariaLabel?: string
		onClick?: () => void
	}[]
	className?: string
	ulClassName?: string
	liClassName?: string
	aClassName?: string
	aStyle?: React.CSSProperties
	navStyle?: React.CSSProperties
	ulStyle?: React.CSSProperties
	liStyle?: React.CSSProperties
	visible?: boolean
	id?: string
}) {
	const [isFocused, setIsFocused] = useState(visible)

	return (
		<nav
			className={twMerge(
				"fixed top-0 left-1/4 h-fit z-1 w-auto transition-transform duration-200 data-[focused=false]:-translate-y-full",
				className,
			)}
			data-focused={isFocused}
			style={navStyle}
			aria-label="Sprunglinks"
			id={id}
		>
			<ul
				className={twMerge(
					"flex flex-col bg-surface-overlay border-2 border-border border-solid rounded shadow-lg gap-1 list-none p-0",
					ulClassName,
				)}
				style={ulStyle}
			>
				{jumpLinks && jumpLinks.length > 0 ? (
					jumpLinks.map((link) => (
						<li
							key={link.href}
							className={liClassName}
							style={liStyle}
						>
							<a
								href={link.href}
								className={twMerge(
									twJoin(
										"block py-2 text-sm font-medium text-text hover:bg-surface-overlay-hovered active:bg-surface-overlay-pressed p-2 no-underline hover:text-text hover:no-underline",
										focusVisibleOutlineStyles,
										"focus-visible:outline-offset-0 focus-visible:bg-surface-overlay-hovered",
										"border-l-2 border-l-transparent border-solid border-transparent hover:border-l-selected-bold",
									),
									aClassName,
								)}
								aria-label={link.ariaLabel ?? link.label}
								style={aStyle}
								onFocus={() => setIsFocused(true)}
								onBlur={(e) => {
									// Only hide if focus is moving outside the nav
									if (
										!e.currentTarget
											.closest("nav")
											?.contains(e.relatedTarget as Node)
									) {
										setIsFocused(false)
									}
								}}
								onClick={(e) => {
									e.preventDefault()
									e.stopPropagation()
									if (link.onClick) {
										link.onClick()
									} else {
										document
											.getElementById(link.href.slice(1))
											?.focus()
									}
								}}
								onKeyUp={(e) => {
									if (e.key === "Enter") {
										e.preventDefault()
										e.stopPropagation()
										document
											.getElementById(link.href.slice(1))
											?.focus()
									}
								}}
								tabIndex={0}
							>
								{link.label}
							</a>
						</li>
					))
				) : (
					<li className="p-2 text-sm text-text-subtle">
						No jump links
					</li>
				)}
			</ul>
		</nav>
	)
}
