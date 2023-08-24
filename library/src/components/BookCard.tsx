import React from "react"

import { token } from "@atlaskit/tokens"
import styled from "@emotion/styled"

const borderColor = token("color.border", "#091e4224")
const headerBackgroundColor = token("elevation.surface.sunken", "#f4f5f7")
const bodyBackgroundColor = token("elevation.surface", "#fff")

const headerTitleColor = token("color.text", "#172B4D")
const headerSubtitleTextColor = token("color.text.subtlest", "#6b778c")

const BookCardBase = styled.div`
	display: flex;
	flex-direction: column;
	min-width: 0;
	flex: 1 1 0;
	margin-top: 14px;

	border-radius: 4px;
	border: 1px solid ${borderColor};
`

const BookCardHeader = styled.div`
	// book-card-header
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	gap: 30px;
	min-width: 0;

	padding: 10px 24px;

	border-top-left-radius: 4px;
	border-top-right-radius: 4px;
	background: ${headerBackgroundColor};
	border-bottom: 1px solid ${borderColor};
`

const BookCardHeaderMeta = styled.div`
	// book-card-header-meta
	display: flex;
	flex-direction: column;
	min-width: 0;
`

const BookCardHeaderTitle = styled.h3`
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
	color: ${headerTitleColor};
`

const BookCardHeaderSubtitle = styled.h6`
	margin-top: 5px;

	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
	color: ${headerSubtitleTextColor};
`

const BookCardHeaderActions = styled.div`
	// book-card-header-actions
	display: flex;
	align-items: center;
	justify-content: flex-end;
`

const BookCardHeaderActionsInfo = styled.div`
	// book-card-header-actions-info
	margin-right: 10px;
	align-items: center;

	& > span:not([role="presentation"]) {
		vertical-align: super;
	}
`

const BookCardBody = styled.div`
	// book-card-body
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
	overflow: auto;
	border-collapse: collapse;
	margin-right: -1px;
	margin-bottom: -1px;
	//background-color: #091e4224;
	> * {
		padding: 8px 12px;
		border-bottom: 1px solid ${borderColor};
		border-right: 1px solid ${borderColor};
	}
`

const BookCardBodyEntry = styled.div`
	// book-card-body-entry
	display: flex;
	flex: 1 1 0;
	align-items: baseline;
	flex-direction: column;
	background-color: ${bodyBackgroundColor};

	font-size: smaller;
`

const BookCardBodyEntryTitle = styled.span`
	// book-card-body-entry-title
	font-size: ${token("font.heading.sm", "13px")};
	font-weight: ${token("font.weight.bold", "600")};
`

const BookCardComponents = {
	BookCardBase,
	BookCardHeader,
	BookCardHeaderMeta,
	BookCardHeaderTitle,
	BookCardHeaderSubtitle,
	BookCardHeaderActions,
	BookCardHeaderActionsInfo,
	BookCardBody,
	BookCardBodyEntry,
	BookCardBodyEntryTitle,
}

export { BookCardComponents }

type BookCardProps = {
	title: string
	subtitle?: string
	actions?: React.ReactNode
	actionsInfo?: React.ReactNode
	children?: React.ReactNode
}

export function BookCard({
	title,
	subtitle,
	actions,
	actionsInfo,
	children,
}: BookCardProps) {
	return (
		<BookCardBase>
			<BookCardHeader>
				<BookCardHeaderMeta>
					<BookCardHeaderTitle>{title}</BookCardHeaderTitle>
					{subtitle && (
						<BookCardHeaderSubtitle>
							{subtitle}
						</BookCardHeaderSubtitle>
					)}
				</BookCardHeaderMeta>
				<BookCardHeaderActions>
					{actionsInfo && (
						<BookCardHeaderActionsInfo>
							{actionsInfo}
						</BookCardHeaderActionsInfo>
					)}
					{actions}
				</BookCardHeaderActions>
			</BookCardHeader>
			<BookCardBody>{children}</BookCardBody>
		</BookCardBase>
	)
}
