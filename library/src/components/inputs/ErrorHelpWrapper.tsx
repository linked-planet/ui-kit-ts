import type React from "react"
import { useEffect } from "react"
import { forwardRef, useRef } from "react"
import { twMerge } from "tailwind-merge"

export type ErrorHelpWrapperProps = {
	errorMessage?: React.ReactNode
	helpMessage?: React.ReactNode
	errorMessageClassName?: string
	helpMessageClassName?: string
	errorMessageStyle?: React.CSSProperties
	helpMessageStyle?: React.CSSProperties
	className?: string
	style?: React.CSSProperties
	"aria-invalid"?: boolean | "false" | "true" | "grammar" | "spelling"
}

export const SlidingErrorMessage = forwardRef(
	(
		{
			children,
			invalid,
			"aria-invalid": ariaInvalid,
			className,
			style,
		}: {
			children: React.ReactNode
			invalid?: boolean
			"aria-invalid"?: boolean | "false" | "true" | "grammar" | "spelling"
			className?: string
			style?: React.CSSProperties
		},
		ref: React.ForwardedRef<HTMLDivElement>,
	) => {
		return (
			<div
				ref={ref}
				aria-invalid={ariaInvalid || invalid ? "true" : "false"}
				className={twMerge(
					"aria-invalid:grid-rows-[1fr] m-0 grid grid-rows-[0fr] p-0 transition-[grid-template-rows] duration-200 ease-in-out",
					className,
				)}
				style={style}
			>
				<span className="text-danger-text text-2xs overflow-hidden">
					{children}
				</span>
			</div>
		)
	},
)

SlidingErrorMessage.displayName = "SlidingErrorMessage"

export function HelpMessage({
	children,
	className,
	style,
}: {
	children: React.ReactNode
	className?: string
	style?: React.CSSProperties
}) {
	return (
		<div
			className={twMerge("text-text-subtle text-2xs", className)}
			style={style}
		>
			{children}
		</div>
	)
}

export function ErrorHelpWrapper({
	children,
	helpMessage,
	errorMessage,
	errorMessageClassName,
	helpMessageClassName,
	errorMessageStyle,
	helpMessageStyle,
	inputRef,
	"aria-invalid": ariaInvalid,
}: ErrorHelpWrapperProps & {
	children: React.ReactElement
	inputRef: React.RefObject<HTMLElement>
}) {
	const errorRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const observer = new MutationObserver((mutationsList) => {
			for (const mutation of mutationsList) {
				if (
					mutation.type === "attributes" &&
					mutation.attributeName === "aria-invalid"
				) {
					const target = mutation.target as HTMLElement
					if (target.getAttribute("aria-invalid") === "true") {
						errorRef.current?.setAttribute("aria-invalid", "true")
					} else {
						errorRef.current?.setAttribute("aria-invalid", "false")
					}
				}
			}
		})
		if (inputRef.current) {
			observer.observe(inputRef.current, { attributes: true })
		}

		return () => {
			observer.disconnect()
		}
	}, [inputRef])

	return (
		<div className="flex flex-col gap-1">
			{children}
			{helpMessage && (
				<HelpMessage
					className={helpMessageClassName}
					style={helpMessageStyle}
				>
					{helpMessage}
				</HelpMessage>
			)}
			{errorMessage && (
				<SlidingErrorMessage
					ref={errorRef}
					aria-invalid={ariaInvalid}
					className={errorMessageClassName}
					style={errorMessageStyle}
				>
					{errorMessage}
				</SlidingErrorMessage>
			)}
		</div>
	)
}
