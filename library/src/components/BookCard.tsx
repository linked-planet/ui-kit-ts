import { css } from "@emotion/css"
import type React from "react"
import type { ComponentProps, CSSProperties } from "react"
import { forwardRef } from "react"

import { twMerge } from "tailwind-merge"
import {
	Collapsible,
	type CollapsibleProps,
	type CollapsibleTriggerProps,
} from "./Collapsible"

export const CardBase = forwardRef(
	(
		{
			header,
			onOpenChange,
			children,
			triggerProps,
			open,
			defaultOpen = true,
			...props
		}: {
			header: React.ReactNode
			triggerProps?: CollapsibleTriggerProps
		} & CollapsibleProps,
		ref: React.ForwardedRef<HTMLDivElement>,
	) => {
		const openButtonPos =
			open == null && defaultOpen == null ? "hidden" : "right"

		const forwardedRef = ref

		return (
			<Collapsible.Root
				open={open}
				defaultOpen={defaultOpen}
				onOpenChange={onOpenChange}
				ref={forwardedRef}
				{...props}
			>
				<Collapsible.Trigger
					openButtonPosition={openButtonPos}
					data-component="CardBaseTrigger"
					{...triggerProps}
				>
					{header}
				</Collapsible.Trigger>
				<Collapsible.Content>{children}</Collapsible.Content>
			</Collapsible.Root>
		)
	},
)
CardBase.displayName = "CardBase"

const CardHeaderPrefix = ({
	children,
	className,
	...props
}: ComponentProps<"div">) => {
	const _className = twMerge(
		"text-text-subtlest pr-2 mr-4 box-border text-xs border-border border-r w-[100px] flex-none font-semibold grid items-center justify-start",
		className,
	)
	return (
		<div
			className={_className}
			{...props}
			data-component="CardHeaderPrefix"
		>
			<div className="truncate">{children}</div>
		</div>
	)
}

type CardHeaderPrefixProps = {
	children: React.ReactNode
	className?: string
	style?: CSSProperties
}

const CardHeader = ({
	className,
	children,
	headerPrefix,
	...props
}: ComponentProps<"div"> & {
	headerPrefix?: CardHeaderPrefixProps
}) => (
	<div
		className={twMerge(
			"bg-surface-overlay box-border flex flex-1 justify-between px-4 py-3 overflow-hidden",
			className,
		)}
		{...props}
		data-component="CardHeader"
	>
		{headerPrefix ? (
			<CardHeaderPrefix
				className={headerPrefix.className}
				style={headerPrefix.style}
			>
				{headerPrefix.children}
			</CardHeaderPrefix>
		) : null}
		{children}
	</div>
)

const CardHeaderMeta = ({
	children,
	className,
	...props
}: ComponentProps<"div">) => (
	<div
		className={twMerge(
			"w-full items-baseline box-border overflow-hidden",
			className,
		)}
		{...props}
		data-component="CardHeaderMeta"
	>
		{children}
	</div>
)

const CardHeaderTitle = ({
	children,
	className,
	...props
}: ComponentProps<"div">) => {
	const _className = twMerge(
		"mt-0 truncate box-border text-start text-xl font-medium",
		className,
	)

	const content =
		typeof children === "string" ? (
			<h3
				className={_className}
				{...props}
				data-component="CardHeaderTitle"
			>
				{children}
			</h3>
		) : (
			<div
				className={_className}
				{...props}
				data-component="CardHeaderTitle"
			>
				{children}
			</div>
		)

	return <div className="flex w-full items-baseline">{content}</div>
}

const CardHeaderSubtitle = ({
	children,
	className,
	...props
}: ComponentProps<"div">) => {
	const _className = twMerge(
		"text-text-subtlest box-border mt-1 flex-1 justify-start truncate text-start text-sm font-semibold",
		className,
	)
	if (typeof children === "string") {
		return (
			<div
				className={_className}
				{...props}
				data-component="CardHeaderSubtitle"
			>
				{children}
			</div>
		)
	}
	return (
		<div
			className={_className}
			{...props}
			data-component="CardHeaderSubtitle"
		>
			{children}
		</div>
	)
}

