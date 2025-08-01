import type React from "react"
import { twMerge } from "tailwind-merge"

const Page = ({
	children,
	id,
	className,
}: {
	children: React.ReactNode
	id?: string
	className?: string
	testId?: string
}) => (
	<div
		className={twMerge(
			"flex h-full flex-1 min-h-0 w-full flex-col overflow-hidden",
			className,
		)}
		id={id}
	>
		{children}
	</div>
)

const PageHeader = ({
	shadow = true,
	children,
	id,
	className,
	style,
	testId,
	...props
}: {
	shadow?: boolean
	children: React.ReactNode
	id?: string
	className?: string
	style?: React.CSSProperties
	testId?: string
}) => (
	<header
		className={twMerge(
			`border-border bg-surface-raised z-1 flex flex-col border-b pb-4 pt-6 focus-visible:outline-selected-bold focus-visible:outline-2 focus-visible:outline-solid ${
				shadow ? "shadow-strong" : ""
			}`,
			className,
		)}
		id={id}
		style={style}
		data-testid={testId}
		{...props}
	>
		{children}
	</header>
)

const PageHeaderTitle = ({
	children,
	id,
	className,
	style,
	titleMenu,
	testId,
}: {
	children: React.ReactNode
	id?: string
	className?: string
	style?: React.CSSProperties
	titleMenu?: React.ReactNode
	testId?: string
}) => {
	return (
		<div
			className={twMerge("mb-2 flex items-center px-8", className)}
			id={id ?? "page-header-title"}
			style={style}
			data-testid={testId}
		>
			{typeof children === "string" ? <h1>{children}</h1> : children}
			{titleMenu && <div className="ml-auto flex-none">{titleMenu}</div>}
		</div>
	)
}

const PageHeaderSubTitle = ({
	children,
	id,
	className,
	style,
	testId,
}: {
	children: React.ReactNode
	id?: string
	className?: string
	style?: React.CSSProperties
	testId?: string
}) => (
	<div
		className={twMerge("text-text-subtlest mb-1 px-8", className)}
		id={id}
		style={style}
		data-testid={testId}
	>
		{typeof children === "string" ? (
			<p className="pt-0">{children}</p>
		) : (
			children
		)}
	</div>
)

const PageHeaderLine = ({
	children,
	id,
	className,
	style,
	testId,
}: {
	children: React.ReactNode
	id?: string
	className?: string
	style?: React.CSSProperties
	testId?: string
}) => (
	<div
		className={twMerge(
			"flex w-full items-center gap-1 px-8 py-1",
			className,
		)}
		style={style}
		id={id}
		data-testid={testId}
	>
		{children}
	</div>
)

const PageBody = ({
	children,
	id,
	className,
	style,
	testId,
}: {
	children: React.ReactNode
	id?: string
	className?: string
	style?: React.CSSProperties
	testId?: string
}) => (
	<div
		className={twMerge(
			"bg-surface z-0 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden",
			className,
		)}
		style={style}
		id={id ?? "page-body"}
		data-testid={testId}
	>
		{children}
	</div>
)

const PageBodyContent = ({
	children,
	id,
	className,
	style,
	ariaLabel,
}: {
	children: React.ReactNode
	id?: string
	className?: string
	style?: React.CSSProperties
	ariaLabel: string
}) => (
	<section
		className={twMerge(
			"min-h-0 flex-1 overflow-y-auto px-6 py-3 focus-visible:outline-selected-bold focus-visible:outline-2 focus-visible:outline-solid",
			className,
		)}
		id={id ?? "page-body-content"}
		style={style}
		aria-label={ariaLabel}
	>
		{children}
	</section>
)

const PageBodyHeader = ({
	children,
	id,
	className,
	style,
	testId,
	ariaLabel,
}: {
	children: React.ReactNode
	id?: string
	className?: string
	style?: React.CSSProperties
	testId?: string
	ariaLabel: string
}) => (
	<section
		className={twMerge(
			"bg-surface-raised shadow-overflow z-0 px-8 py-1 focus-visible:outline-selected-bold focus-visible:outline-2 focus-visible:outline-solid",
			className,
		)}
		id={id ?? "page-body-header"}
		style={style}
		data-testid={testId}
		aria-label={ariaLabel}
	>
		{children}
	</section>
)

const PageBodyFooter = ({
	children,
	id,
	className,
	style,
	testId,
}: {
	children: React.ReactNode
	id?: string
	className?: string
	style?: React.CSSProperties
	testId?: string
}) => (
	<footer
		className={twMerge(
			"bg-surface-raised border-border shadow-strong z-0 flex justify-center border-t p-1.5 focus-visible:outline-selected-bold focus-visible:outline-2 focus-visible:outline-solid",
			className,
		)}
		id={id ?? "page-body-footer"}
		style={style}
		data-testid={testId}
	>
		{children}
	</footer>
)

export const PageLayout = {
	Page,
	PageHeader,
	PageHeaderTitle,
	PageHeaderSubTitle,
	PageBody,
	PageBodyContent,
	PageBodyHeader,
	PageBodyFooter,
	PageHeaderLine,
}
