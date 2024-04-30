import type React from "react"
import { forwardRef } from "react"
import type { CSSProperties } from "react"

import { token } from "@atlaskit/tokens"

import { css } from "@emotion/css"

import { Collapsible } from "./Collapsible"
import { twMerge } from "tailwind-merge"

const borderColor = token("color.border", "#091e4224")

export const CardBase = forwardRef(
	(
		{
			header,
			closed,
			defaultOpen,
			onOpenChanged,
			children,
			id,
			testId,
			className,
			style,
		}: {
			header: React.ReactNode
			closed?: boolean
			defaultOpen?: boolean
			onOpenChanged?: (opened: boolean) => void
			children?: React.ReactNode
			id?: string
			testId?: string
			className?: string
			style?: CSSProperties
		},
		ref: React.ForwardedRef<HTMLDivElement>,
	) => {
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
				className={twMerge(
					"border-border shadow-overlay-bold border",
					className,
				)}
				triggerClassName="rounded-t border-b border-border overflow-hidden"
				id={id}
				testId={testId}
				ref={ref}
				style={style}
			>
				<div className="bg-surface box-border flex w-full rounded-b">
					{children}
				</div>
			</Collapsible>
		)
	},
)
CardBase.displayName = "CardBase"

const CardHeaderPrefix = ({
	children,
	className,
	style,
	id,
	testId,
}: {
	children: React.ReactNode
	className?: string
	style?: CSSProperties
	id?: string
	testId?: string
}) => {
	const _className = twMerge(
		"text-text-subtlest pr-2 mr-4 text-xs border-border border-r w-[100px] flex-none font-semibold grid items-center justify-start",
		className,
	)
	return (
		<div className={_className} id={id} data-testid={testId} style={style}>
			<div className="truncate">{children}</div>
		</div>
	)
}

const CardHeader = ({
	className,
	children,
	prefix,
	prefixClassName,
	prefixStyle,
	style,
	id,
	testId,
}: {
	className?: string
	children: React.ReactNode
	style?: CSSProperties
	id?: string
	testId?: string
	prefix?: React.ReactNode
	prefixClassName?: string
	prefixStyle?: CSSProperties
}) => (
	<div
		className={twMerge(
			"bg-surface-overlay flex w-full flex-1 justify-between px-4 py-3",
			className,
		)}
		style={style}
		id={id}
		data-testid={testId}
	>
		{prefix && (
			<CardHeaderPrefix className={prefixClassName} style={prefixStyle}>
				{prefix}
			</CardHeaderPrefix>
		)}
		{children}
	</div>
)

const CardHeaderMeta = ({
	children,
	id,
	testId,
}: {
	children: React.ReactNode
	id?: string
	testId?: string
}) => (
	<div
		className="w-full items-baseline overflow-hidden"
		id={id}
		data-testid={testId}
	>
		{children}
	</div>
)

const CardHeaderTitle = ({
	children,
	className,
	style,
	id,
	testId,
}: {
	children: React.ReactNode
	className?: string
	style?: CSSProperties
	id?: string
	testId?: string
	prefixClassName?: string
	prefixStyle?: CSSProperties
}) => {
	const _className = twMerge(
		"mt-0 w-full truncate text-start text-xl font-medium",
		className,
	)

	const content =
		typeof children === "string" ? (
			<h3
				className={_className}
				id={id}
				data-testid={testId}
				style={style}
			>
				{children}
			</h3>
		) : (
			<div
				className={_className}
				id={id}
				data-testid={testId}
				style={style}
			>
				{children}
			</div>
		)

	return <div className="flex w-full items-baseline">{content}</div>
}

const CardHeaderSubtitle = ({
	children,
	className,
	style,
	testId,
	id,
}: {
	children: React.ReactNode
	className?: string
	style?: CSSProperties
	testId?: string
	id?: string
}) => {
	const _className = twMerge(
		"text-text-subtlest mt-1 w-full flex-1 justify-start truncate text-start text-sm font-semibold",
		className,
	)
	if (typeof children === "string") {
		return (
			<div
				className={_className}
				id={id}
				data-testid={testId}
				style={style}
			>
				{children}
			</div>
		)
	}
	return (
		<div className={_className} id={id} data-testid={testId} style={style}>
			{children}
		</div>
	)
}

const CardHeaderUpperTitle = ({
	children,
	className,
	style,
	testId,
	id,
}: {
	children: React.ReactNode
	className?: string
	style?: CSSProperties
	testId?: string
	id?: string
}) => {
	const _className = twMerge(
		"text-text-subtlest my-1 w-full flex-1 justify-start truncate text-start text-xs font-light italic",
		className,
	)
	if (typeof children === "string") {
		return (
			<div
				className={_className}
				id={id}
				data-testid={testId}
				style={style}
			>
				{children}
			</div>
		)
	}
	return (
		<div className={_className} id={id} data-testid={testId} style={style}>
			{children}
		</div>
	)
}