const CardHeaderUpperTitle = ({
	children,
	className,
	...props
}: ComponentProps<"div">) => {
	const _className = twMerge(
		"text-text-subtlest box-border my-1 w-full flex-1 justify-start truncate text-start text-xs font-light italic",
		className,
	)
	if (typeof children === "string") {
		return (
			<div
				className={_className}
				{...props}
				data-component="CardHeaderUpperTitle"
			>
				{children}
			</div>
		)
	}
	return (
		<div
			className={_className}
			{...props}
			data-component="CardHeaderUpperTitle"
		>
			{children}
		</div>
	)
}

/**
 * Styling element containing the actions of the card header
 */
const CardHeaderActions = ({
	children,
	className,
	...props
}: ComponentProps<"div">) => (
	<div
		className={twMerge(
			"flex flex-none box-border items-center justify-end pl-2",
			className,
		)}
		{...props}
		data-component="CardHeaderActions"
	>
		{children}
	</div>
)

const cardBodyEntryBaseStyle = css`
	> * {
		padding: 12px 1rem;
		border-bottom: 1px solid var(--color-border);
		border-right: 1px solid var(--color-border);
	}
`
const CardGridBody = ({
	children,
	className,
	style,
	...props
}: ComponentProps<"div">) => (
	<div
		className="w-full overflow-hidden box-border rounded-b"
		{...props}
		data-component="CardGridBody"
	>
		<div
			className={twMerge(
				`grid border-collapse box-border overflow-hidden ${cardBodyEntryBaseStyle} border-border border-solid border-t border-l border-b-0 border-r-0 -m-1`,
				className,
			)}
			style={{
				gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
				...style,
			}}
		>
			{children}
		</div>
	</div>
)

const CardRowBody = ({ children, ...props }: ComponentProps<"div">) => (
	<div
		className="overflow-hidden rounded-b box-border"
		data-component="CardRowBody"
		{...props}
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

const CardColumnBody = ({ children, ...props }: ComponentProps<"div">) => (
	<div
		className="overflow-hidden rounded-b box-border"
		data-component="CardColumnBody"
		{...props}
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
	...props
}: ComponentProps<"div">) => (
	<div
		className={twMerge(
			"flex w-full box-border flex-1 flex-col items-baseline overflow-hidden text-sm",
			className,
		)}
		data-component="CardBodyEntry"
		{...props}
	>
		<div className="w-full">{children}</div>
	</div>
)

const CardBodyEntryTitle = ({ children }: { children: React.ReactNode }) => (
	<p
		className="CardBodyEntryTitle pb-1 text-[13px] font-semibold"
		data-component="CardBodyEntryTitle"
	>
		{children}
	</p>
)

const BookCardComponents = {
	CardBase,
	CardHeader,
	CardHeaderMeta,
	CardHeaderTitle,
	CardHeaderSubtitle,
	CardHeaderUpperTitle,
	CardHeaderActions,
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
	headerPrefix?: CardHeaderPrefixProps
	bodyLayout: "row" | "grid" | "column"
	bodyStyle?: CSSProperties
	bodyClassName?: string
	actions?: React.ReactNode
} & CollapsibleProps

export const BookCard = forwardRef(
	(
		{
			title,
			subtitle,
			upperTitle,
			headerPrefix,
			actions,
			bodyStyle,
			bodyClassName,
			bodyLayout,
			children,
			...props
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

		const forwardedRef = ref

		return (
			<CardBase
				ref={forwardedRef}
				header={
					<CardHeader headerPrefix={headerPrefix}>
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
						<CardHeaderActions>{actions}</CardHeaderActions>
					</CardHeader>
				}
				{...props}
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
