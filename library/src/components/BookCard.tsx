import React, { CSSProperties, useCallback, useRef, useState } from "react"

import { token } from "@atlaskit/tokens"
import styled from "@emotion/styled"

import ChevronUpIcon from "@atlaskit/icon/glyph/chevron-up"
import ChevronDownIcon from "@atlaskit/icon/glyph/chevron-down"

const borderColor = token("color.border", "#091e4224")
const headerBackgroundColor = token("elevation.surface.sunken", "#f4f5f7")
const bodyBackgroundColor = token("elevation.surface", "#fff")

const headerTitleColor = token("color.text", "#172B4D")
const headerSubtitleTextColor = token("color.text.subtlest", "#6b778c")

const bookCardBaseStyle: CSSProperties = {
	display: "flex",
	flexDirection: "column",
	minWidth: 0,
	flex: "1 1 0",
	marginTop: "14px",
	borderRadius: "4px",
	border: `1px solid ${borderColor}`,
	overflow: "hidden",
}

function CardBase({
	children,
	header,
	defaultClosed,
}: {
	children?: React.ReactNode
	header: React.ReactNode
	defaultClosed?: boolean | undefined | null
}) {
	const detailsRef = useRef<HTMLDetailsElement>(null)
	const [isOpen, setIsOpen] = useState<boolean | undefined | null>(
		defaultClosed,
	)

	const onToggledCB = useCallback(() => {
		if (detailsRef.current) {
			setIsOpen(detailsRef.current.open)
		}
	}, [])

	if (defaultClosed == undefined) {
		return (
			<div style={bookCardBaseStyle}>
				{header}
				{children}
			</div>
		)
	}

	return (
		<details
			ref={detailsRef}
			style={bookCardBaseStyle}
			{...(!defaultClosed && { open: true })}
			onToggle={onToggledCB}
		>
			<summary
				style={{
					listStyle: "none",
					margin: 0,
					padding: 0,
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					backgroundColor: headerBackgroundColor,
					borderBottom: `1px solid ${borderColor}`,
					borderTopRightRadius: "4px",
					paddingRight: "4px",
				}}
			>
				<div
					style={{
						marginBottom: "-1px",
						//userSelect: "none",
					}}
				>
					{header}
				</div>
				{isOpen ? (
					<ChevronUpIcon label="close" />
				) : (
					<ChevronDownIcon label="open" />
				)}
			</summary>
			{children}
		</details>
	)
}

const CardHeader = styled.div`
	// book-card-header
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	gap: 30px;
	min-width: 0;

	padding: 12px 12px;

	border-top-left-radius: 4px;
	border-top-right-radius: 4px;
	background: ${headerBackgroundColor};
	border-bottom: 1px solid ${borderColor};
`

const CardHeaderMeta = styled.div`
	// book-card-header-meta
	display: flex;
	flex-direction: column;
	min-width: 0;
`

const CardHeaderTitle = styled.h3`
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
	color: ${headerTitleColor};
`

const CardHeaderSubtitle = styled.h6`
	margin-top: 5px;

	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
	color: ${headerSubtitleTextColor};
`

const CardHeaderActions = styled.div`
	// book-card-header-actions
	display: flex;
	align-items: center;
	justify-content: flex-end;
`

const CardHeaderActionsInfo = styled.div`
	// book-card-header-actions-info
	margin-right: 10px;
	align-items: center;

	& > span:not([role="presentation"]) {
		vertical-align: super;
	}
`

const CardGridBody = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
	overflow: auto;
	border-collapse: collapse;
	margin-right: -1px;
	margin-bottom: -1px;
	> * {
		padding: 8px 12px;
		border-bottom: 1px solid ${borderColor};
		border-right: 1px solid ${borderColor};
	}
`

const CardRowBody = styled.div`
	display: grid;
	overflow-x: auto;
	overflow-y: hidden;
	grid-auto-flow: column;
	grid-auto-columns: minmax(150px, 1fr);
	border-collapse: collapse;
	margin-right: -1px;
	margin-bottom: -1px;
	> * {
		padding: 8px 12px;
		border-bottom: 1px solid ${borderColor};
		border-right: 1px solid ${borderColor};
	}
`

const CardColumnBody = styled.div`
	display: grid;
	grid-auto-flow: row;
	overflow: auto;
	border-collapse: collapse;
	margin-right: -1px;
	margin-bottom: -1px;
	> * {
		padding: 8px 12px;
		border-bottom: 1px solid ${borderColor};
		border-right: 1px solid ${borderColor};
	}
`

const CardBodyEntry = styled.div`
	display: flex;
	flex: 1 1 0;
	align-items: baseline;
	flex-direction: column;
	background-color: ${bodyBackgroundColor};

	font-size: smaller;
`

const CardBodyEntryTitle = styled.span`
	font-size: ${token("font.heading.sm", "13px")};
	font-weight: ${token("font.weight.bold", "600")};
`

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
	title: string
	subtitle?: string
	defaultClosed?: boolean | undefined | null
	bodyLayout: "row" | "grid" | "column"
	bodyStyle?: CSSProperties
	maxBodyHeight?: string
	actions?: React.ReactNode
	actionsInfo?: React.ReactNode
	children?: React.ReactNode
}

export function BookCard({
	title,
	subtitle,
	defaultClosed,
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
			defaultClosed={defaultClosed}
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
			<div style={bodyStyle}>{body}</div>
		</CardBase>
	)
}
