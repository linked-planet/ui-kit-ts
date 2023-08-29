import React from "react"
import { token } from "@atlaskit/tokens"

const pageContentBackgroundColor = token("elevation.surface", "#fff")
const subtitleColor = token("color.text.subtlest", "#172B4D")
const borderColor = token("color.border", "#091e4224")
const menuColor = token("color.background.neutral.subtle", "#f7f8f9")

const Page = ({ children }: { children: React.ReactNode }) => (
	<div className="flex flex-col w-full h-full min-h-0 overflow-hidden">
		{children}
	</div>
)

const PageHeader = ({ children }: { children: React.ReactNode }) => (
	<div
		className="flex flex-col w-full pt-5 pl-5 pr-3 border-b"
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
	<div className="mt-3 mb-3" style={{ color: subtitleColor }}>
		{children}
	</div>
)

const PageHeaderLine = ({ children }: { children: React.ReactNode }) => (
	<div className="flex w-full gap-1 mb-2 items-center">{children}</div>
)

const PageBody = ({ children }: { children: React.ReactNode }) => (
	<div className="flex flex-col flex-1 min-h-0 min-w-0 overflow-hidden">
		{children}
	</div>
)

const PageBodyHeader = ({ children }: { children: React.ReactNode }) => (
	<div
		className="pt-3 pb-2 pl-4 pr-3 z-0"
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
		className="flex-1 min-h-0 overflow-y-auto pl-5 pb-5 pr-3 pt-3"
		style={{
			backgroundColor: pageContentBackgroundColor,
		}}
	>
		{children}
	</div>
)

const PageBodyFooter = ({ children }: { children: React.ReactNode }) => (
	<div
		className="flex justify-center pt-1 border-t"
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
