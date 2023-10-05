import React from "react"
import { token } from "@atlaskit/tokens"

const pageContentBackgroundColor = token("elevation.surface", "#fff")
const subtitleColor = token("color.text.subtlest", "#172B4D")
const borderColor = token("color.border", "#091e4224")
const menuColor = token("color.background.neutral.subtle", "#f7f8f9")

const Page = ({ children }: { children: React.ReactNode }) => (
	<div className="flex h-full min-h-0 w-full flex-col overflow-hidden">
		{children}
	</div>
)

const PageHeader = ({ children }: { children: React.ReactNode }) => (
	<div
		className="flex w-full flex-col border-b pl-5 pr-3 pt-5"
		style={{
			borderColor,
			backgroundColor: menuColor,
		}}
	>
		{children}
	</div>
)

const PageHeaderTitle = ({ children }: { children: React.ReactNode }) => (
	<div className="mb-2">{children}</div>
)

const PageHeaderSubTitle = ({ children }: { children: React.ReactNode }) => (
	<div className="mb-3 mt-3" style={{ color: subtitleColor }}>
		{children}
	</div>
)

const PageHeaderLine = ({ children }: { children: React.ReactNode }) => (
	<div className="mb-2 flex w-full items-center gap-1">{children}</div>
)

const PageBody = ({ children }: { children: React.ReactNode }) => (
	<div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
		{children}
	</div>
)

const PageBodyHeader = ({ children }: { children: React.ReactNode }) => (
	<div
		className="z-0 pb-2 pl-4 pr-3 pt-3"
		style={{
			boxShadow: `0 4px 4px ${token("color.border", "#091e4224")}`,
			backgroundColor: menuColor,
		}}
	>
		{children}
	</div>
)

const PageBodyContent = ({ children }: { children: React.ReactNode }) => (
	<div
		className="min-h-0 flex-1 overflow-y-auto pb-5 pl-5 pr-3 pt-3"
		style={{
			backgroundColor: pageContentBackgroundColor,
		}}
	>
		{children}
	</div>
)

const PageBodyFooter = ({ children }: { children: React.ReactNode }) => (
	<div
		className="flex justify-center border-t pt-1"
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