const CardHeaderActions = ({
	children,
	id,
	testId,
}: {
	children: React.ReactNode
	id?: string
	testId?: string
}) => (
	<div
		className="flex flex-none items-center justify-end pl-2"
		id={id}
		data-testid={testId}
	>
		{children}
	</div>
)

const CardHeaderActionsInfo = ({
	children,
	id,
	testId,
}: {
	children: React.ReactNode
	id?: string
	testId?: string
}) => (
	<div className="mr-2 items-center text-sm" id={id} data-testid={testId}>
		{children}
	</div>
)

const cardBodyEntryBaseStyle = css`
	> * {
		padding: 12px 1rem;
		border-bottom: 1px solid ${borderColor};
		border-right: 1px solid ${borderColor};
	}
`
const CardGridBody = ({
	children,
	className,
	style,
	id,
	testId,
}: {
	children: React.ReactNode
	id?: string
	testId?: string
	className?: string
	style?: CSSProperties
}) => (
	<div
		className="w-full overflow-hidden rounded-b"
		is={id}
		data-testid={testId}
	>
		<div
			className={twMerge(
				`grid border-collapse overflow-hidden ${cardBodyEntryBaseStyle} ${css`
					grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
				`}`,
				className,
			)}
			style={style}
		>
			{children}
		</div>
	</div>
)

const CardRowBody = ({
	children,
	id,
	testId,
}: {
	children: React.ReactNode
	id?: string
	testId?: string
}) => (
	<div className="overflow-hidden rounded-b" id={id} data-testid={testId}>
		<div
			className={`grid border-collapse grid-flow-col overflow-x-auto overflow-y-hidden ${cardBodyEntryBaseStyle} ${css`
				grid-auto-columns: minmax(150px, 1fr);
			`}`}
		>
			{children}
		</div>
	</div>
)

const CardColumnBody = ({
	children,
	id,
	testId,
}: {
	children: React.ReactNode
	id?: string
	testId?: string
}) => (
	<div className="overflow-hidden rounded-b" id={id} data-testid={testId}>
		<div
			className={`grid border-collapse grid-flow-row overflow-auto ${cardBodyEntryBaseStyle} ${css`
				grid-auto-rows: minmax(150px, 1fr);
			`}`}
		>
			{children}
		</div>
	</div>
)

const CardBodyEntry = ({
	children,
	className,
	style,
	id,
	testId,
}: {
	children: React.ReactNode
	id?: string
	testId?: string
	className?: string
	style?: CSSProperties
}) => (
	<div
		className={twMerge(
			"flex w-full flex-1 flex-col items-baseline overflow-hidden text-sm",
			className,
		)}
		id={id}
		data-testid={testId}
		style={style}
	>
		<div className="w-full">{children}</div>
	</div>
)

const CardBodyEntryTitle = ({ children }: { children: React.ReactNode }) => (
	<p className="pb-1 text-[13px] font-semibold">{children}</p>
)

const BookCardComponents = {
	CardBase,
	CardHeader,
	CardHeaderMeta,
	CardHeaderTitle,
	CardHeaderSubtitle,
	CardHeaderUpperTitle,
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
	upperTitle?: React.ReactNode
	headerPrefix?: React.ReactNode
	closed?: boolean
	defaultOpen?: boolean
	bodyLayout: "row" | "grid" | "column"
	bodyStyle?: CSSProperties
	bodyClassName?: string
	actions?: React.ReactNode
	actionsInfo?: React.ReactNode
	children?: React.ReactNode
	onOpenChanged?: (opened: boolean) => void
	id?: string
	testId?: string
}

export const BookCard = forwardRef(
	(
		{
			title,
			subtitle,
			upperTitle,
			headerPrefix,
			closed,
			defaultOpen,
			actions,
			actionsInfo,
			bodyStyle,
			bodyClassName,
			bodyLayout,
			children,
			onOpenChanged,
			id,
			testId,
		}: BookCardProps,
		ref: React.ForwardedRef<HTMLDivElement>,
	) => {
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
				id={id}
				testId={testId}
				ref={ref}
				header={
					<CardHeader prefix={headerPrefix}>
						<CardHeaderMeta>
							{upperTitle && (
								<CardHeaderUpperTitle>
									{upperTitle}
								</CardHeaderUpperTitle>
							)}
							<CardHeaderTitle>{title}</CardHeaderTitle>
							{subtitle && (
								<CardHeaderSubtitle>
									{subtitle}
								</CardHeaderSubtitle>
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
	},
)
BookCard.displayName = "BookCard"
