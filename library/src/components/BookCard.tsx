import React from "react"
import type { CSSProperties } from "react"

import { token } from "@atlaskit/tokens"

import { css } from "@emotion/css"

import { Collapsible } from "./Collapsible"
import { twMerge } from "tailwind-merge"

const borderColor = token("color.border", "#091e4224")

const CardBase = ({
	header,
	closed,
	defaultOpen,
	onOpenChanged,
	children,
}: {
	header: React.ReactNode
	closed?: boolean
	defaultOpen?: boolean
	onOpenChanged?: (opened: boolean) => void
	children?: React.ReactNode
}) => {
	const openVal =
		closed != null ? !closed : defaultOpen != null ? undefined : true

	const openButtonPos =
		closed == undefined && defaultOpen == undefined ? "hidden" : "right"

	return (
		<Collapsible
			openButtonPosition={openButtonPos}
			header={header}
			open={openVal}
			defaultOpen={defaultOpen}
			onChanged={onOpenChanged}
			className="border-border shadow-overlay-bold border"
			triggerClassName="rounded-t border-b border-border overflow-hidden"
		>
			<div className="bg-surface box-border flex w-full rounded-b">
				{children}
			</div>
		</Collapsible>
	)
}

const CardHeader = ({
	className,
	children,
}: {
	className?: string
	children: React.ReactNode
}) => (
	<div
		className={twMerge(
			"bg-surface-overlay flex w-full flex-1 justify-between px-6 py-3",
			className,
		)}
	>
		{children}
	</div>
)

const CardHeaderMeta = ({ children }: { children: React.ReactNode }) => (
	<div className="w-full items-baseline overflow-hidden">{children}</div>
)

const CardHeaderTitle = ({ children }: { children: React.ReactNode }) => {
	if (typeof children === "string") {
		return (
			<h3 className="w-full truncate text-start text-xl font-medium">
				{children}
			</h3>
		)
	}

	return <div className="w-full truncate text-start">{children}</div>
}

const CardHeaderSubtitle = ({ children }: { children: React.ReactNode }) => {
	if (typeof children === "string") {
		return (
			<p className="text-text-subtlest mt-1 w-full flex-1 justify-start truncate text-start text-sm font-semibold">
				{children}
			</p>
		)
	}
	return (
		<div className="text-text-subtlest mt-1 w-full flex-1 justify-start truncate text-start text-sm font-semibold">
			{children}
		</div>
	)
}

const CardHeaderActions = ({ children }: { children: React.ReactNode }) => (
	<div className="flex flex-none items-center justify-end pl-2">
		{children}
	</div>
)

const CardHeaderActionsInfo = ({ children }: { children: React.ReactNode }) => (
	<div className="mr-2 items-center text-sm">{children}</div>
)

const cardBodyEntryBaseStyle = css`
	> * {
		padding: 12px 1.5rem;
		border-bottom: 1px solid ${borderColor};
		border-right: 1px solid ${borderColor};
	}
`
const CardGridBody = ({ children }: { children: React.ReactNode }) => (
	<div className="w-full overflow-hidden rounded-b">
		<div
			className={`grid border-collapse overflow-auto ${cardBodyEntryBaseStyle} ${css`
				grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
			`}`}
		>
			{children}
		</div>
	</div>
)

const CardRowBody = ({ children }: { children: React.ReactNode }) => (
	<div className="overflow-hidden rounded-b">
		<div
			className={`grid border-collapse grid-flow-col overflow-x-auto overflow-y-hidden ${cardBodyEntryBaseStyle} ${css`
				grid-auto-columns: minmax(150px, 1fr);
			`}`}
		>
			{children}
		</div>
	</div>
)

const CardColumnBody = ({ children }: { children: React.ReactNode }) => (
	<div className="overflow-hidden rounded-b">
		<div
			className={`grid border-collapse grid-flow-row overflow-auto ${cardBodyEntryBaseStyle} ${css`
				grid-auto-rows: minmax(150px, 1fr);
			`}`}
		>
			{children}
		</div>
	</div>
)

const CardBodyEntry = ({ children }: { children: React.ReactNode }) => (
	<div className="flex flex-1 flex-col items-baseline text-sm">
		{children}
	</div>
)

const CardBodyEntryTitle = ({ children }: { children: React.ReactNode }) => (
	<span className="pb-1 text-[13px] font-semibold">{children}</span>
)

const BookCardComponents = {
	CardBase,
	CardHeader,
	CardHeaderMeta,
	CardHeaderTitle,
	CardHeaderSubtitle,
	CardHeaderActions,
	CardHeaderActionsInfo,
	CardGridBody,
	CardRowBody,
	CardColumnBody,
	CardBodyEntry,
	CardBodyEntryTitle,
}

export { BookCardComponents }

type BookCardProps = {
	title: React.ReactNode
	subtitle?: React.ReactNode
	closed?: boolean
	defaultOpen?: boolean
	bodyLayout: "row" | "grid" | "column"
	bodyStyle?: CSSProperties
	bodyClassName?: string
	actions?: React.ReactNode
	actionsInfo?: React.ReactNode
	children?: React.ReactNode
	onOpenChanged?: (opened: boolean) => void
}

export function BookCard({
	title,
	subtitle,
	closed,
	defaultOpen,
	actions,
	actionsInfo,
	bodyStyle,
	bodyClassName,
	bodyLayout,
	children,
	onOpenChanged,
}: BookCardProps) {
	const body = (() => {
		switch (bodyLayout) {
			case "row":
				return <CardRowBody>{children}</CardRowBody>
			case "grid":
				return <CardGridBody>{children}</CardGridBody>
			case "column":
				return <CardColumnBody>{children}</CardColumnBody>
			default:
				return <CardGridBody>{children}</CardGridBody>
		}
	})()

	return (
		<CardBase
			closed={closed}
			onOpenChanged={onOpenChanged}
			defaultOpen={defaultOpen}
			header={
				<CardHeader>
					<CardHeaderMeta>
						<CardHeaderTitle>{title}</CardHeaderTitle>
						{subtitle && (
							<CardHeaderSubtitle>{subtitle}</CardHeaderSubtitle>
						)}
					</CardHeaderMeta>
					<CardHeaderActions>
						{actionsInfo && (
							<CardHeaderActionsInfo>
								{actionsInfo}
							</CardHeaderActionsInfo>
						)}
						{actions}
					</CardHeaderActions>
				</CardHeader>
			}
		>
			<div className="bg-surface box-border w-full rounded-b">
				<div style={bodyStyle} className={bodyClassName}>
					{body}
				</div>
			</div>
		</CardBase>
	)
}
