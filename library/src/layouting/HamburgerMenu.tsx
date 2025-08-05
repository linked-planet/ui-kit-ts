import { Menu, X } from "lucide-react"
import type React from "react"
import { type ReactNode, useCallback, useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { twMerge } from "tailwind-merge"
import { Button, type ButtonProps } from "../components"
import { getHamburgerMenuPortal } from "../utils"

export interface HamburgerMenuProps {
	/** The content to display inside the hamburger menu */
	children: React.ReactNode
	/** Additional CSS classes for the hamburger button */
	buttonClassName?: string
	/** Additional CSS classes for the close button */
	closeButtonClassName?: string
	/** Additional CSS classes for the menu overlay */
	menuClassName?: string
	/** Whether the menu is initially open */
	defaultOpen?: boolean
	/** Callback when the menu open state changes */
	onOpenChange?: (open: boolean) => void
	/** Whether to close the menu when clicking outside */
	closeOnOutsideClick?: boolean
	/** Whether to close the menu when pressing Escape key */
	closeOnEscape?: boolean
	/** Custom hamburger icon component */
	hamburgerIcon?: ReactNode
	/** Custom close icon component */
	closeIcon?: ReactNode
	/** The appearance of the hamburger button */
	buttonAppearance?: ButtonProps["appearance"]
	/** The appearance of the close button */
	closeButtonAppearance?: ButtonProps["appearance"]
	/** The aria-label for the hamburger button */
	ariaLabel?: string
	/** The aria-label for the close button */
	ariaLabelClose?: string
	/** The aria-label for the open button */
	ariaLabelOpen?: string

	portal?: {
		/** Additional CSS classes for the menu portal */
		portalClassName?: string
		/** Callback when the menu portal is created */
		portalCreatedCb?: (portal: HTMLElement) => void
		/** The root element to append the menu portal to
		 * @default document.body
		 */
		portalRoot?: ShadowRoot | null | HTMLElement
		/**
		 * The id of the menu portal
		 * @default "uikts-menu-portal-container"
		 */
		portalId?: string

		/**
		 * The z-index of the menu portal
		 * @default 511
		 */
		zIndex?: number
	}
}

/**
 * A fullscreen hamburger menu component that displays content in an overlay when the hamburger button is clicked.
 *
 * @example
 * ```tsx
 * <HamburgerMenu>
 *   <nav className="space-y-4">
 *     <a href="/">Home</a>
 *     <a href="/about">About</a>
 *     <a href="/contact">Contact</a>
 *   </nav>
 * </HamburgerMenu>
 * ```
 */
export function HamburgerMenu({
	children,
	buttonClassName,
	closeButtonClassName,
	menuClassName,
	defaultOpen = false,
	onOpenChange,
	closeOnOutsideClick = true,
	closeOnEscape = true,
	hamburgerIcon: HamburgerIcon = <Menu className="size-8" />,
	closeIcon: CloseIcon = <X className="size-6" />,
	buttonAppearance = "default",
	closeButtonAppearance = "default",
	ariaLabel = "Navigation menu",
	ariaLabelClose = "Close menu",
	ariaLabelOpen = "Open menu",
	portal,
}: HamburgerMenuProps) {
	const [isOpen, setIsOpen] = useState(defaultOpen)
	const menuPortal = getHamburgerMenuPortal(portal)

	const handleToggle = useCallback(() => {
		const newOpen = !isOpen
		setIsOpen(newOpen)
		onOpenChange?.(newOpen)
	}, [isOpen, onOpenChange])

	const handleClose = useCallback(() => {
		setIsOpen(false)
		onOpenChange?.(false)
	}, [onOpenChange])

	const handleOverlayClick = useCallback(
		(event: React.MouseEvent) => {
			if (closeOnOutsideClick && event.target === event.currentTarget) {
				handleClose()
			}
		},
		[closeOnOutsideClick, handleClose],
	)

	const handleOverlayKeyDown = useCallback(
		(event: React.KeyboardEvent) => {
			if (closeOnOutsideClick && event.key === "Escape") {
				handleClose()
			}
		},
		[closeOnOutsideClick, handleClose],
	)

	// Handle escape key
	useEffect(() => {
		if (!closeOnEscape || !isOpen) return

		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				handleClose()
			}
		}

		document.addEventListener("keydown", handleEscape)
		return () => document.removeEventListener("keydown", handleEscape)
	}, [closeOnEscape, isOpen, handleClose])

	// Prevent body scroll when menu is open
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden"
		} else {
			document.body.style.overflow = ""
		}

		return () => {
			document.body.style.overflow = ""
		}
	}, [isOpen])

	const menuPortalContent =
		isOpen && menuPortal
			? createPortal(
					<section
						className={twMerge(
							"absolute pointer-events-auto inset-0 z-100 transition-opacity duration-300 backdrop-blur-sm bg-surface-overlay p-8",
							menuClassName,
						)}
						onClick={handleOverlayClick}
						onKeyDown={handleOverlayKeyDown}
						role="dialog"
						aria-modal="true"
						aria-label={ariaLabel}
						tabIndex={-1}
					>
						{/* Close Button */}
						<Button
							type="button"
							onClick={handleClose}
							aria-label={ariaLabelClose}
							appearance={closeButtonAppearance}
							className={twMerge(
								"absolute top-4 right-4 p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 z-10",
								closeButtonClassName,
							)}
						>
							{CloseIcon}
						</Button>

						{children}
					</section>,
					menuPortal,
				)
			: null

	return (
		<>
			{/* Hamburger Button */}
			<Button
				type="button"
				onClick={handleToggle}
				appearance={buttonAppearance}
				className={twMerge(
					"flex items-center justify-center p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
					buttonClassName,
				)}
				aria-label={isOpen ? ariaLabelClose : ariaLabelOpen}
				aria-expanded={isOpen}
			>
				{typeof HamburgerIcon === "string" ? (
					<span className="text-2xl">{HamburgerIcon}</span>
				) : (
					HamburgerIcon
				)}
			</Button>

			{/* Fullscreen Menu Overlay */}
			{menuPortalContent}
		</>
	)
}
