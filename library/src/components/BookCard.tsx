import type React from "react"
import { forwardRef } from "react"
import type { CSSProperties } from "react"

import { token } from "@atlaskit/tokens"

import { css } from "@emotion/css"

import { twMerge } from "tailwind-merge"
import { Collapsible } from "./Collapsible"

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
			triggerClassName,
			triggerStyle,
			chevronClassName,
			chevronStyle,
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
			triggerClassName?: string
			triggerStyle?: React.CSSProperties
			chevronClassName?: string
			chevronStyle?: React.CSSProperties
		},
		ref: React.ForwardedRef<HTMLDivElement>,
	) => {
		const openVal =
			closed != null ? !closed : defaultOpen != null ? undefined : true

		const openButtonPos =
			closed == null && defaultOpen == null ? "hidden" : "right"

		return (
			<Collapsible
				openButtonPosition={openButtonPos}
				header={header}
				open={openVal}
				defaultOpen={defaultOpen}
				onChanged={onOpenChanged}
				className={twMerge(
					"border-border box-border border-2 border-solid",
					className,
				)}
				triggerClassName={twMerge(
					"rounded-t data-[state=closed]:border-b-0 data-[state=open]:border-b box-border border-solid border-x-0 border-t-0 border-border overflow-hidden",
					triggerClassName,
				)}
				triggerStyle={triggerStyle}
				id={id}
				testId={testId}
				ref={ref}
				style={style}
				chevronClassName={chevronClassName}
				chevronStyle={chevronStyle}
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
		"text-text-subtlest pr-2 mr-4 box-border text-xs border-border border-r w-[100px] flex-none font-semibold grid items-center justify-start",
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
			"bg-surface-overlay box-border flex flex-1 justify-between px-4 py-3",
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
	className,
	style,
}: {
	children: React.ReactNode
	id?: string
	testId?: string
	className?: string
	style?: CSSProperties
}) => (
	<div
		className={twMerge(
			"w-full items-baseline box-border overflow-hidden",
			className,
		)}
		style={style}
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
		"mt-0 truncate box-border text-start text-xl font-medium",
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
		"text-text-subtlest box-border mt-1 flex-1 justify-start truncate text-start text-sm font-semibold",
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
		"text-text-subtlest box-border my-1 w-full flex-1 justify-start truncate text-start text-xs font-light italic",
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
	className,
	style,
	onClick,
	onKeyDown,
	onKeyUp,
}: {
	children: React.ReactNode
	id?: string
	testId?: string
	className?: string
	style?: CSSProperties
	onClick?: (event: React.MouseEvent<HTMLDivElement>) => void
	onKeyDown?: (event: React.KeyboardEvent<HTMLDivElement>) => void
	onKeyUp?: (event: React.KeyboardEvent<HTMLDivElement>) => void
}) => (
	<div
		className={twMerge(
			"flex flex-none box-border items-center justify-end pl-2",
			className,
		)}
		id={id}
		data-testid={testId}
		style={style}
		onClick={onClick}
		onKeyDown={onKeyDown}
		onKeyUp={onKeyUp}
	>
		{children}
	</div>
)

const CardHeaderActionsInfo = ({
	children,
	id,
	testId,
	className,
	style,
}: {
	children: React.ReactNode
	id?: string
	testId?: string
	className?: string
	style?: CSSProperties
}) => (
	<div
		className={twMerge("mr-2 box-border items-center text-sm", className)}
		id={id}
		data-testid={testId}
		style={style}
	>
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
		className="w-full overflow-hidden box-border rounded-b"
		is={id}
		data-testid={testId}
	>
		<div
			className={twMerge(
				`grid border-collapse box-border overflow-hidden ${cardBodyEntryBaseStyle} ${css`
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
	<div
		className="overflow-hidden rounded-b box-border"
		id={id}
		data-testid={testId}
	>
		<div
			className={`grid border-collapse grid-flow-col box-border overflow-x-auto overflow-y-hidden ${cardBodyEntryBaseStyle} ${css`
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
	<div
		className="overflow-hidden rounded-b box-border"
		id={id}
		data-testid={testId}
	>
		<div
			className={`grid border-collapse box-border grid-flow-row overflow-auto ${cardBodyEntryBaseStyle} ${css`
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
			"flex w-full box-border flex-1 flex-col items-baseline overflow-hidden text-sm",
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
