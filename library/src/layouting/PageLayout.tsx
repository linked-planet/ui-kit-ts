import React from "react"
import { token } from "@atlaskit/tokens"
import { twMerge } from "tailwind-merge"

const pageContentBackgroundColor = token("elevation.surface", "#fff")
const subtitleColor = token("color.text.subtlest", "#172B4D")
const borderColor = token("color.border", "#091e4224")
const menuColor = token("color.background.neutral.subtle", "#f7f8f9")

const Page = ({
	children,
	id,
	className,
}: {
	children: React.ReactNode
	id?: string
	className?: string
}) => (
	<div
		className={twMerge(
			"flex h-full min-h-0 w-full flex-col overflow-hidden",
			className,
		)}
		id={id}
	>
		{children}
	</div>
)

const PageHeader = ({
	children,
	id,
	className,
}: {
	children: React.ReactNode
	id?: string
	className?: string
}) => (
	<div
		className={twMerge(
			"flex w-full flex-col border-b pl-5 pr-3 pt-5",
			className,
		)}
		id={id}
		style={{
			borderColor,
			backgroundColor: menuColor,
		}}
	>
		{children}
	</div>
)

const PageHeaderTitle = ({
	children,
	id,
	className,
}: {
	children: React.ReactNode
	id?: string
	className?: string
}) => (
	<div className={twMerge("mb-2", className)} id={id}>
		{children}
	</div>
)

const PageHeaderSubTitle = ({
	children,
	id,
	className,
}: {
	children: React.ReactNode
	id?: string
	className?: string
}) => (
	<div
		className={twMerge("mb-3 mt-3", className)}
		id={id}
		style={{ color: subtitleColor }}
	>
		{children}
	</div>
)

const PageHeaderLine = ({
	children,
	id,
	className,
}: {
	children: React.ReactNode
	id?: string
	className?: string
}) => (
	<div
		className={twMerge("mb-2 flex w-full items-center gap-1", className)}
		id={id}
	>
		{children}
	</div>
)

const PageBody = ({
	children,
	id,
	className,
}: {
	children: React.ReactNode
	id?: string
	className?: string
}) => (
	<div
		className={twMerge(
			"flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden",
			className,
		)}
		id={id}
	>
		{children}
	</div>
)

const PageBodyHeader = ({
	children,
	id,
	className,
}: {
	children: React.ReactNode
	id?: string
	className?: string
}) => (
	<div
		className={twMerge("z-0 pb-2 pl-4 pr-3 pt-3", className)}
		id={id}
		style={{
			boxShadow: `0 4px 4px ${token("color.border", "#091e4224")}`,
			backgroundColor: menuColor,
		}}
	>
		{children}
	</div>
)

const PageBodyContent = ({
	children,
	id,
	className,
}: {
	children: React.ReactNode
	id?: string
	className?: string
}) => (
	<div
		className={twMerge(
			"min-h-0 flex-1 overflow-y-auto pb-5 pl-5 pr-3 pt-3",
			className,
		)}
		id={id}
		style={{
			backgroundColor: pageContentBackgroundColor,
		}}
	>
		{children}
	</div>
)

const PageBodyFooter = ({
	children,
	id,
	className,
}: {
	children: React.ReactNode
	id?: string
	className?: string
}) => (
	<div
		className={twMerge("flex justify-center border-t pt-1", className)}
		id={id}
		style={{
			borderColor,
			boxShadow: `0 -4px 4px ${token("color.border", "#091e4224")}`,
			backgroundColor: menuColor,
		}}
	>
		{children}
	</div>
)

const PageLayout = {
	Page,
	PageHeader,
	PageHeaderTitle,
	PageHeaderSubTitle,
	PageBody,
	PageBodyHeader,
	PageBodyContent,
	PageBodyFooter,
	PageHeaderLine,
}
export default PageLayout
