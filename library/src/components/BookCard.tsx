import React from "react"
import type { CSSProperties } from "react"

import { token } from "@atlaskit/tokens"
import { css } from "@emotion/css"

import { Collapsible } from "./Collapsible"

const borderColor = token("color.border", "#091e4224")
const headerBackgroundColor = token("elevation.surface.sunken", "#f7f8f9")

const headerTitleColor = token("color.text", "#172B4D")
const headerSubtitleTextColor = token("color.text.subtlest", "#6b778c")

const bodyBackgroundColor = token("elevation.surface", "#fff")

const CardBase = ({
	header,
	closed,
	children,
}: {
	header: React.ReactNode
	closed?: boolean | undefined | null
	children?: React.ReactNode
}) => (
	<Collapsible
		openButtonPosition={closed != null ? "right" : "hidden"}
		header={header}
		opened={!closed}
		headerContainerStyle={{
			backgroundColor: headerBackgroundColor,
			border: `1px solid ${borderColor}`,
		}}
	>
		<div
			className="border-b border-x rounded-b"
			style={{
				backgroundColor: bodyBackgroundColor,
				borderColor: borderColor,
			}}
		>
			{children}
		</div>
	</Collapsible>
)

const CardHeader = ({ children }: { children: React.ReactNode }) => (
	<div className="flex flex-1 justify-between p-3 align-baseline">
		{children}
	</div>
)

const CardHeaderMeta = ({ children }: { children: React.ReactNode }) => (
	<div className="flex flex-1 flex-col items-baseline">{children}</div>
)

const CardHeaderTitle = ({ children }: { children: React.ReactNode }) => (
	<h3
		className="no-wrap text-ellipsis overflow-hidden"
		style={{ color: headerTitleColor }}
	>
		{children}
	</h3>
)

const CardHeaderSubtitle = ({ children }: { children: React.ReactNode }) => (
	<h6
		className="no-wrap mt-1 text-ellipsis overflow-hidden"
		style={{ color: headerSubtitleTextColor }}
	>
		{children}
	</h6>
)

const CardHeaderActions = ({ children }: { children: React.ReactNode }) => (
	<div className="flex content-end items-center">{children}</div>
)

const CardHeaderActionsInfo = ({ children }: { children: React.ReactNode }) => (
	<div className="mr-2 text-sm items-center">{children}</div>
)

const cardBodyEntryBaseStyle = css`
	> * {
		padding: 8px 12px;
		border-bottom: 1px solid ${borderColor};
		border-right: 1px solid ${borderColor};
	}
`
const CardGridBody = ({ children }: { children: React.ReactNode }) => (
	<div
		className={`grid border-collapse overflow-auto ${cardBodyEntryBaseStyle} ${css`
			grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		`}`}
	>
		{children}
	</div>
)

const CardRowBody = ({ children }: { children: React.ReactNode }) => (
	<div
		className={`grid overflow-x-auto overflow-y-hidden border-collapse grid-flow-col ${cardBodyEntryBaseStyle} ${css`
			grid-auto-columns: minmax(150px, 1fr);
		`}`}
	>
		{children}
	</div>
)

const CardColumnBody = ({ children }: { children: React.ReactNode }) => (
	<div
		className={`grid overflow-auto border-collapse grid-flow-row ${cardBodyEntryBaseStyle} ${css`
			grid-auto-rows: minmax(150px, 1fr);
		`}`}
	>
		{children}
	</div>
)

const CardBodyEntry = ({ children }: { children: React.ReactNode }) => (
	<div className="flex flex-1 flex-col items-baseline text-xs">
		{children}
	</div>
)

const CardBodyEntryTitle = ({ children }: { children: React.ReactNode }) => (
	<span className="text-sm font-bold">{children}</span>
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
	closed?: boolean | undefined | null
	bodyLayout: "row" | "grid" | "column"
	bodyStyle?: CSSProperties
	actions?: React.ReactNode
	actionsInfo?: React.ReactNode
	children?: React.ReactNode
}

export function BookCard({
	title,
	subtitle,
	closed,
	actions,
	actionsInfo,
	bodyStyle,
	bodyLayout,
	children,
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
			<div className="-mb-[1px] -mx-[1px]">
				<div style={bodyStyle}>{body}</div>
			</div>
		</CardBase>
	)
}
